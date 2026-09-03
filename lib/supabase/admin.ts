import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { clientEnv, getServerEnv } from "@/lib/config/env";

/**
 * ###########################################################################
 * ADMIN CLIENT - USES THE SERVICE ROLE KEY AND BYPASSES ALL ROW-LEVEL SECURITY
 * ###########################################################################
 *
 * This client can read and modify every row in the database, including other
 * customers' orders. It exists for exactly three jobs:
 *
 *   1. Webhook processing      (no user session exists)
 *   2. Entitlement grants      (customers must never write their own)
 *   3. Signed URL issuance     (after canUserAccessProduct has passed)
 *
 * Anything else uses `lib/supabase/server.ts`, where RLS still applies.
 *
 * The `import 'server-only'` above turns any import of this module from client
 * code into a build error. Do not remove it.
 *
 * Before calling this, ask: have I already checked that this specific user is
 * allowed this specific thing? If not, this is the wrong client.
 */
export function createAdminClient() {
  const { SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();

  return createSupabaseClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
