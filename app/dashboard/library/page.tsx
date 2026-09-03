import { Library } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "My Library" };

export default function LibraryPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-foreground">My Library</h2>
        <p className="text-body-sm text-muted-foreground">
          Everything you own, plus anything your membership includes.
        </p>
      </div>

      <EmptyState
        icon={Library}
        title="Nothing here yet"
        description="Entitlements are built in Phase 6. Once checkout is live, purchases appear here automatically — granted from a verified payment webhook, never from a redirect."
        action={{ label: "Browse the catalog", href: "/products" }}
      />
    </div>
  );
}
