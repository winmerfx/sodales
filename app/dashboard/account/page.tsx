import { signOutAction } from "@/app/(auth)/actions";
import { AccountForm } from "@/app/dashboard/account/account-form";
import { Button } from "@/components/ui/button";
import { requireProfile } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const profile = await requireProfile("/dashboard/account");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-foreground">Account</h2>
        <p className="text-body-sm text-muted-foreground">
          Your profile and sign-in details.
        </p>
      </div>

      <AccountForm
        fullName={profile.full_name}
        marketingOptIn={profile.marketing_opt_in}
      />

      <dl className="flex max-w-md flex-col gap-4 border-t border-border pt-8">
        <div className="flex flex-col gap-1">
          <dt className="text-label uppercase text-subtle-foreground">Email</dt>
          <dd className="text-body-sm text-foreground">{profile.email}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-label uppercase text-subtle-foreground">
            Member since
          </dt>
          <dd className="text-body-sm text-foreground">
            {formatDate(profile.created_at)}
          </dd>
        </div>
        {profile.role === "admin" ? (
          <div className="flex flex-col gap-1">
            <dt className="text-label uppercase text-subtle-foreground">Role</dt>
            <dd className="text-body-sm text-accent">Administrator</dd>
          </div>
        ) : null}
      </dl>

      <div className="flex flex-col gap-3 border-t border-border pt-8">
        <h3 className="text-h4 text-foreground">Password</h3>
        <p className="max-w-[60ch] text-body-sm text-muted-foreground">
          Passwords are changed through an emailed link rather than in this form,
          so an unattended signed-in session cannot be used to lock you out.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/forgot-password" variant="secondary" size="sm">
            Send a reset link
          </Button>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
