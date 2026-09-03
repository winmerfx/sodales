import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Product,
  ProductAsset,
  ProductOffer,
  ProductStatus,
} from "@/lib/products/types";

/**
 * Admin reads.
 *
 * Uses the session-scoped client, not the service-role client. The admin RLS
 * policies (`using (public.is_admin())`) are what let these see drafts — so if
 * the caller is not an admin, Postgres returns nothing regardless of what this
 * file asks for. That is the point: the guard is in the database, not here.
 */

export type AdminProduct = Product & { category: Category | null };

export async function listAllProducts(
  status?: ProductStatus,
): Promise<AdminProduct[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("updated_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data } = await query;
  return (data ?? []) as unknown as AdminProduct[];
}

export async function getAdminProduct(id: string): Promise<
  | (Product & {
      category: Category | null;
      offers: ProductOffer[];
      assets: ProductAsset[];
    })
  | null
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*), offers:product_offers(*), assets:product_assets(*)")
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  const row = data as unknown as Product & {
    category: Category | null;
    offers: ProductOffer[] | null;
    assets: ProductAsset[] | null;
  };

  return {
    ...row,
    offers: (row.offers ?? []).sort((a, b) =>
      a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1,
    ),
    assets: (row.assets ?? []).sort((a, b) => a.sort_order - b.sort_order),
  };
}

export async function listAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data ?? []) as Category[];
}

export async function countProductsByStatus(): Promise<
  Record<ProductStatus, number>
> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("status");

  const counts: Record<ProductStatus, number> = {
    draft: 0,
    published: 0,
    archived: 0,
  };

  for (const row of (data ?? []) as { status: ProductStatus }[]) {
    counts[row.status] += 1;
  }

  return counts;
}
