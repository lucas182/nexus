import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the authenticated user, memoized for the duration of a single
 * request (React `cache`). Layout, page loaders, Server Actions and
 * `logObservation` all call this instead of `supabase.auth.getUser()`
 * directly — otherwise each call re-validates the JWT against the Supabase
 * auth server over the network, adding serial round-trips to every render.
 */
export const getCachedUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
