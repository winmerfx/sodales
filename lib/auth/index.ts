import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * Server-side auth helpers.
 *
 * These are the real authorization checks. Middleware only redirects for
 * convenience and the UI only hides things — neither is security. Every
 * protected page, Server Action and route handler calls one of these.
 *
 * See docs/ARCHITECTURE.md section 5.
 */

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "customer" | "admin";
  marketing_opt_in: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * The signed-in user, or null.
 *
 * Uses getUser(), which revalidates the token against Supabase. Never trust
 * getSession() for an authorization decision — it reads the cookie without
 * verifying it, so a forged cookie would pass.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as Profile) ?? null;
}

/** Redirects to /login, preserving where the user was trying to go. */
export async function requireUser(returnTo?: string) {
  const user = await getUser();
  if (!user) {
    const next = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
    redirect(`/login${next}`);
  }
  return user;
}

export async function requireProfile(returnTo?: string): Promise<Profile> {
  await requireUser(returnTo);
  const profile = await getProfile();

  // The signup trigger creates this row, so its absence means something is
  // genuinely wrong rather than merely unauthenticated.
  if (!profile) redirect("/login?error=profile_missing");
  return profile;
}

/**
 * Admin gate.
 *
 * Sends non-admins to /dashboard rather than showing a 403, so /admin does not
 * confirm to a probing customer that the route exists.
 */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile("/admin");
  if (profile.role !== "admin") redirect("/dashboard");
  return profile;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "admin";
}
