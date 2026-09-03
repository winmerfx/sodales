"use client";

import { useActionState, useState } from "react";

import { deleteAssetAction, saveAssetAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  Field,
  FormMessage,
  SelectField,
  TextareaField,
} from "@/components/ui/field";
import type { ProductAsset } from "@/lib/products/types";
import { emptyFormState } from "@/lib/validation/auth";

const typeOptions = [
  { value: "file", label: "File — private storage, signed URL on download" },
  { value: "external_link", label: "External link" },
  { value: "protected_page", label: "Protected page (markdown)" },
  { value: "video", label: "Video" },
  { value: "license_key", label: "License key" },
  { value: "tool_access", label: "AI tool access" },
  { value: "subscription_access", label: "Subscription access" },
  { value: "instructions", label: "Instructions (markdown)" },
];

function AssetForm({
  productId,
  asset,
  onDone,
}: {
  productId: string;
  asset?: ProductAsset;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(
    saveAssetAction,
    emptyFormState,
  );
  const errors = state.fieldErrors;

  return (
    <form
      action={action}
      className="flex flex-col gap-5 rounded-lg border border-border-strong bg-surface-muted p-5"
    >
      <input type="hidden" name="product_id" value={productId} />
      {asset ? <input type="hidden" name="asset_id" value={asset.id} /> : null}

      {state.message ? (
        <FormMessage tone={state.ok ? "success" : "error"}>
          {state.message}
        </FormMessage>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Title"
          name="title"
          required
          defaultValue={asset?.title ?? ""}
          errors={errors?.title}
        />
        <SelectField
          label="Fulfillment type"
          name="fulfillment_type"
          options={typeOptions}
          defaultValue={asset?.fulfillment_type ?? "file"}
          errors={errors?.fulfillment_type}
        />
      </div>

      <Field
        label="Description"
        name="description"
        defaultValue={asset?.description ?? ""}
        errors={errors?.description}
      />

      {/* Only one of these is required, depending on the type. The database
          enforces the same rule, so a mismatch is rejected either way. */}
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Storage path"
          name="storage_path"
          defaultValue={asset?.storage_path ?? ""}
          hint="Path inside the protected-assets bucket. Required for files."
          errors={errors?.storage_path}
        />
        <Field
          label="External URL"
          name="external_url"
          defaultValue={asset?.external_url ?? ""}
          hint="Required for external links."
          errors={errors?.external_url}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Tool slug"
          name="tool_slug"
          defaultValue={asset?.tool_slug ?? ""}
          hint="Required for AI tool access."
          errors={errors?.tool_slug}
        />
        <Field
          label="Sort order"
          name="sort_order"
          type="number"
          min={0}
          defaultValue={asset?.sort_order ?? 0}
          errors={errors?.sort_order}
        />
      </div>

      <TextareaField
        label="Body"
        name="body"
        rows={5}
        defaultValue={asset?.body ?? ""}
        hint="Markdown. Required for protected pages and instructions."
        errors={errors?.body}
      />

      <Checkbox
        name="is_preview"
        defaultChecked={asset?.is_preview}
        label="Preview — publicly readable before purchase. Never tick this for a paid deliverable."
      />

      <div className="flex gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save asset"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Close
        </Button>
      </div>
    </form>
  );
}

export function AssetEditor({
  productId,
  assets,
}: {
  productId: string;
  assets: ProductAsset[];
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-h4 text-foreground">Assets</h2>
          <p className="text-body-sm text-muted-foreground">
            What the customer actually receives. One product may deliver several.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            setAdding(true);
            setEditing(null);
          }}
        >
          Add asset
        </Button>
      </div>

      {assets.length === 0 && !adding ? (
        <p className="rounded-md border border-dashed border-border-strong px-4 py-6 text-center text-body-sm text-muted-foreground">
          No assets yet. A product with no assets delivers nothing after payment.
        </p>
      ) : null}

      <ul className="flex flex-col gap-3">
        {assets.map((asset) => (
          <li key={asset.id} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface p-4">
              <div className="flex flex-col gap-1">
                <p className="text-body-sm font-semibold text-foreground">
                  {asset.title}
                  {asset.is_preview ? (
                    <span className="ml-2 text-label uppercase text-warning">
                      Public preview
                    </span>
                  ) : null}
                </p>
                <p className="text-body-sm text-muted-foreground">
                  {asset.fulfillment_type}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(editing === asset.id ? null : asset.id);
                    setAdding(false);
                  }}
                >
                  {editing === asset.id ? "Close" : "Edit"}
                </Button>
                <form action={deleteAssetAction}>
                  <input type="hidden" name="asset_id" value={asset.id} />
                  <input type="hidden" name="product_id" value={productId} />
                  <Button type="submit" size="sm" variant="ghost">
                    Delete
                  </Button>
                </form>
              </div>
            </div>

            {editing === asset.id ? (
              <AssetForm
                productId={productId}
                asset={asset}
                onDone={() => setEditing(null)}
              />
            ) : null}
          </li>
        ))}
      </ul>

      {adding ? (
        <AssetForm productId={productId} onDone={() => setAdding(false)} />
      ) : null}
    </section>
  );
}
