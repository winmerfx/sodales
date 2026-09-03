import { CategoryEditor } from "@/components/admin/category-editor";
import { listAllCategories } from "@/lib/admin/queries";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof listAllCategories>> = [];
  let error: string | null = null;

  try {
    categories = await listAllCategories();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  if (error) {
    return (
      <div className="max-w-3xl rounded-md border border-danger/40 p-5 text-body-sm text-muted-foreground">
        <p>
          Could not read the categories table. If the migrations have not been
          applied yet, run supabase/migrations/0002_catalog.sql first.
        </p>
        <p className="mt-2 font-mono text-subtle-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <CategoryEditor categories={categories} />
    </div>
  );
}
