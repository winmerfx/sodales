"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ProductFilters } from "@/lib/products/queries";
import { buildFilterHref } from "@/lib/products/filters";

/**
 * Catalog search.
 *
 * The only Client Component in the catalog — every other filter is a plain
 * <Link>, so filtering works without JavaScript and each state has a real URL.
 * Submitting navigates rather than mutating local state, which keeps the URL
 * the single source of truth.
 */
export function ProductSearch({ filters }: { filters: ProductFilters }) {
  const router = useRouter();
  const [value, setValue] = useState(filters.q ?? "");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    router.push(buildFilterHref(filters, { q: value.trim() || null }));
  }

  function clear() {
    setValue("");
    router.push(buildFilterHref(filters, { q: null }));
  }

  return (
    <form onSubmit={submit} role="search" className="relative">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>

      <Search
        size={17}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle-foreground"
      />

      <input
        id="product-search"
        name="q"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products"
        autoComplete="off"
        className="h-11 w-full rounded-sm border border-border-strong bg-surface pl-10 pr-10 text-body-sm text-foreground placeholder:text-subtle-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />

      {value ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-sm text-subtle-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <X size={16} aria-hidden="true" />
        </button>
      ) : null}
    </form>
  );
}
