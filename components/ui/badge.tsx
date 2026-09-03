import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "accent" | "success";

const tones: Record<BadgeTone, string> = {
  neutral: "border-border text-subtle-foreground",
  accent: "border-accent/35 text-accent",
  success: "border-success/35 text-success",
};

/**
 * Small pill label. Maximum two per product card — more reads as clutter.
 *
 * Outline rather than filled: a card full of solid violet rectangles is the
 * exact look docs/DESIGN_SYSTEM.md section 5.2 rules out.
 */
export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-label uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
