import { ProductForm } from "@/components/admin/product-form";
import { listAllCategories } from "@/lib/admin/queries";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  let categories: Awaited<ReturnType<typeof listAllCategories>> = [];

  try {
    categories = await listAllCategories();
  } catch {
    // A category is optional on a product, so an unreadable categories table
    // should not block creating one. The insert will surface the real error.
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-h4 text-foreground">New product</h2>
        <p className="text-body-sm text-muted-foreground">
          Save first, then add offers and assets. A product with no active offer
          cannot be bought, and one with no assets delivers nothing after payment.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
