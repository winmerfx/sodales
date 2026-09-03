import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { clientEnv } from "@/lib/config/env";

/**
 * Server Supabase client, scoped to the signed-in user's session.
 *
 * This is the DEFAULT client for server code. It uses the anon key plus the
 * user's session cookie, so row-level security still applies and acts as the
 * second line of defence behind the explicit server-side checks.
 *
 * Reach for `lib/supabase/admin.ts` only where RLS genuinely must be bypassed
 * (webhook processing, entitlement grants, signed URLs).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    },
  );
}
