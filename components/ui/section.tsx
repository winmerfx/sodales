import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Surface = "light" | "dark";
type Spacing = "none" | "sm" | "md" | "lg";

const spacings: Record<Spacing, string> = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24 lg:py-28",
  lg: "py-20 md:py-28 lg:py-32",
};

/**
 * A full-width band of the page.
 *
 * Setting `surface` writes data-surface on this element, which re-points every
 * semantic token for the whole subtree. That is how one page carries both dark
 * and light compositions without any component knowing which it is inside.
 *
 * Sections may nest and invert freely.
 */
export function Section({
  surface = "light",
  spacing = "md",
  as: Tag = "section",
  className,
  children,
  ...rest
}: {
  surface?: Surface;
  spacing?: Spacing;
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      data-surface={surface}
      className={cn(
        "bg-background text-foreground",
        spacings[spacing],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
