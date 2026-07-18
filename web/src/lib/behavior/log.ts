import { createClient } from "@/lib/supabase/server";
import type { ObservationType } from "@/types/domain";

export interface LogObservationOptions {
  workspaceId?: string | null;
  threadId?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Records a behavioral Observation (Sprint 2.5 — see ../../../SPRINT_2_5.md).
 * Never throws: telemetry is an auxiliary layer and a failure here must never
 * break the user-facing action that triggered it.
 */
export async function logObservation(
  type: ObservationType,
  opts: LogObservationOptions = {},
): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("observations").insert({
      user_id: user.id,
      type,
      workspace_id: opts.workspaceId ?? null,
      thread_id: opts.threadId ?? null,
      entity_id: opts.entityId ?? null,
      metadata: opts.metadata ?? {},
    });
  } catch {
    // Swallow — see doc comment above.
  }
}
