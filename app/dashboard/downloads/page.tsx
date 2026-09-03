import { Download } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Downloads" };

export default function DownloadsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-foreground">Downloads</h2>
        <p className="text-body-sm text-muted-foreground">
          Recent files and your download history.
        </p>
      </div>

      <EmptyState
        icon={Download}
        title="No downloads yet"
        description="Protected files are served through short-lived signed URLs after an entitlement check — never from a public link. That lands in Phase 6."
        action={{ label: "Browse the catalog", href: "/products" }}
      />
    </div>
  );
}
