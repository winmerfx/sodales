import { seedProducts, categories as seedCategories } from "@/lib/products/seed";
import {
  defaultOffer,
  isFree,
  type Category,
  type ProductFilters,
  type ProductType,
  type ProductWithRelations,
  type SortOption,
} from "@/lib/products/types";

/**
 * The storefront's data access layer.
 *
 * Phase 4 replaces the bodies of these functions with Supabase queries and
 * deletes ./seed.ts. Everything is async and returns the same shapes it will
 * return then, so no page or component changes when that happens.
 *
 * Do not read ./seed.ts directly from a component. Go through this module.
 */

function published(product: ProductWithRelations) {
  return product.status === "published";
}

function priceOf(product: ProductWithRelations): number {
  return defaultOffer(product)?.price_cents ?? 0;
}

/**
 * Naive relevance match over name, tagline and description.
 *
 * Phase 4 replaces this with the products.search_vector GIN index and
 * websearch_to_tsquery — see docs/DATABASE.md section 4.
 */
function matchesQuery(product: ProductWithRelations, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [
    product.name,
    product.tagline ?? "",
    product.description ?? "",
    product.category?.name ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return needle
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

function sortProducts(
  products: ProductWithRelations[],
  sort: SortOption,
): ProductWithRelations[] {
  const sorted = [...products];

  switch (sort) {
    case "newest":
      return sorted.sort((a, b) =>
        (b.published_at ?? "").localeCompare(a.published_at ?? ""),
      );
    case "price_asc":
      return sorted.sort((a, b) => priceOf(a) - priceOf(b));
    case "price_desc":
      return sorted.sort((a, b) => priceOf(b) - priceOf(a));
    case "featured":
    default:
      return sorted.sort((a, b) => {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        return (b.published_at ?? "").localeCompare(a.published_at ?? "");
      });
  }
}

export async function listCategories(): Promise<Category[]> {
  return [...seedCategories].sort((a, b) => a.sort_order - b.sort_order);
}

export async function listProducts(
  filters: ProductFilters = {},
): Promise<ProductWithRelations[]> {
  const { q = "", category, type, price, sort = "featured" } = filters;

  const filtered = seedProducts.filter((product) => {
    if (!published(product)) return false;
    if (category && product.category?.slug !== category) return false;
    if (type && product.product_type !== type) return false;
    if (price === "free" && !isFree(product)) return false;
    if (price === "paid" && isFree(product)) return false;
    if (!matchesQuery(product, q)) return false;
    return true;
  });

  return sortProducts(filtered, sort);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithRelations | null> {
  return seedProducts.find((p) => published(p) && p.slug === slug) ?? null;
}

export async function listFeaturedProducts(
  limit = 3,
): Promise<ProductWithRelations[]> {
  const featured = seedProducts.filter((p) => published(p) && p.is_featured);
  return sortProducts(featured, "featured").slice(0, limit);
}

export async function listProductsByType(
  type: ProductType,
  limit = 3,
): Promise<ProductWithRelations[]> {
  const matching = seedProducts.filter(
    (p) => published(p) && p.product_type === type,
  );
  return sortProducts(matching, "featured").slice(0, limit);
}

/** The free lead magnet, if one is published. */
export async function getLeadMagnet(): Promise<ProductWithRelations | null> {
  return seedProducts.find((p) => published(p) && isFree(p)) ?? null;
}

/**
 * Related products: same category first, then anything else published.
 * Never returns the product itself.
 */
export async function getRelatedProducts(
  product: ProductWithRelations,
  limit = 3,
): Promise<ProductWithRelations[]> {
  const others = seedProducts.filter((p) => published(p) && p.id !== product.id);

  const sameCategory = others.filter(
    (p) => p.category_id && p.category_id === product.category_id,
  );
  const rest = others.filter((p) => !sameCategory.includes(p));

  return [...sameCategory, ...rest].slice(0, limit);
}

/** Slugs for the sitemap. */
export async function listProductSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  return seedProducts
    .filter(published)
    .map(({ slug, updated_at }) => ({ slug, updated_at }));
}
