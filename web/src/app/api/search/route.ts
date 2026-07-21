import { NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logObservation } from "@/lib/behavior/log";

export interface SearchResult {
  id: string;
  kind: "workspace" | "thread" | "event" | "knowledge";
  title: string;
  subtitle: string;
  path: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const like = `%${q}%`;

  const [workspaces, threads, events, knowledge] = await Promise.all([
    supabase.from("workspaces").select("id, name").ilike("name", like).limit(5),
    supabase
      .from("threads")
      .select("id, title, workspace:workspaces(name)")
      .ilike("title", like)
      .limit(5),
    supabase
      .from("events")
      .select("id, description, thread_id, thread:threads(workspace:workspaces(name))")
      .ilike("description", like)
      .limit(8),
    supabase
      .from("knowledge")
      .select("id, title, content, thread_id")
      .or(`title.ilike.${like},content.ilike.${like}`)
      .limit(5),
  ]);

  const results: SearchResult[] = [
    ...(workspaces.data ?? []).map((w) => ({
      id: w.id,
      kind: "workspace" as const,
      title: w.name,
      subtitle: "Workspace",
      path: `/workspace/${w.id}`,
    })),
    ...(threads.data ?? []).map((t) => {
      const row = t as unknown as { id: string; title: string; workspace: { name: string } | null };
      return {
        id: row.id,
        kind: "thread" as const,
        title: row.title,
        subtitle: `Thread · ${row.workspace?.name ?? ""}`,
        path: `/thread/${row.id}`,
      };
    }),
    ...(events.data ?? []).map((e) => {
      const row = e as unknown as {
        id: string;
        description: string;
        thread_id: string;
        thread: { workspace: { name: string } | null } | null;
      };
      return {
        id: row.id,
        kind: "event" as const,
        title: row.description,
        subtitle: `Evento · ${row.thread?.workspace?.name ?? ""}`,
        path: `/thread/${row.thread_id}`,
      };
    }),
    ...(knowledge.data ?? []).map((k) => ({
      id: k.id,
      kind: "knowledge" as const,
      title: k.title,
      subtitle: "Knowledge",
      path: `/thread/${k.thread_id}`,
    })),
  ];

  after(() => logObservation("search_performed", { metadata: { query: q, result_count: results.length } }));

  return NextResponse.json({ results });
}
