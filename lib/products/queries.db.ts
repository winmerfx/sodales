import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import {
  defaultOffer,
  isFree,
  type Category,
  type Product,
  type ProductFilters,
  type ProductType,
  type ProductWithRelations,
} from "@/lib/products/types";

/**
 * Postgres implementation of the catalog queries.
 *
 * Reads go through the session-less public client, never the admin client, so
 * the database sees the `anon` role and RLS applies. Draft and archived
 * products are invisible here because Postgres refuses them, not because this
 * file filters them out — a forgotten `.eq('status','published')` must not be
 * able to leak a draft.
 */

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  offers:product_offers(*),
  assets:product_assets(*)
`;

type ProductRow = Product & {
  category: Category | null;
  offers: ProductWithRelations["offers"] | null;
  assets: ProductWithRelations["assets"] | null;
};

/**
 * Bundle children are fetched separately rather than as a nested embed.
 *
 * bundle_items has two foreign keys to products, so PostgREST needs explicit
 * disambiguation hints that break quietly whenever a constraint is renamed. A
 * second query is duller and survives schema edits.
 */
async function attachBundleItems(
  rows: ProductWithRelations[],
): Promise<ProductWithRelations[]> {
  const bundles = rows.filter((row) => row.product_type === "bundle");
  if (bundles.length === 0) return rows;

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("bundle_items")
    .select("bundle_product_id, sort_order, child:products!bundle_items_child_product_id_fkey(*)")
    .in(
      "bundle_product_id",
      bundles.map((b) => b.id),
    )
    .order("sort_order", { ascending: true });

  const byBundle = new Map<string, Product[]>();
  for (const item of (data ?? []) as unknown as {
    bundle_product_id: string;
    child: Product | null;
  }[]) {
    if (!item.child) continue;
    const list = byBundle.get(item.bundle_product_id) ?? [];
    list.push(item.child);
    byBundle.set(item.bundle_product_id, list);
  }

  return rows.map((row) =>
    row.product_type === "bundle"
      ? { ...row, bundle_items: byBundle.get(row.id) ?? [] }
      : row,
  );
}

function normalise(row: ProductRow): ProductWithRelations {
  return {
    ...row,
    category: row.category ?? null,
    offers: (row.offers ?? []).sort((a, b) =>
      a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1,
    ),
    assets: (row.assets ?? []).sort((a, b) => a.sort_order - b.sort_order),
    bundle_items: [],
  };
}

function priceOf(product: ProductWithRelations): number {
  return defaultOffer(product)?.price_cents ?? 0;
}

export async function listCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data ?? []) as Category[];
}

export async function listProducts(
  filters: ProductFilters = {},
): Promise<ProductWithRelations[]> {
  const { q, category, type, price, sort = "featured" } = filters;
  const supabase = createPublicClient();

  let query = supabase.from("products").select(PRODUCT_SELECT);

  if (type) query = query.eq("product_type", type);

  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .maybeSingle();

    // An unknown category slug must return nothing, not everything.
    if (!cat) return [];
    query = query.eq("category_id", (cat as { id: string }).id);
  }

  if (q) {
    query = query.textSearch("search_vector", q, {
      type: "websearch",
      config: "english",
    });
  }

  // Ordering that Postgres can do. Price depends on the default offer, which
  // lives in a joined table, so it is applied below.
  if (sort === "newest") {
    query = query.order("published_at", { ascending: false });
  } else if (sort === "featured") {
    query = query
      .order("is_featured", { ascending: false })
      .order("published_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;

  let products = ((data ?? []) as unknown as ProductRow[]).map(normalise);

  // Free/paid depends on the joined offers. Fine at V1 catalog size; if the
  // catalog reaches the hundreds this becomes a view or a generated column.
  if (price === "free") products = products.filter(isFree);
  if (price === "paid") products = products.filter((p) => !isFree(p));

  if (sort === "price_asc") {
    products.sort((a, b) => priceOf(a) - priceOf(b));
  } else if (sort === "price_desc") {
    products.sort((a, b) => priceOf(b) - priceOf(a));
  }

  return attachBundleItems(products);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithRelations | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;

  const [product] = await attachBundleItems([
    normalise(data as unknown as ProductRow),
  ]);
  return product;
}

export async function listFeaturedProducts(
  limit = 3,
): Promise<ProductWithRelations[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  return attachBundleItems(
    ((data ?? []) as unknown as ProductRow[]).map(normalise),
  );
}

export async function listProductsByType(
  type: ProductType,
  limit = 3,
): Promise<ProductWithRelations[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("product_type", type)
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  return attachBundleItems(
    ((data ?? []) as unknown as ProductRow[]).map(normalise),
  );
}

export async function getLeadMagnet(): Promise<ProductWithRelations | null> {
  const products = await listProducts({ price: "free", sort: "newest" });
  return products[0] ?? null;
}

export async function getRelatedProducts(
  product: ProductWithRelations,
  limit = 3,
): Promise<ProductWithRelations[]> {
  const supabase = createPublicClient();

  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .neq("id", product.id)
    .order("is_featured", { ascending: false })
    .limit(limit * 3);

  const others = ((data ?? []) as unknown as ProductRow[]).map(normalise);
  const sameCategory = others.filter(
    (p) => p.category_id && p.category_id === product.category_id,
  );
  const rest = others.filter((p) => !sameCategory.includes(p));

  return attachBundleItems([...sameCategory, ...rest].slice(0, limit));
}

export async function listProductSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("products").select("slug, updated_at");
  return (data ?? []) as { slug: string; updated_at: string }[];
}
