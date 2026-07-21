import { createClient } from "@/lib/supabase/server";
import type { Event, Thread, Workspace } from "@/types/domain";

export interface DerivedWorkspaceContext {
  objective: string | null;
  lastDecision: string | null;
  majorRisk: string | null;
  nextStep: string | null;
  openThreads: Thread[];
  latestEventAt: string | null;
}

/**
 * Pure derivation — no I/O. `threadRows` must be ordered by updated_at desc and
 * `events` by timestamp desc (the callers guarantee this). Human corrections on
 * the Workspace remain overrides; no LLM is involved.
 */
function deriveContext(workspace: Workspace, threadRows: Thread[], events: Event[]): DerivedWorkspaceContext {
  const openThreads = threadRows.filter((thread) => ["created", "in_progress", "paused"].includes(thread.status));
  const currentThread = openThreads.find((thread) => thread.status === "in_progress") ?? openThreads[0] ?? null;
  const decision = events.find((event) => event.type === "decision");
  const risk = events.find((event) => event.type === "problem" && event.impact === "high") ?? events.find((event) => event.type === "problem");
  return {
    objective: workspace.context_status || currentThread?.objetivo || currentThread?.title || null,
    lastDecision: workspace.context_decisao_recente || decision?.description || null,
    majorRisk: workspace.context_maior_risco || risk?.description || null,
    nextStep: workspace.context_proximo_passo || (currentThread ? `Retomar ${currentThread.title}` : null),
    openThreads,
    latestEventAt: events[0]?.timestamp ?? null,
  };
}

/**
 * Deterministic context composition. Pass `prefetched` to reuse threads/events
 * a caller has already loaded (the Workspace page does this to avoid re-querying
 * the same rows it already rendered).
 */
export async function getDerivedWorkspaceContext(
  workspace: Workspace,
  prefetched?: { threads: Thread[]; events: Event[] },
): Promise<DerivedWorkspaceContext> {
  if (prefetched) return deriveContext(workspace, prefetched.threads, prefetched.events);

  const supabase = await createClient();
  const { data: threads, error: threadsError } = await supabase.from("threads").select("*").eq("workspace_id", workspace.id).order("updated_at", { ascending: false });
  if (threadsError) throw threadsError;
  const threadRows = (threads ?? []) as Thread[];
  const ids = threadRows.map((thread) => thread.id);
  let events: Event[] = [];
  if (ids.length) {
    const { data, error } = await supabase.from("events").select("*").in("thread_id", ids).order("timestamp", { ascending: false });
    if (error) throw error;
    events = (data ?? []) as Event[];
  }
  return deriveContext(workspace, threadRows, events);
}

/**
 * Batched derived context for many workspaces (Radar) — two queries total
 * instead of the previous 2×N. Threads and events are fetched once for all the
 * user's workspaces and grouped in memory.
 */
export async function getDerivedContextsForWorkspaces(
  workspaces: Workspace[],
): Promise<Array<{ workspace: Workspace; context: DerivedWorkspaceContext }>> {
  if (!workspaces.length) return [];
  const supabase = await createClient();
  const wsIds = workspaces.map((w) => w.id);

  const { data: threads, error: threadsError } = await supabase
    .from("threads")
    .select("*")
    .in("workspace_id", wsIds)
    .order("updated_at", { ascending: false });
  if (threadsError) throw threadsError;
  const threadRows = (threads ?? []) as Thread[];

  const threadIds = threadRows.map((t) => t.id);
  let events: Event[] = [];
  if (threadIds.length) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .in("thread_id", threadIds)
      .order("timestamp", { ascending: false });
    if (error) throw error;
    events = (data ?? []) as Event[];
  }

  const threadWorkspace = new Map(threadRows.map((t) => [t.id, t.workspace_id]));
  return workspaces.map((workspace) => {
    const wsThreads = threadRows.filter((t) => t.workspace_id === workspace.id);
    const wsEvents = events.filter((e) => threadWorkspace.get(e.thread_id) === workspace.id);
    return { workspace, context: deriveContext(workspace, wsThreads, wsEvents) };
  });
}

export interface ResumeContext {
  lastVisitedAt: string | null;
  eventsSinceVisit: Event[];
  decisionsSinceVisit: Event[];
}

export async function getThreadResumeContext(threadId: string): Promise<ResumeContext> {
  const supabase = await createClient();
  const { data: observations, error: observationError } = await supabase.from("observations").select("created_at").eq("thread_id", threadId).eq("type", "thread_opened").order("created_at", { ascending: false }).limit(2);
  if (observationError) throw observationError;
  const lastVisitedAt = observations?.[1]?.created_at ?? null;
  let query = supabase.from("events").select("*").eq("thread_id", threadId).order("timestamp", { ascending: false });
  if (lastVisitedAt) query = query.gt("timestamp", lastVisitedAt);
  const { data: events, error } = await query;
  if (error) throw error;
  const rows = (events ?? []) as Event[];
  return { lastVisitedAt, eventsSinceVisit: rows, decisionsSinceVisit: rows.filter((event) => event.type === "decision") };
}

export async function getWorkspaceResumeContext(workspaceId: string): Promise<ResumeContext> {
  const supabase = await createClient();
  const { data: observations, error: observationError } = await supabase.from("observations").select("created_at").eq("workspace_id", workspaceId).eq("type", "workspace_opened").order("created_at", { ascending: false }).limit(2);
  if (observationError) throw observationError;
  const lastVisitedAt = observations?.[1]?.created_at ?? null;
  const { data: threads, error: threadsError } = await supabase.from("threads").select("id").eq("workspace_id", workspaceId);
  if (threadsError) throw threadsError;
  const ids = (threads ?? []).map((thread) => thread.id);
  if (!ids.length) return { lastVisitedAt, eventsSinceVisit: [], decisionsSinceVisit: [] };
  let query = supabase.from("events").select("*").in("thread_id", ids).order("timestamp", { ascending: false });
  if (lastVisitedAt) query = query.gt("timestamp", lastVisitedAt);
  const { data: events, error } = await query;
  if (error) throw error;
  const rows = (events ?? []) as Event[];
  return { lastVisitedAt, eventsSinceVisit: rows, decisionsSinceVisit: rows.filter((event) => event.type === "decision") };
}

export interface ContinueContext {
  threadId: string;
  threadTitle: string;
  workspaceId: string;
  workspaceName: string;
  lastVisitedAt: string;
}

export async function getContinueContext(): Promise<ContinueContext | null> {
  const supabase = await createClient();
  const { data: observation, error } = await supabase.from("observations").select("thread_id, created_at").eq("type", "thread_opened").not("thread_id", "is", null).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  if (!observation?.thread_id) return null;
  const { data: thread, error: threadError } = await supabase.from("threads").select("id, title, workspace_id, workspace:workspaces(name)").eq("id", observation.thread_id).maybeSingle();
  if (threadError || !thread) return null;
  const row = thread as unknown as { id: string; title: string; workspace_id: string; workspace: { name: string } | null };
  return { threadId: row.id, threadTitle: row.title, workspaceId: row.workspace_id, workspaceName: row.workspace?.name ?? "", lastVisitedAt: observation.created_at };
}
