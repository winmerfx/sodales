"use client";

import { useActionState } from "react";

import {
  createProductAction,
  updateProductAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  Field,
  FormMessage,
  SelectField,
  TextareaField,
} from "@/components/ui/field";
import type { Category, Product } from "@/lib/products/types";
import { PRODUCT_TYPE_LABELS } from "@/lib/products/types";
import { emptyFormState } from "@/lib/validation/auth";

const typeOptions = Object.entries(PRODUCT_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

const statusOptions = [
  { value: "draft", label: "Draft — not visible publicly" },
  { value: "published", label: "Published — live on the storefront" },
  { value: "archived", label: "Archived — removed from the storefront" },
];

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const [state, action, pending] = useActionState(
    product ? updateProductAction : createProductAction,
    emptyFormState,
  );

  const errors = state.fieldErrors;

  return (
    <form action={action} className="flex flex-col gap-8">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      {state.message ? (
        <FormMessage tone={state.ok ? "success" : "error"}>
          {state.message}
        </FormMessage>
      ) : null}

      <section className="flex flex-col gap-5">
        <h2 className="text-h4 text-foreground">Basics</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Name"
            name="name"
            required
            defaultValue={product?.name}
            errors={errors?.name}
          />
          <Field
            label="Slug"
            name="slug"
            required
            defaultValue={product?.slug}
            hint="Becomes the URL: /products/your-slug"
            errors={errors?.slug}
          />
        </div>

        <Field
          label="Tagline"
          name="tagline"
          defaultValue={product?.tagline ?? ""}
          hint="One line stating the outcome. This is what shows on cards."
          errors={errors?.tagline}
        />

        <TextareaField
          label="Description"
          name="description"
          rows={6}
          defaultValue={product?.description ?? ""}
          errors={errors?.description}
        />

        <div className="grid gap-5 md:grid-cols-3">
          <SelectField
            label="Type"
            name="product_type"
            options={typeOptions}
            defaultValue={product?.product_type ?? "download"}
            errors={errors?.product_type}
          />
          <SelectField
            label="Status"
            name="status"
            options={statusOptions}
            defaultValue={product?.status ?? "draft"}
            errors={errors?.status}
          />
          <SelectField
            label="Category"
            name="category_id"
            options={[
              { value: "", label: "No category" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            defaultValue={product?.category_id ?? ""}
            errors={errors?.category_id}
          />
        </div>

        <Checkbox
          name="is_featured"
          defaultChecked={product?.is_featured}
          label="Feature this product on the homepage"
        />
      </section>

      <section className="flex flex-col gap-5 border-t border-border pt-8">
        <h2 className="text-h4 text-foreground">Before you buy</h2>

        <TextareaField
          label="Requirements"
          name="requirements"
          rows={3}
          defaultValue={product?.requirements ?? ""}
          hint="Shown above the buy button. Someone buying a workflow needing infrastructure they lack is a refund."
          errors={errors?.requirements}
        />

        <TextareaField
          label="License terms"
          name="license_terms"
          rows={3}
          defaultValue={product?.license_terms ?? ""}
          errors={errors?.license_terms}
        />
      </section>

      <section className="flex flex-col gap-5 border-t border-border pt-8">
        <h2 className="text-h4 text-foreground">Media and SEO</h2>

        <Field
          label="Cover image URL"
          name="cover_image_url"
          defaultValue={product?.cover_image_url ?? ""}
          hint="Leave blank to use the generated placeholder artwork."
          errors={errors?.cover_image_url}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="SEO title"
            name="seo_title"
            defaultValue={product?.seo_title ?? ""}
            hint="Defaults to the product name."
            errors={errors?.seo_title}
          />
          <Field
            label="Open Graph image URL"
            name="og_image_url"
            defaultValue={product?.og_image_url ?? ""}
            errors={errors?.og_image_url}
          />
        </div>

        <TextareaField
          label="SEO description"
          name="seo_description"
          rows={2}
          defaultValue={product?.seo_description ?? ""}
          hint="Defaults to the tagline."
          errors={errors?.seo_description}
        />
      </section>

      <div className="flex gap-3 border-t border-border pt-8">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </Button>
        <Button href="/admin/products" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
