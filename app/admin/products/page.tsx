import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listAllProducts } from "@/lib/admin/queries";
import { formatDate } from "@/lib/format";
import { PRODUCT_TYPE_LABELS, type ProductStatus } from "@/lib/products/types";

export const metadata = { title: "Products" };

const statusTones: Record<ProductStatus, "accent" | "neutral" | "success"> = {
  published: "success",
  draft: "accent",
  archived: "neutral",
};

const statusFilters = [
  { value: undefined, label: "All", href: "/admin/products" },
  { value: "published", label: "Published", href: "/admin/products?status=published" },
  { value: "draft", label: "Draft", href: "/admin/products?status=draft" },
  { value: "archived", label: "Archived", href: "/admin/products?status=archived" },
] as const;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter =
    status === "draft" || status === "published" || status === "archived"
      ? status
      : undefined;

  let products: Awaited<ReturnType<typeof listAllProducts>> = [];
  let error: string | null = null;

  try {
    products = await listAllProducts(filter);
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-h4 text-foreground">Products</h2>
        <Button href="/admin/products/new" size="sm">
          New product
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((option) => (
          <Link
            key={option.label}
            href={option.href}
            aria-current={filter === option.value ? "true" : undefined}
            className={
              filter === option.value
                ? "inline-flex h-9 items-center rounded-full border border-primary bg-primary px-3.5 text-body-sm text-primary-foreground"
                : "inline-flex h-9 items-center rounded-full border border-border bg-surface px-3.5 text-body-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            }
          >
            {option.label}
          </Link>
        ))}
      </div>

      {error ? (
        <div className="rounded-md border border-danger/40 p-5 text-body-sm text-muted-foreground">
          <p>
            Could not read the catalog tables. If the migrations have not been
            applied yet, run supabase/migrations/0002_catalog.sql first.
          </p>
          <p className="mt-2 font-mono text-subtle-foreground">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <p className="rounded-md border border-dashed border-border-strong px-4 py-10 text-center text-body-sm text-muted-foreground">
          No products here yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Type", "Status", "Category", "Updated"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="py-3 pr-4 text-label uppercase text-subtle-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border">
                  <td className="py-3.5 pr-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-body-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {product.name}
                    </Link>
                    <span className="mt-0.5 block text-body-sm text-subtle-foreground">
                      /{product.slug}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-body-sm text-muted-foreground">
                    {PRODUCT_TYPE_LABELS[product.product_type]}
                  </td>
                  <td className="py-3.5 pr-4">
                    <Badge tone={statusTones[product.status]}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 pr-4 text-body-sm text-muted-foreground">
                    {product.category?.name ?? "—"}
                  </td>
                  <td className="py-3.5 pr-4 text-body-sm text-subtle-foreground">
                    {formatDate(product.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
