import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { clientEnv } from "@/lib/config/env";

/**
 * Session-less server client for PUBLIC data.
 *
 * Uses the anon key with no cookie attached, so the database sees the `anon`
 * role and RLS returns only published rows. Two reasons this exists rather than
 * reusing lib/supabase/server.ts:
 *
 *   1. That client calls cookies(), which makes any page using it dynamic. The
 *      catalog and product pages are public and should stay static.
 *   2. cookies() cannot be called from generateStaticParams at all, so product
 *      pages could not be prerendered.
 *
 * Use only for data that is public by definition. Anything user-specific goes
 * through lib/supabase/server.ts so the query runs as that user.
 */
export function createPublicClient() {
  return createSupabaseClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
