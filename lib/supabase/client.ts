import { createBrowserClient } from "@supabase/ssr";

import { clientEnv } from "@/lib/config/env";

/**
 * Browser Supabase client.
 *
 * Uses the anon key, which is SAFE to expose - every query it makes is
 * constrained by row-level security. Use only in Client Components.
 *
 * For server code use `lib/supabase/server.ts`.
 */
export function createClient() {
  return createBrowserClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
