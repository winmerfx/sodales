import { z } from "zod";

/**
 * Auth input schemas.
 *
 * Server-side validation. Anything the browser checks is UX only — every
 * Server Action re-validates here before touching Supabase.
 */

const email = z
  .string()
  .min(1, "Enter your email address")
  .email("That does not look like an email address")
  .max(320);

/**
 * Length only. Composition rules (a digit, a symbol, a capital) push people
 * toward "Password1!" and measurably weaken real-world passwords; length is
 * what actually helps. Supabase enforces its own minimum on top of this.
 */
const password = z
  .string()
  .min(10, "Use at least 10 characters — length matters more than symbols")
  .max(72, "Passwords cannot be longer than 72 characters");

export const signupSchema = z.object({
  full_name: z.string().trim().min(1, "Enter your name").max(120),
  email,
  password,
  marketing_opt_in: z.boolean().default(false),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password").max(72),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "The two passwords do not match",
    path: ["confirm_password"],
  });

export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(1, "Enter your name").max(120),
  marketing_opt_in: z.boolean().default(false),
});

export type FormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const emptyFormState: FormState = { ok: false };

/** Flatten a ZodError into the shape the form components render. */
export function toFieldErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    (result[key] ??= []).push(issue.message);
  }
  return result;
}
