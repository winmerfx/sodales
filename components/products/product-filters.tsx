import Link from "next/link";

import { buildFilterHref } from "@/lib/products/filters";
import type { ProductFilters as Filters } from "@/lib/products/queries";
import {
  FILTERABLE_PRODUCT_TYPES,
  PRODUCT_TYPE_LABELS,
  SORT_LABELS,
  type Category,
  type SortOption,
} from "@/lib/products/types";
import { cn } from "@/lib/utils";

/**
 * Catalog filters.
 *
 * Every control is a <Link>, not a button: filtering is navigation, so each
 * state gets a shareable URL, works with the back button, and functions with
 * JavaScript disabled. Only the search box needs client state.
 */

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-3.5 text-body-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-label uppercase text-subtle-foreground">{label}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function ProductFilters({
  filters,
  categories,
}: {
  filters: Filters;
  categories: Category[];
}) {
  return (
    <div className="flex flex-col gap-7">
      <Group label="Category">
        <Chip
          href={buildFilterHref(filters, { category: null })}
          active={!filters.category}
        >
          All
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            href={buildFilterHref(filters, { category: category.slug })}
            active={filters.category === category.slug}
          >
            {category.name}
          </Chip>
        ))}
      </Group>

      <Group label="Type">
        <Chip href={buildFilterHref(filters, { type: null })} active={!filters.type}>
          All
        </Chip>
        {FILTERABLE_PRODUCT_TYPES.map((type) => (
          <Chip
            key={type}
            href={buildFilterHref(filters, { type })}
            active={filters.type === type}
          >
            {PRODUCT_TYPE_LABELS[type]}
          </Chip>
        ))}
      </Group>

      <div className="grid gap-7 sm:grid-cols-2">
        <Group label="Price">
          <Chip
            href={buildFilterHref(filters, { price: null })}
            active={!filters.price}
          >
            All
          </Chip>
          <Chip
            href={buildFilterHref(filters, { price: "free" })}
            active={filters.price === "free"}
          >
            Free
          </Chip>
          <Chip
            href={buildFilterHref(filters, { price: "paid" })}
            active={filters.price === "paid"}
          >
            Paid
          </Chip>
        </Group>

        <Group label="Sort">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
            <Chip
              key={option}
              href={buildFilterHref(filters, { sort: option })}
              active={(filters.sort ?? "featured") === option}
            >
              {SORT_LABELS[option]}
            </Chip>
          ))}
        </Group>
      </div>
    </div>
  );
}
