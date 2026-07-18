import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types/domain";

export async function getEventsByThread(threadId: string): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("thread_id", threadId)
    .order("timestamp", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getEvent(id: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Most recent events across every thread the user owns, for the Radar's "o que mudou" question. */
export async function getRecentEvents(limit = 10): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export interface RecentEventWithContext extends Event {
  thread: { title: string; workspace: { id: string; name: string } | null } | null;
}

/** Same as getRecentEvents, but joined with thread/workspace names for display. */
export async function getRecentEventsWithContext(
  limit = 8,
): Promise<RecentEventWithContext[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, thread:threads(title, workspace:workspaces(id, name))")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as unknown as RecentEventWithContext[];
}
