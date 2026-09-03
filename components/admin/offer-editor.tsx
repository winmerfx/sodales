"use client";

import { useActionState, useState } from "react";

import { deleteOfferAction, saveOfferAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  Field,
  FormMessage,
  SelectField,
} from "@/components/ui/field";
import { formatPrice } from "@/lib/format";
import type { ProductOffer } from "@/lib/products/types";
import { emptyFormState } from "@/lib/validation/auth";

const kindOptions = [
  { value: "one_time", label: "One-time purchase" },
  { value: "free", label: "Free" },
  { value: "subscription", label: "Subscription" },
];

function OfferForm({
  productId,
  offer,
  onDone,
}: {
  productId: string;
  offer?: ProductOffer;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(
    saveOfferAction,
    emptyFormState,
  );
  const errors = state.fieldErrors;

  return (
    <form
      action={action}
      className="flex flex-col gap-5 rounded-lg border border-border-strong bg-surface-muted p-5"
    >
      <input type="hidden" name="product_id" value={productId} />
      {offer ? <input type="hidden" name="offer_id" value={offer.id} /> : null}

      {state.message ? (
        <FormMessage tone={state.ok ? "success" : "error"}>
          {state.message}
        </FormMessage>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Offer name"
          name="name"
          required
          defaultValue={offer?.name ?? "Standard license"}
          errors={errors?.name}
        />
        <SelectField
          label="Kind"
          name="kind"
          options={kindOptions}
          defaultValue={offer?.kind ?? "one_time"}
          errors={errors?.kind}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          label="Price (cents)"
          name="price_cents"
          type="number"
          min={0}
          required
          defaultValue={offer?.price_cents ?? 0}
          hint="4900 = $49"
          errors={errors?.price_cents}
        />
        <Field
          label="Compare-at (cents)"
          name="compare_at_cents"
          type="number"
          min={0}
          defaultValue={offer?.compare_at_cents ?? ""}
          hint="Optional. Must be higher."
          errors={errors?.compare_at_cents}
        />
        <Field
          label="Currency"
          name="currency"
          maxLength={3}
          defaultValue={offer?.currency ?? "USD"}
          errors={errors?.currency}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Payment provider"
          name="provider"
          defaultValue={offer?.provider ?? ""}
          hint="Set in Phase 5."
          errors={errors?.provider}
        />
        <Field
          label="Provider variant ID"
          name="provider_variant_id"
          defaultValue={offer?.provider_variant_id ?? ""}
          hint="The checkout target. Set in Phase 5."
          errors={errors?.provider_variant_id}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Checkbox
          name="is_default"
          defaultChecked={offer?.is_default ?? true}
          label="Default offer — this is the price shown on cards and the product page"
        />
        <Checkbox
          name="is_active"
          defaultChecked={offer?.is_active ?? true}
          label="Active"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save offer"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Close
        </Button>
      </div>
    </form>
  );
}

export function OfferEditor({
  productId,
  offers,
}: {
  productId: string;
  offers: ProductOffer[];
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-h4 text-foreground">Offers</h2>
          <p className="text-body-sm text-muted-foreground">
            How this product is sold. Provider IDs live here, so re-pricing never
            touches product content.
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
          Add offer
        </Button>
      </div>

      {offers.length === 0 && !adding ? (
        <p className="rounded-md border border-dashed border-border-strong px-4 py-6 text-center text-body-sm text-muted-foreground">
          No offers yet. A product with no active offer cannot be bought.
        </p>
      ) : null}

      <ul className="flex flex-col gap-3">
        {offers.map((offer) => (
          <li key={offer.id} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface p-4">
              <div className="flex flex-col gap-1">
                <p className="text-body-sm font-semibold text-foreground">
                  {offer.name}
                  {offer.is_default ? (
                    <span className="ml-2 text-label uppercase text-accent">
                      Default
                    </span>
                  ) : null}
                  {!offer.is_active ? (
                    <span className="ml-2 text-label uppercase text-subtle-foreground">
                      Inactive
                    </span>
                  ) : null}
                </p>
                <p className="text-body-sm text-muted-foreground">
                  {formatPrice(offer.price_cents, offer.currency)} · {offer.kind}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(editing === offer.id ? null : offer.id);
                    setAdding(false);
                  }}
                >
                  {editing === offer.id ? "Close" : "Edit"}
                </Button>
                <form action={deleteOfferAction}>
                  <input type="hidden" name="offer_id" value={offer.id} />
                  <input type="hidden" name="product_id" value={productId} />
                  <Button type="submit" size="sm" variant="ghost">
                    Delete
                  </Button>
                </form>
              </div>
            </div>

            {editing === offer.id ? (
              <OfferForm
                productId={productId}
                offer={offer}
                onDone={() => setEditing(null)}
              />
            ) : null}
          </li>
        ))}
      </ul>

      {adding ? (
        <OfferForm productId={productId} onDone={() => setAdding(false)} />
      ) : null}
    </section>
  );
}
