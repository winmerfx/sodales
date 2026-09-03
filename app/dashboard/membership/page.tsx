import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Membership" };

export default function MembershipPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-foreground">Membership</h2>
        <p className="text-body-sm text-muted-foreground">
          Your plan, renewal date and billing.
        </p>
      </div>

      <EmptyState
        icon={CreditCard}
        title="No active membership"
        description="Memberships arrive in Phase 7. Cancelling will always keep your access until the end of the period you have paid for."
        action={{ label: "See pricing", href: "/pricing" }}
      />
    </div>
  );
}
