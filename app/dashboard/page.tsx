import { ArrowRight, Library, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getProfile } from "@/lib/auth";

export default async function DashboardOverviewPage() {
  const profile = await getProfile();

  return (
    <div className="flex flex-col gap-10">
      {/* Membership status */}
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-label uppercase text-subtle-foreground">
            Membership
          </p>
          <p className="text-body-lg text-foreground">No active membership</p>
          <p className="text-body-sm text-muted-foreground">
            Signed in as {profile?.email}
          </p>
        </div>
        <Button href="/pricing" variant="secondary">
          See membership
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-h3 text-foreground">Recent products</h2>
        <EmptyState
          icon={Library}
          title="Your library is empty"
          description="Anything you buy lands here within seconds of payment clearing. Purchases arrive in Phase 5 — for now the catalog is browsable."
          action={{ label: "Browse the catalog", href: "/products" }}
        />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-h3 text-foreground">Quick-launch tools</h2>
        <EmptyState
          icon={Sparkles}
          title="No tools yet"
          description="AI tools you own or that your membership includes will be launchable from here."
          action={{ label: "See AI tools", href: "/products?type=tool" }}
        />
      </section>
    </div>
  );
}
