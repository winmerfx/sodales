import type { Metadata } from "next";
import Link from "next/link";

import { SignupForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-h2 text-foreground">Create your account</h1>
        <p className="text-body-sm text-muted-foreground">
          Free to create. You only pay when you buy something.
        </p>
      </div>

      <SignupForm />

      <p className="text-body-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
