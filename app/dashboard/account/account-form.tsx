"use client";

import { useActionState } from "react";

import { updateProfileAction } from "@/app/dashboard/account/actions";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, FormMessage } from "@/components/ui/field";
import { emptyFormState } from "@/lib/validation/auth";

export function AccountForm({
  fullName,
  marketingOptIn,
}: {
  fullName: string | null;
  marketingOptIn: boolean;
}) {
  const [state, action, pending] = useActionState(
    updateProfileAction,
    emptyFormState,
  );

  return (
    <form action={action} className="flex max-w-md flex-col gap-5">
      {state.message ? (
        <FormMessage tone={state.ok ? "success" : "error"}>
          {state.message}
        </FormMessage>
      ) : null}

      <Field
        label="Name"
        name="full_name"
        autoComplete="name"
        required
        defaultValue={fullName ?? ""}
        errors={state.fieldErrors?.full_name}
      />

      <Checkbox
        name="marketing_opt_in"
        defaultChecked={marketingOptIn}
        label="Email me when new tools and workflows ship. No more than monthly."
      />

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
