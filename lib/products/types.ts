/**
 * Product domain types.
 *
 * These mirror docs/DATABASE.md section 3 exactly — including snake_case field
 * names. That is deliberate: Supabase generates snake_case row types, so when
 * Phase 4 replaces the seed module with real queries, the rows drop straight
 * into these components with no mapping layer to write, test or get wrong.
 *
 * If a field changes here, it changes in docs/DATABASE.md in the same commit.
 */

export type ProductType =
  | "download"
  | "template"
  | "prompt_system"
  | "workflow"
  | "automation"
  | "database"
  | "course"
  | "tool"
  | "bundle"
  | "external_access";

export type ProductStatus = "draft" | "published" | "archived";

export type FulfillmentType =
  | "file"
  | "external_link"
  | "protected_page"
  | "video"
  | "license_key"
  | "tool_access"
  | "subscription_access"
  | "instructions";

export type OfferKind = "free" | "one_time" | "subscription";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
};

export type ProductOffer = {
  id: string;
  product_id: string;
  name: string;
  kind: OfferKind;
  price_cents: number;
  compare_at_cents: number | null;
  currency: string;
  provider: string | null;
  provider_variant_id: string | null;
  is_default: boolean;
  is_active: boolean;
};

export type ProductAsset = {
  id: string;
  product_id: string;
  fulfillment_type: FulfillmentType;
  title: string;
  description: string | null;
  storage_path: string | null;
  external_url: string | null;
  body: string | null;
  tool_slug: string | null;
  file_size_bytes: number | null;
  is_preview: boolean;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  product_type: ProductType;
  status: ProductStatus;
  category_id: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  requirements: string | null;
  license_terms: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** A product joined with the relations the storefront actually renders. */
export type ProductWithRelations = Product & {
  category: Category | null;
  offers: ProductOffer[];
  assets: ProductAsset[];
  /** Populated only when product_type is 'bundle'. */
  bundle_items: Product[];
};

/* -------------------------------------------------------------------------- */
/* Display metadata                                                            */
/* -------------------------------------------------------------------------- */

/** Human labels for product types. Single source, so filters and cards agree. */
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  download: "Download",
  template: "Template",
  prompt_system: "Prompt system",
  workflow: "Workflow",
  automation: "Automation",
  database: "Database",
  course: "Course",
  tool: "AI tool",
  bundle: "Bundle",
  external_access: "External access",
};

/** Types offered as storefront filters, in the order they appear. */
export const FILTERABLE_PRODUCT_TYPES: ProductType[] = [
  "tool",
  "workflow",
  "automation",
  "prompt_system",
  "template",
  "database",
  "course",
  "bundle",
];

export type SortOption = "featured" | "newest" | "price_asc" | "price_desc";

/** Catalog filter state. Lives here so queries and filters do not import each other. */
export type ProductFilters = {
  q?: string;
  category?: string;
  type?: ProductType;
  price?: "free" | "paid";
  sort?: SortOption;
};

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  newest: "Newest",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
};

/* -------------------------------------------------------------------------- */
/* Derived helpers                                                             */
/* -------------------------------------------------------------------------- */

/** The offer a product page and card should price against. */
export function defaultOffer(product: ProductWithRelations): ProductOffer | null {
  const active = product.offers.filter((offer) => offer.is_active);
  return active.find((offer) => offer.is_default) ?? active[0] ?? null;
}

export function isFree(product: ProductWithRelations): boolean {
  return product.offers.some((offer) => offer.is_active && offer.kind === "free");
}
