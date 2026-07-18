import { createClient } from "@/lib/supabase/server";

// Behavior Engine (Sprint 2.5 — see ../../../SPRINT_2_5.md §4). Pure, deterministic
// aggregation over `observations` — no LLM, no external calls. Mirrors the shape of
// src/lib/data/insights.ts.

const ACTIVE_WINDOW_DAYS = 7;
const ABANDONED_WORKSPACE_DAYS = 14;
const FORGOTTEN_THREAD_DAYS = 7;

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function startOfDayIso(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// ─── Workspace mais ativo / abandonado ──────────────────────────────────────

export interface WorkspaceActivity {
  workspace_id: string;
  workspace_name: string;
  count: number;
}

/** Workspace com mais Observations nos últimos `days` dias — "onde meu foco se concentrou". */
export async function getMostActiveWorkspace(
  days = ACTIVE_WINDOW_DAYS,
): Promise<WorkspaceActivity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("observations")
    .select("workspace_id")
    .not("workspace_id", "is", null)
    .gte("created_at", daysAgoIso(days));
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data as { workspace_id: string }[]) {
    counts.set(row.workspace_id, (counts.get(row.workspace_id) ?? 0) + 1);
  }
  if (counts.size === 0) return null;

  const [workspaceId, count] = [...counts.entries()].reduce((a, b) => (b[1] > a[1] ? b : a));

  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .select("name")
    .eq("id", workspaceId)
    .maybeSingle();
  if (wsError) throw wsError;

  return { workspace_id: workspaceId, workspace_name: workspace?.name ?? "", count };
}

/** Contagem de Observations de um único Workspace nos últimos `days` dias — alimenta WorkspaceActivityBadge. */
export async function getWorkspaceActivityCount(
  workspaceId: string,
  days = ACTIVE_WINDOW_DAYS,
): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("observations")
    .select("*", { count: "exact", head: true })
    .eq("workspace_id", workspaceId)
    .gte("created_at", daysAgoIso(days));
  if (error) throw error;
  return count ?? 0;
}

export interface AbandonedWorkspace {
  id: string;
  name: string;
  last_observed_at: string | null;
}

/** Workspaces sem nenhuma Observation há ABANDONED_WORKSPACE_DAYS dias (ou nunca observados). */
export async function getAbandonedWorkspaces(
  days = ABANDONED_WORKSPACE_DAYS,
): Promise<AbandonedWorkspace[]> {
  const supabase = await createClient();
  const [{ data: workspaces, error: wsError }, { data: observations, error: obsError }] =
    await Promise.all([
      supabase.from("workspaces").select("id, name"),
      supabase
        .from("observations")
        .select("workspace_id, created_at")
        .not("workspace_id", "is", null)
        .order("created_at", { ascending: false }),
    ]);
  if (wsError) throw wsError;
  if (obsError) throw obsError;

  const lastSeen = new Map<string, string>();
  for (const row of observations as { workspace_id: string; created_at: string }[]) {
    if (!lastSeen.has(row.workspace_id)) lastSeen.set(row.workspace_id, row.created_at);
  }

  const cutoff = daysAgoIso(days);
  return (workspaces as { id: string; name: string }[])
    .map((w) => ({ id: w.id, name: w.name, last_observed_at: lastSeen.get(w.id) ?? null }))
    .filter((w) => !w.last_observed_at || w.last_observed_at < cutoff);
}

// ─── Thread mais movimentada / esquecida ────────────────────────────────────

export interface ThreadActivity {
  thread_id: string;
  last_observed_at: string | null;
  observation_count: number;
}

/** Último acesso + contagem de Observations por Thread, em lote — evita N+1 em listas de Thread. */
export async function getThreadActivityMap(
  threadIds: string[],
): Promise<Record<string, ThreadActivity>> {
  const map: Record<string, ThreadActivity> = {};
  for (const id of threadIds) map[id] = { thread_id: id, last_observed_at: null, observation_count: 0 };
  if (threadIds.length === 0) return map;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("observations")
    .select("thread_id, created_at")
    .in("thread_id", threadIds)
    .order("created_at", { ascending: false });
  if (error) throw error;

  for (const row of data as { thread_id: string; created_at: string }[]) {
    const entry = map[row.thread_id];
    if (!entry) continue;
    if (!entry.last_observed_at) entry.last_observed_at = row.created_at;
    entry.observation_count += 1;
  }
  return map;
}

export interface ThreadActivitySummary extends ThreadActivity {
  title: string;
  workspace_id: string;
  workspace_name: string;
}

