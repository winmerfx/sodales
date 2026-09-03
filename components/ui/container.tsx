import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerWidth = "narrow" | "content" | "wide" | "full";

const widths: Record<ContainerWidth, string> = {
  narrow: "max-w-narrow", // 880px  - long-form, legal, docs
  content: "max-w-content", // 1280px - default
  wide: "max-w-wide", // 1440px - full-bleed showcases
  full: "max-w-none",
};

export function Container({
  width = "content",
  className,
  children,
}: {
  width?: ContainerWidth;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 md:px-8 lg:px-12",
        widths[width],
        className,
      )}
    >
      {children}
    </div>
  );
}
