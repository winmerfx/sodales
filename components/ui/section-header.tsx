import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

/**
 * Standard section heading block: optional eyebrow, heading, optional subhead.
 *
 * `as` controls the heading level so the document outline stays correct - pick
 * the level the page structure requires, not the one that looks right. Size is
 * controlled separately by `size`.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  as: Tag = "h2",
  size = "h2",
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
}) {
  const sizes = {
    display: "text-display",
    h1: "text-h1",
    h2: "text-h2",
    h3: "text-h3",
  } as const;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag className={cn(sizes[size], "text-foreground")}>{title}</Tag>
      {subtitle ? (
        <p
          className={cn(
            "text-body-lg max-w-[68ch] text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