/** Thread com mais Observations nos últimos `days` dias. */
export async function getMostActiveThread(
  days = ACTIVE_WINDOW_DAYS,
): Promise<ThreadActivitySummary | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("observations")
    .select("thread_id")
    .not("thread_id", "is", null)
    .gte("created_at", daysAgoIso(days));
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data as { thread_id: string }[]) {
    counts.set(row.thread_id, (counts.get(row.thread_id) ?? 0) + 1);
  }
  if (counts.size === 0) return null;

  const [threadId, count] = [...counts.entries()].reduce((a, b) => (b[1] > a[1] ? b : a));

  const { data: thread, error: threadError } = await supabase
    .from("threads")
    .select("title, workspace_id, workspace:workspaces(name)")
    .eq("id", threadId)
    .maybeSingle();
  if (threadError) throw threadError;
  if (!thread) return null;

  const row = thread as unknown as {
    title: string;
    workspace_id: string;
    workspace: { name: string } | null;
  };
  return {
    thread_id: threadId,
    last_observed_at: null,
    observation_count: count,
    title: row.title,
    workspace_id: row.workspace_id,
    workspace_name: row.workspace?.name ?? "",
  };
}

export interface ForgottenThread {
  id: string;
  title: string;
  workspace_id: string;
  workspace_name: string;
  last_observed_at: string | null;
}

/**
 * Threads `in_progress` sem nenhuma Observation (visita, evento, consolidação) há
 * FORGOTTEN_THREAD_DAYS dias. Complementa getStalledThreads() de src/lib/data/insights.ts,
 * que olha só para Events — esta olha para qualquer sinal comportamental, incl. simplesmente
 * abrir a Thread sem registrar nada.
 */
export async function getForgottenThreads(days = FORGOTTEN_THREAD_DAYS): Promise<ForgottenThread[]> {
  const supabase = await createClient();
  const { data: threads, error: threadsError } = await supabase
    .from("threads")
    .select("id, title, workspace_id, workspace:workspaces(name)")
    .eq("status", "in_progress");
  if (threadsError) throw threadsError;

  const threadRows = threads as unknown as Array<{
    id: string;
    title: string;
    workspace_id: string;
    workspace: { name: string } | null;
  }>;
  if (threadRows.length === 0) return [];

  const activity = await getThreadActivityMap(threadRows.map((t) => t.id));
  const cutoff = daysAgoIso(days);

  return threadRows
    .filter((t) => {
      const lastObserved = activity[t.id]?.last_observed_at ?? null;
      return !lastObserved || lastObserved < cutoff;
    })
    .map((t) => ({
      id: t.id,
      title: t.title,
      workspace_id: t.workspace_id,
      workspace_name: t.workspace?.name ?? "",
      last_observed_at: activity[t.id]?.last_observed_at ?? null,
    }));
}

// ─── Distribuição de tipos de Event ─────────────────────────────────────────

export interface EventTypeCount {
  type: string;
  count: number;
}

