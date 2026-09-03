import Link from "next/link";
import { notFound } from "next/navigation";

import { archiveProductAction } from "@/app/admin/actions";
import { AssetEditor } from "@/components/admin/asset-editor";
import { OfferEditor } from "@/components/admin/offer-editor";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { getAdminProduct, listAllCategories } from "@/lib/admin/queries";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    listAllCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-h4 text-foreground">{product.name}</h2>
          <p className="text-body-sm text-muted-foreground">
            {product.status === "published" ? (
              <Link
                href={`/products/${product.slug}`}
                className="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                View on the storefront
              </Link>
            ) : (
              "Not visible publicly while it is not published."
            )}
          </p>
        </div>

        {/* Archive, never delete. A deleted product breaks order history and
            any entitlement pointing at it. */}
        {product.status !== "archived" ? (
          <form action={archiveProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <Button type="submit" variant="secondary" size="sm">
              Archive
            </Button>
          </form>
        ) : null}
      </div>

      <div className="max-w-3xl">
        <ProductForm product={product} categories={categories} />
      </div>

      <div className="max-w-3xl border-t border-border pt-10">
        <OfferEditor productId={product.id} offers={product.offers} />
      </div>

      <div className="max-w-3xl border-t border-border pt-10">
        <AssetEditor productId={product.id} assets={product.assets} />
      </div>
    </div>
  );
}
