import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-h2 text-foreground">Reset your password</h1>
        <p className="text-body-sm text-muted-foreground">
          Enter your email and we will send a link to set a new one.
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-body-sm text-muted-foreground">
        <Link
          href="/login"
          className="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
