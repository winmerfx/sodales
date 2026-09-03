"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  assetSchema,
  categorySchema,
  offerSchema,
  productSchema,
} from "@/lib/validation/product";
import { toFieldErrors, type FormState } from "@/lib/validation/auth";

/**
 * Admin write actions.
 *
 * Every one calls requireAdmin() first. That is not the only defence — these
 * use the session-scoped client, so the admin RLS policies must also pass. A
 * bug in this file cannot turn a customer into an editor; the database would
 * still refuse the write.
 *
 * The service-role client is deliberately NOT used here. It bypasses RLS, and
 * nothing in admin CRUD needs that.
 */

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

function productFromForm(formData: FormData) {
  return productSchema.safeParse({
    slug: text(formData, "slug"),
    name: text(formData, "name"),
    tagline: text(formData, "tagline"),
    description: text(formData, "description"),
    product_type: text(formData, "product_type"),
    status: text(formData, "status"),
    category_id: text(formData, "category_id"),
    cover_image_url: text(formData, "cover_image_url"),
    is_featured: bool(formData, "is_featured"),
    requirements: text(formData, "requirements"),
    license_terms: text(formData, "license_terms"),
    seo_title: text(formData, "seo_title"),
    seo_description: text(formData, "seo_description"),
    og_image_url: text(formData, "og_image_url"),
  });
}

export async function createProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = productFromForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...parsed.data,
      // The DB requires a publish date on any published row.
      published_at:
        parsed.data.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    return {
      ok: false,
      message:
        error.code === "23505"
          ? "That slug is already used by another product."
          : error.message,
    };
  }

  revalidatePath("/admin/products");
  redirect(`/admin/products/${(data as { id: string }).id}`);
}

export async function updateProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return { ok: false, message: "Missing product id." };

  const parsed = productFromForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();

  // Stamp published_at on the draft -> published transition, and never clear it
  // on the way back: it is the original publish date, not a status mirror.
  const { data: existing } = await supabase
    .from("products")
    .select("published_at")
    .eq("id", id)
    .single();

  const currentPublishedAt =
    (existing as { published_at: string | null } | null)?.published_at ?? null;

  const { error } = await supabase
    .from("products")
    .update({
      ...parsed.data,
      published_at:
        parsed.data.status === "published"
          ? (currentPublishedAt ?? new Date().toISOString())
          : currentPublishedAt,
    })
    .eq("id", id);

  if (error) {
    return {
      ok: false,
      message:
        error.code === "23505"
          ? "That slug is already used by another product."
          : error.message,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { ok: true, message: "Saved." };
}

/**
 * Archive rather than delete.
 *
 * A deleted product breaks order history and any entitlement pointing at it.
 * Archiving removes it from the storefront and keeps the record intact. Real
 * deletion, if ever needed, is a deliberate database operation with review.
 */
export async function archiveProductAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("products").update({ status: "archived" }).eq("id", id);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

/* -------------------------------------------------------------------------- */
/* Offers                                                                      */
/* -------------------------------------------------------------------------- */

export async function saveOfferAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const productId = text(formData, "product_id");
  const offerId = text(formData, "offer_id");
  if (!productId) return { ok: false, message: "Missing product id." };

  const parsed = offerSchema.safeParse({
    name: text(formData, "name"),
    kind: text(formData, "kind"),
    price_cents: text(formData, "price_cents"),
    compare_at_cents: text(formData, "compare_at_cents") ?? "",
    currency: text(formData, "currency") || "USD",
    provider: text(formData, "provider"),
    provider_variant_id: text(formData, "provider_variant_id"),
    is_default: bool(formData, "is_default"),
    is_active: bool(formData, "is_active"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();

  // Only one default per product, enforced by a unique index. Clear the old one
  // first or the insert fails on a constraint the admin cannot see.
  if (parsed.data.is_default) {
    await supabase
      .from("product_offers")
      .update({ is_default: false })
      .eq("product_id", productId);
  }

  const { error } = offerId
    ? await supabase
        .from("product_offers")
        .update(parsed.data)
        .eq("id", offerId)
    : await supabase
        .from("product_offers")
        .insert({ ...parsed.data, product_id: productId });

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/products");
  return { ok: true, message: "Offer saved." };
}

export async function deleteOfferAction(formData: FormData) {
  await requireAdmin();
  const offerId = text(formData, "offer_id");
  const productId = text(formData, "product_id");
  if (!offerId) return;

  const supabase = await createClient();
  await supabase.from("product_offers").delete().eq("id", offerId);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/products");
}

/* -------------------------------------------------------------------------- */
/* Assets                                                                      */
/* -------------------------------------------------------------------------- */

export async function saveAssetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const productId = text(formData, "product_id");
  const assetId = text(formData, "asset_id");
  if (!productId) return { ok: false, message: "Missing product id." };

  const parsed = assetSchema.safeParse({
    fulfillment_type: text(formData, "fulfillment_type"),
    title: text(formData, "title"),
    description: text(formData, "description"),
    storage_path: text(formData, "storage_path"),
    external_url: text(formData, "external_url"),
    body: text(formData, "body"),
    tool_slug: text(formData, "tool_slug"),
    is_preview: bool(formData, "is_preview"),
    sort_order: text(formData, "sort_order") || 0,
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = assetId
    ? await supabase
        .from("product_assets")
        .update(parsed.data)
        .eq("id", assetId)
    : await supabase
        .from("product_assets")
        .insert({ ...parsed.data, product_id: productId });

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/admin/products/${productId}`);
  return { ok: true, message: "Asset saved." };
}

export async function deleteAssetAction(formData: FormData) {
  await requireAdmin();
  const assetId = text(formData, "asset_id");
  const productId = text(formData, "product_id");
  if (!assetId) return;

  const supabase = await createClient();
  await supabase.from("product_assets").delete().eq("id", assetId);

  revalidatePath(`/admin/products/${productId}`);
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                  */
/* -------------------------------------------------------------------------- */

export async function saveCategoryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = text(formData, "id");
  const parsed = categorySchema.safeParse({
    slug: text(formData, "slug"),
    name: text(formData, "name"),
    description: text(formData, "description"),
    sort_order: text(formData, "sort_order") || 0,
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("categories").update(parsed.data).eq("id", id)
    : await supabase.from("categories").insert(parsed.data);

  if (error) {
    return {
      ok: false,
      message:
        error.code === "23505"
          ? "That slug is already used by another category."
          : error.message,
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { ok: true, message: "Category saved." };
}
