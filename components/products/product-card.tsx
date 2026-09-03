import Link from "next/link";

import { ProductArtwork } from "@/components/products/product-artwork";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { membershipProductIds } from "@/lib/products/seed";
import {
  defaultOffer,
  isFree,
  PRODUCT_TYPE_LABELS,
  type ProductWithRelations,
} from "@/lib/products/types";
import { cn } from "@/lib/utils";

/**
 * Product card. See docs/DESIGN_SYSTEM.md section 5.2.
 *
 * The whole card is one link, so nothing interactive may be nested inside it —
 * a button in here would be unreachable by keyboard and invalid HTML.
 */
export function ProductCard({
  product,
  className,
}: {
  product: ProductWithRelations;
  className?: string;
}) {
  const offer = defaultOffer(product);
  const free = isFree(product);
  const inMembership = membershipProductIds.has(product.id);

  return (
    <article className={cn("group", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="flex h-full flex-col gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ProductArtwork
          productType={product.product_type}
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />

        <div className="flex flex-1 flex-col gap-2 px-1">
          <p className="text-label uppercase text-accent">
            {product.category?.name ?? PRODUCT_TYPE_LABELS[product.product_type]}
          </p>

          <h3 className="text-h4 text-foreground">{product.name}</h3>

          {product.tagline ? (
            <p className="line-clamp-2 text-body-sm text-muted-foreground">
              {product.tagline}
            </p>
          ) : null}

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-3">
            <span
              className={cn(
                "text-body-sm font-semibold",
                free ? "text-success" : "text-foreground",
              )}
            >
              {offer ? formatPrice(offer.price_cents, offer.currency) : "—"}
            </span>

            {offer?.compare_at_cents ? (
              <span className="text-body-sm text-subtle-foreground line-through">
                {formatPrice(offer.compare_at_cents, offer.currency)}
              </span>
            ) : null}

            {/* Maximum two badges - see the design system */}
            {inMembership ? <Badge tone="accent">Membership</Badge> : null}
            {product.product_type === "bundle" ? (
              <Badge>{product.bundle_items.length} products</Badge>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
