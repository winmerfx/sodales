import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Small wide-tracked uppercase label.
 *
 * One of the three type tiers that carry the SODALES identity - see
 * docs/DESIGN_SYSTEM.md section 3.2. Use for category indicators, metadata,
 * status labels and short nav markers.
 *
 * Never for a sentence. Wide-tracked uppercase is unreadable at length.
 */
export function Eyebrow({
  as: Tag = "p",
  tone = "accent",
  className,
  children,
}: {
  as?: "p" | "span" | "div";
  tone?: "accent" | "muted";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "text-label uppercase",
        tone === "accent" ? "text-accent" : "text-subtle-foreground",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
