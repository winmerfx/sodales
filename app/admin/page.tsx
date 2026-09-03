import { requireAdmin } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin placeholder.
 *
 * Exists in Phase 3 to prove the authorization boundary works end to end. The
 * real admin surface is built in Phase 4. requireAdmin() redirects non-admins
 * to /dashboard rather than returning 403, so the route does not confirm its
 * own existence to someone probing for it.
 */
export default async function AdminPage() {
  const profile = await requireAdmin();

  return (
    <Section surface="light" spacing="md" className="min-h-full">
      <Container>
        <div className="flex flex-col gap-4">
          <p className="text-label uppercase text-accent">Admin</p>
          <h1 className="text-h2 text-foreground">Administration</h1>
          <p className="max-w-[60ch] text-body-sm text-muted-foreground">
            Signed in as {profile.email} with the administrator role. Product,
            order, customer and entitlement management is built in Phase 4.
          </p>
        </div>
      </Container>
    </Section>
  );
}
