import type { Metadata } from "next";

import { PolicyPage } from "@/components/marketing/policy-page";

export const metadata: Metadata = {
  title: "Refunds",
  description: "When SODALES refunds a purchase.",
  alternates: { canonical: "/refunds" },
};

export default function RefundsPage() {
  return (
    <PolicyPage
      title="Refunds"
      summary="When a purchase can be refunded, and how to ask."
      mustCover={[
        "The refund window, and whether it differs for one-time purchases and memberships.",
        "Whether downloading a file affects eligibility — digital goods are commonly excluded once accessed, and that must be stated before purchase, not after.",
        "How a refund is requested and how long it takes to process.",
        "What happens to access and entitlements once a refund is issued.",
        "Membership cancellation: that access continues to the end of the paid period rather than stopping immediately, and that partial periods are not refunded.",
        "Failed payments and what happens to access during a retry period.",
        "That a product not working as described is treated differently from simply changing your mind.",
      ]}
    >
      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-h4 text-foreground">Why this one matters first</h2>
        <p className="mt-3 text-body-sm text-muted-foreground">
          Of the three policies this is the one to write first. Payment
          providers generally require a published refund policy before approving
          a merchant account, and customers read it before buying a digital
          product they cannot inspect in advance.
        </p>
      </div>
    </PolicyPage>
  );
}
