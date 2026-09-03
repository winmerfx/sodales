import { Button } from "@/components/ui/button";
import { countProductsByStatus } from "@/lib/admin/queries";
import { productsSource } from "@/lib/products/queries";

export default async function AdminOverviewPage() {
  // The catalog tables may not exist yet; the overview should say so rather
  // than crash. See the dispatcher note in lib/products/queries.ts.
  let counts: Record<string, number> | null = null;
  let schemaError: string | null = null;

  try {
    counts = await countProductsByStatus();
  } catch (error) {
    schemaError = error instanceof Error ? error.message : "Unknown error";
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3 rounded-lg border border-border-strong bg-surface-muted p-6">
        <h2 className="text-label uppercase text-subtle-foreground">
          Storefront data source
        </h2>
        <p className="text-body-lg text-foreground">
          {productsSource === "database" ? "Postgres" : "Seed data (placeholder)"}
        </p>
        <p className="max-w-[70ch] text-body-sm text-muted-foreground">
          {productsSource === "database"
            ? "The public storefront is reading from the database. The seed module can now be deleted — see lib/products/queries.ts."
            : "The public storefront is still reading the placeholder seed module. Anything edited here will not appear on the site until PRODUCTS_SOURCE=database is set."}
        </p>
      </section>

      {schemaError ? (
        <section className="flex flex-col gap-3 rounded-lg border border-danger/40 p-6">
          <h2 className="text-label uppercase text-danger">
            Catalog tables unavailable
          </h2>
          <p className="max-w-[70ch] text-body-sm text-muted-foreground">
            The catalog tables could not be read. If the migrations have not been
            applied yet, run supabase/migrations/0002_catalog.sql and
            0003_storage.sql in the Supabase SQL editor.
          </p>
          <p className="font-mono text-body-sm text-subtle-foreground">
            {schemaError}
          </p>
        </section>
      ) : (
        <section className="flex flex-col gap-5">
          <h2 className="text-h4 text-foreground">Catalog</h2>
          <dl className="grid gap-4 sm:grid-cols-3">
            {(["published", "draft", "archived"] as const).map((status) => (
              <div
                key={status}
                className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-5"
              >
                <dt className="text-label uppercase text-subtle-foreground">
                  {status}
                </dt>
                <dd className="text-h2 text-foreground">
                  {counts?.[status] ?? 0}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex gap-3">
            <Button href="/admin/products">Manage products</Button>
            <Button href="/admin/categories" variant="secondary">
              Manage categories
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
