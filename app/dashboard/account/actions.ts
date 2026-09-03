"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  toFieldErrors,
  updateProfileSchema,
  type FormState,
} from "@/lib/validation/auth";

/**
 * Update the signed-in user's own profile.
 *
 * Note what is NOT here: role. The update is scoped to auth.uid(), RLS restricts
 * the row, a column-level REVOKE blocks the role column, and a trigger raises if
 * it changes anyway. Four layers, because privilege escalation through a profile
 * form is one of the most common ways an app like this gets taken over.
 */
export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser("/dashboard/account");

  const parsed = updateProfileSchema.safeParse({
    full_name: formData.get("full_name"),
    marketing_opt_in: formData.get("marketing_opt_in") === "on",
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      marketing_opt_in: parsed.data.marketing_opt_in,
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, message: "Could not save your changes. Try again." };
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true, message: "Saved." };
}
