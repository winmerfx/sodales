import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

/**
 * Empty states are designed, not left as "no results".
 *
 * A new customer sees the empty dashboard before they ever see a full one, and
 * a catalog with over-narrow filters is the moment someone decides the store is
 * thin. Both deserve a real answer and a way forward.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border-strong px-6 py-16 text-center">
      <Icon
        size={26}
        strokeWidth={1.5}
        className="text-subtle-foreground"
        aria-hidden="true"
      />
      <h3 className="text-h4 text-foreground">{title}</h3>
      <p className="max-w-[46ch] text-body-sm text-muted-foreground">
        {description}
      </p>
      {action ? (
        <Button href={action.href} variant="secondary" size="sm" className="mt-2">
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
