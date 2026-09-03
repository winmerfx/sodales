import type {
  ProductFilters,
  ProductType,
  SortOption,
} from "@/lib/products/types";
import {
  FILTERABLE_PRODUCT_TYPES,
  SORT_LABELS,
} from "@/lib/products/types";

/**
 * Filter state lives entirely in the URL.
 *
 * That is what makes a filtered view shareable, bookmarkable, survivable across
 * a refresh, and indexable — none of which is true of component state.
 */

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Parse untrusted URL params into known values, discarding anything else. */
export function parseFilters(params: RawSearchParams): ProductFilters {
  const type = first(params.type);
  const price = first(params.price);
  const sort = first(params.sort);

  return {
    q: first(params.q)?.slice(0, 120) || undefined,
    category: first(params.category) || undefined,
    type: FILTERABLE_PRODUCT_TYPES.includes(type as ProductType)
      ? (type as ProductType)
      : undefined,
    price: price === "free" || price === "paid" ? price : undefined,
    sort: sort && sort in SORT_LABELS ? (sort as SortOption) : undefined,
  };
}

/**
 * Build a /products href from the current filters plus a change.
 * Passing null for a key clears it. Defaults are omitted so URLs stay short.
 */
export function buildFilterHref(
  current: ProductFilters,
  changes: Partial<Record<keyof ProductFilters, string | null>>,
): string {
  const next: Record<string, string | undefined> = {
    q: current.q,
    category: current.category,
    type: current.type,
    price: current.price,
    sort: current.sort,
  };

  for (const [key, value] of Object.entries(changes)) {
    next[key] = value === null ? undefined : value;
  }

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) {
    if (value && !(key === "sort" && value === "featured")) {
      search.set(key, value);
    }
  }

  const qs = search.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function hasActiveFilters(filters: ProductFilters): boolean {
  return Boolean(
    filters.q || filters.category || filters.type || filters.price,
  );
}
