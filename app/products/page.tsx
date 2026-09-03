import { SearchX } from "lucide-react";
import type { Metadata } from "next";

import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductSearch } from "@/components/products/product-search";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import {
  buildFilterHref,
  hasActiveFilters,
  parseFilters,
  type RawSearchParams,
} from "@/lib/products/filters";
import { listCategories, listProducts } from "@/lib/products/queries";

export const metadata: Metadata = {
  title: "Products",
  description:
    "AI tools, automations, n8n workflows, prompt systems and templates. Every product is judged on whether it produces the result it promised.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filters = parseFilters(await searchParams);

  const [products, categories] = await Promise.all([
    listProducts(filters),
    listCategories(),
  ]);

  return (
    <>
      <Section surface="dark" spacing="sm">
        <Container>
          <SectionHeader
            as="h1"
            size="h1"
            eyebrow="Catalog"
            title="Everything SODALES makes"
            subtitle="Tools, systems and workflows built to produce a result on the first pass — not to sit in a folder."
          />
        </Container>
      </Section>

      <Section surface="light" spacing="md">
        <Container>
          <div className="flex flex-col gap-8">
            <div className="max-w-md">
              <ProductSearch filters={filters} />
            </div>

            <ProductFilters filters={filters} categories={categories} />

            <div className="flex items-center justify-between border-t border-border pt-6">
              <p className="text-body-sm text-muted-foreground" aria-live="polite">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
                {filters.q ? (
                  <>
                    {" "}
                    matching{" "}
                    <span className="text-foreground">
                      &ldquo;{filters.q}&rdquo;
                    </span>
                  </>
                ) : null}
              </p>
            </div>

            {products.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <li key={product.id} className="flex">
                    <ProductCard product={product} className="w-full" />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={SearchX}
                title="Nothing matches those filters"
                description="The catalog is deliberately small — every product has to earn its place. Try widening the filters, or browse everything."
                action={{
                  label: "Clear filters",
                  href: buildFilterHref(filters, {
                    q: null,
                    category: null,
                    type: null,
                    price: null,
                  }),
                }}
              />
            )}

            {hasActiveFilters(filters) && products.length > 0 ? (
              <p className="text-body-sm text-subtle-foreground">
                Filters are held in the URL — this view can be bookmarked or
                shared as-is.
              </p>
            ) : null}
          </div>
        </Container>
      </Section>
    </>
  );
}
