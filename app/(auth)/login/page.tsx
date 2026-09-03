import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/auth-forms";
import { FormMessage } from "@/components/ui/field";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-h2 text-foreground">Sign in</h1>
        <p className="text-body-sm text-muted-foreground">
          Your library, tools and downloads.
        </p>
      </div>

      {error === "profile_missing" ? (
        <FormMessage tone="error">
          Your account exists but its profile is missing. Contact support so it
          can be repaired.
        </FormMessage>
      ) : null}

      <LoginForm next={next} />

      <div className="flex flex-col gap-2 text-body-sm text-muted-foreground">
        <Link
          href="/forgot-password"
          className="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Forgot your password?
        </Link>
        <p>
          No account?{" "}
          <Link
            href="/signup"
            className="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
