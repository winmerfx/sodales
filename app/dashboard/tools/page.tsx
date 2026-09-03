import { Sparkles } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "AI Tools" };

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-foreground">AI Tools</h2>
        <p className="text-body-sm text-muted-foreground">
          Tools you can run, with your remaining monthly quota.
        </p>
      </div>

      <EmptyState
        icon={Sparkles}
        title="No tools available yet"
        description="The first AI tool ships in Phase 8. Usage is metered per plan — no plan offers unlimited generation, because every request costs money to run."
        action={{ label: "See AI tools", href: "/products?type=tool" }}
      />
    </div>
  );
}
