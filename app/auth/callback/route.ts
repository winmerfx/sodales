import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Auth callback.
 *
 * Where Supabase sends people after they click an emailed link — confirmation,
 * magic link, or password recovery. Exchanges the one-time code for a session
 * cookie, then forwards them on.
 *
 * The `next` parameter is checked against same-origin paths only. Reflecting an
 * arbitrary URL here would turn the confirmation email into an open redirect,
 * which is a ready-made phishing vector.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";

  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=invalid_code`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
