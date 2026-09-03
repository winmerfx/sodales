"use client";

import { useActionState, useState } from "react";

import { saveCategoryAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, TextareaField } from "@/components/ui/field";
import type { Category } from "@/lib/products/types";
import { emptyFormState } from "@/lib/validation/auth";

function CategoryForm({
  category,
  onDone,
}: {
  category?: Category;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(
    saveCategoryAction,
    emptyFormState,
  );
  const errors = state.fieldErrors;

  return (
    <form
      action={action}
      className="flex flex-col gap-5 rounded-lg border border-border-strong bg-surface-muted p-5"
    >
      {category ? (
        <input type="hidden" name="id" value={category.id} />
      ) : null}

      {state.message ? (
        <FormMessage tone={state.ok ? "success" : "error"}>
          {state.message}
        </FormMessage>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          defaultValue={category?.name ?? ""}
          errors={errors?.name}
        />
        <Field
          label="Slug"
          name="slug"
          required
          defaultValue={category?.slug ?? ""}
          hint="Used in /products?category=your-slug"
          errors={errors?.slug}
        />
      </div>

      <TextareaField
        label="Description"
        name="description"
        rows={2}
        defaultValue={category?.description ?? ""}
        errors={errors?.description}
      />

      <Field
        label="Sort order"
        name="sort_order"
        type="number"
        min={0}
        defaultValue={category?.sort_order ?? 0}
        errors={errors?.sort_order}
      />

      <div className="flex gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save category"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Close
        </Button>
      </div>
    </form>
  );
}

export function CategoryEditor({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-h4 text-foreground">Categories</h2>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setAdding(true);
            setEditing(null);
          }}
        >
          New category
        </Button>
      </div>

      {adding ? <CategoryForm onDone={() => setAdding(false)} /> : null}

      {categories.length === 0 && !adding ? (
        <p className="rounded-md border border-dashed border-border-strong px-4 py-10 text-center text-body-sm text-muted-foreground">
          No categories yet.
        </p>
      ) : null}

      <ul className="flex flex-col gap-3">
        {categories.map((category) => (
          <li key={category.id} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface p-4">
              <div className="flex flex-col gap-1">
                <p className="text-body-sm font-semibold text-foreground">
                  {category.name}
                </p>
                <p className="text-body-sm text-subtle-foreground">
                  /{category.slug} · sort {category.sort_order}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(editing === category.id ? null : category.id);
                  setAdding(false);
                }}
              >
                {editing === category.id ? "Close" : "Edit"}
              </Button>
            </div>

            {editing === category.id ? (
              <CategoryForm
                category={category}
                onDone={() => setEditing(null)}
              />
            ) : null}
          </li>
        ))}
      </ul>

      {/* Deliberately no delete. Categories are referenced by products; the FK
          is ON DELETE SET NULL, so removing one silently uncategorises its
          products. Rename or re-sort instead. */}
      <p className="text-body-sm text-subtle-foreground">
        Categories cannot be deleted here — removing one would silently
        uncategorise every product using it. Rename or re-sort instead.
      </p>
    </div>
  );
}