/** Distribuição de Observations `event_created` por tipo de Event, nos últimos `days` dias. */
export async function getDominantEventTypes(days = 30): Promise<EventTypeCount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("observations")
    .select("metadata")
    .eq("type", "event_created")
    .gte("created_at", daysAgoIso(days));
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data as { metadata: Record<string, unknown> }[]) {
    const type =
      typeof row.metadata?.event_type === "string" ? (row.metadata.event_type as string) : "unknown";
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

// ─── Padrão de captura por horário ───────────────────────────────────────────

export interface CaptureHourBucket {
  hour: number;
  count: number;
}

/** Distribuição de Observations `capture_created` por hora do dia — "quando eu costumo capturar". */
export async function getCapturePatterns(days = 30): Promise<CaptureHourBucket[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("observations")
    .select("created_at")
    .eq("type", "capture_created")
    .gte("created_at", daysAgoIso(days));
  if (error) throw error;

  const buckets = new Array(24).fill(0) as number[];
  for (const row of data as { created_at: string }[]) {
    buckets[new Date(row.created_at).getHours()] += 1;
  }
  return buckets.map((count, hour) => ({ hour, count })).filter((b) => b.count > 0);
}

/** A hora do dia com mais capturas, se houver dado suficiente. */
export async function getPeakCaptureHour(days = 30): Promise<CaptureHourBucket | null> {
  const buckets = await getCapturePatterns(days);
  if (buckets.length === 0) return null;
  return buckets.reduce((a, b) => (b.count > a.count ? b : a));
}

// ─── Lag de consolidação ─────────────────────────────────────────────────────

/**
 * Tempo médio (em dias) entre o primeiro Event-fonte e a consolidação do Knowledge —
 * "quanto tempo uma decisão demora para ser consolidada".
 */
export async function getConsolidationLag(): Promise<number | null> {
  const supabase = await createClient();
  const { data: knowledgeItems, error } = await supabase
    .from("knowledge")
    .select("updated_at, source_event_ids");
  if (error) throw error;

  const rows = knowledgeItems as unknown as Array<{ updated_at: string; source_event_ids: string[] }>;
  const allEventIds = [...new Set(rows.flatMap((k) => k.source_event_ids))];
  if (allEventIds.length === 0) return null;

  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("id, timestamp")
    .in("id", allEventIds);
  if (eventsError) throw eventsError;

  const eventTimestamps = new Map(
    (events as { id: string; timestamp: string }[]).map((e) => [e.id, new Date(e.timestamp).getTime()]),
  );

  const lagsMs: number[] = [];
  for (const k of rows) {
    const timestamps = k.source_event_ids
      .map((id) => eventTimestamps.get(id))
      .filter((t): t is number => t !== undefined);
    if (timestamps.length === 0) continue;
    const earliest = Math.min(...timestamps);
    lagsMs.push(new Date(k.updated_at).getTime() - earliest);
  }
  if (lagsMs.length === 0) return null;

  const avgMs = lagsMs.reduce((sum, ms) => sum + ms, 0) / lagsMs.length;
  return Math.round((avgMs / (24 * 60 * 60 * 1000)) * 10) / 10;
}

// ─── Dias consecutivos de uso ────────────────────────────────────────────────

/** Número de dias consecutivos (terminando hoje) com ao menos uma Observation. */
export async function getConsecutiveActiveDays(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("observations")
    .select("created_at")
    .gte("created_at", daysAgoIso(90))
    .order("created_at", { ascending: false });
  if (error) throw error;

  const activeDays = new Set(
    (data as { created_at: string }[]).map((row) => new Date(row.created_at).toDateString()),
  );

  let streak = 0;
  const cursor = new Date();
  while (activeDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// ─── Timeline diária ──────────────────────────────────────────────────────────

export interface DailyTimeline {
  date: string;
  captures: number;
  decisions: number;
  knowledgeConsolidated: number;
  longestGapMinutes: number | null;
}

/** Timeline pessoal de um dia — alimenta PersonalTimelineSection no Radar. */
export async function getDailyTimeline(date: Date = new Date()): Promise<DailyTimeline> {
  const supabase = await createClient();
  const start = startOfDayIso(date);
  const end = new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("observations")
    .select("type, metadata, created_at")
    .gte("created_at", start)
    .lt("created_at", end)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const rows = data as { type: string; metadata: Record<string, unknown>; created_at: string }[];

  const captures = rows.filter((r) => r.type === "capture_created").length;
  const decisions = rows.filter(
    (r) => r.type === "event_created" && r.metadata?.event_type === "decision",
  ).length;
  const knowledgeConsolidated = rows.filter((r) => r.type === "knowledge_consolidated").length;

  let longestGapMinutes: number | null = null;
  for (let i = 1; i < rows.length; i++) {
    const gapMinutes =
      (new Date(rows[i].created_at).getTime() - new Date(rows[i - 1].created_at).getTime()) /
      (60 * 1000);
    if (longestGapMinutes === null || gapMinutes > longestGapMinutes) longestGapMinutes = gapMinutes;
  }

  return { date: start.slice(0, 10), captures, decisions, knowledgeConsolidated, longestGapMinutes };
}

// ─── Evolução semanal ─────────────────────────────────────────────────────────

export interface WeeklyEvolution {
  currentWeek: { captures: number; events: number; knowledgeConsolidated: number };
  previousWeek: { captures: number; events: number; knowledgeConsolidated: number };
}

async function getWeekCounts(fromDaysAgo: number, toDaysAgo: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("observations")
    .select("type")
    .gte("created_at", daysAgoIso(fromDaysAgo))
    .lt("created_at", daysAgoIso(toDaysAgo));
  if (error) throw error;

  const rows = data as { type: string }[];
  return {
    captures: rows.filter((r) => r.type === "capture_created").length,
    events: rows.filter((r) => r.type === "event_created").length,
    knowledgeConsolidated: rows.filter((r) => r.type === "knowledge_consolidated").length,
  };
}

/** Semana atual (últimos 7 dias) vs. semana anterior (7-14 dias atrás). */
export async function getWeeklyEvolution(): Promise<WeeklyEvolution> {
  const [currentWeek, previousWeek] = await Promise.all([getWeekCounts(7, 0), getWeekCounts(14, 7)]);
  return { currentWeek, previousWeek };
}
