import {
  Boxes,
  BookOpen,
  Database,
  Download,
  ExternalLink,
  FileText,
  LayoutTemplate,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PRODUCT_TYPE_LABELS, type ProductType } from "@/lib/products/types";
import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER product artwork.
 *
 * Real products get real screenshots, workflow diagrams and device mockups —
 * docs/DESIGN_SYSTEM.md section 6 rules out generic abstract art as the final
 * treatment. This exists so the catalog has a considered visual while the
 * launch catalog and its imagery are still open decisions.
 *
 * When a product has cover_image_url set, render an <Image> instead of this.
 */

const icons: Record<ProductType, LucideIcon> = {
  tool: Sparkles,
  workflow: Workflow,
  automation: Zap,
  prompt_system: FileText,
  template: LayoutTemplate,
  database: Database,
  course: BookOpen,
  bundle: Boxes,
  download: Download,
  external_access: ExternalLink,
};

export function ProductArtwork({
  productType,
  className,
}: {
  productType: ProductType;
  className?: string;
}) {
  const Icon = icons[productType];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-surface-muted",
        className,
      )}
    >
      {/* Restrained violet atmosphere - one soft source, not a neon wash */}
      <div className="pointer-events-none absolute -right-1/4 -top-1/2 size-[130%] rounded-full bg-primary/12 blur-3xl" />

      <Icon
        size={40}
        strokeWidth={1.25}
        className="relative text-accent/70"
      />

      <span className="absolute bottom-3 left-4 text-label uppercase text-subtle-foreground">
        {PRODUCT_TYPE_LABELS[productType]}
      </span>
    </div>
  );
}
