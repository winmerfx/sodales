import type { Metadata } from "next";

import { AdminNav } from "@/components/admin/admin-nav";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — SODALES Admin" },
  robots: { index: false, follow: false },
};

/**
 * The authorization boundary for everything under /admin.
 *
 * requireAdmin() redirects non-admins to /dashboard rather than returning 403,
 * so the route does not confirm its own existence to someone probing for it.
 * The admin RLS policies enforce the same rule at the database level.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();

  return (
    <Section surface="light" spacing="none" className="min-h-full py-10 md:py-14">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-label uppercase text-accent">Admin</p>
            <h1 className="text-h2 text-foreground">Administration</h1>
            <p className="text-body-sm text-muted-foreground">
              Signed in as {profile.email}
            </p>
          </div>

          <AdminNav />

          <div>{children}</div>
        </div>
      </Container>
    </Section>
  );
}
