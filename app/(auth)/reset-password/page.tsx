import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/auth/auth-forms";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  // Reachable only with the recovery session created by the emailed link.
  await requireUser("/reset-password");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-h2 text-foreground">Set a new password</h1>
        <p className="text-body-sm text-muted-foreground">
          Once saved you will be signed in on this device.
        </p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}
