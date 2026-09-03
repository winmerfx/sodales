"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

/**
 * Header account affordance.
 *
 * Deliberately a Client Component. Reading the session on the server would call
 * cookies(), which opts every page rendering the header — including the
 * homepage and all product pages — out of static rendering. That is a real SEO
 * and performance cost for a purely cosmetic label.
 *
 * This is cosmetic only. It gates nothing: /dashboard and /admin are protected
 * by middleware, by requireUser/requireAdmin, and by RLS.
 */
export function AccountLink({
  fullWidth = false,
  onNavigate,
}: {
  fullWidth?: boolean;
  /** Lets the mobile panel close itself when this link is followed. */
  onNavigate?: () => void;
}) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return signedIn ? (
    <Button
      href="/dashboard"
      variant="ghost"
      size={fullWidth ? "lg" : "sm"}
      fullWidth={fullWidth}
      onClick={onNavigate}
    >
      Dashboard
    </Button>
  ) : (
    <Button
      href="/login"
      variant={fullWidth ? "secondary" : "ghost"}
      size={fullWidth ? "lg" : "sm"}
      fullWidth={fullWidth}
      onClick={onNavigate}
    >
      Sign in
    </Button>
  );
}
