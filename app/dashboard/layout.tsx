import type { Metadata } from "next";

import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { requireProfile } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s — SODALES" },
  robots: { index: false, follow: false },
};

/**
 * The real guard for everything under /dashboard.
 *
 * Middleware already redirects anonymous traffic, but that is convenience —
 * this is the check that counts, and RLS backs it up underneath.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile("/dashboard");
  const firstName = profile.full_name?.split(" ")[0] ?? null;

  return (
    <Section surface="light" spacing="none" className="min-h-full py-10 md:py-14">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-label uppercase text-subtle-foreground">
              Your library
            </p>
            <h1 className="text-h2 text-foreground">
              {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
            </h1>
          </div>

          <DashboardNav />

          <div>{children}</div>
        </div>
      </Container>
    </Section>
  );
}
