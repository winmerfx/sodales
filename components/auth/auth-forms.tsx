"use client";

import { useActionState } from "react";

import {
  forgotPasswordAction,
  loginAction,
  resetPasswordAction,
  signupAction,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, FormMessage } from "@/components/ui/field";
import { emptyFormState } from "@/lib/validation/auth";

/**
 * Auth forms.
 *
 * Client Components only because they need useActionState for pending and
 * error states. The actual work happens in the Server Actions, which re-run
 * every validation regardless of what these send.
 */

function Submit({ pending, children }: { pending: boolean; children: string }) {
  return (
    <Button type="submit" size="lg" fullWidth disabled={pending}>
      {pending ? "Working…" : children}
    </Button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, emptyFormState);

  return (
    <form action={action} className="flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        errors={state.fieldErrors?.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={state.fieldErrors?.password}
      />

      <Submit pending={pending}>Sign in</Submit>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, emptyFormState);

  if (state.ok && state.message) {
    return <FormMessage tone="success">{state.message}</FormMessage>;
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}

      <Field
        label="Name"
        name="full_name"
        autoComplete="name"
        required
        errors={state.fieldErrors?.full_name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        errors={state.fieldErrors?.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint="At least 10 characters. Length matters more than symbols."
        errors={state.fieldErrors?.password}
      />

      <Checkbox
        name="marketing_opt_in"
        label="Email me when new tools and workflows ship. No more than monthly."
      />

      <Submit pending={pending}>Create account</Submit>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    forgotPasswordAction,
    emptyFormState,
  );

  if (state.ok && state.message) {
    return <FormMessage tone="success">{state.message}</FormMessage>;
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        errors={state.fieldErrors?.email}
      />
      <Submit pending={pending}>Send reset link</Submit>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(
    resetPasswordAction,
    emptyFormState,
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}

      <Field
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint="At least 10 characters."
        errors={state.fieldErrors?.password}
      />
      <Field
        label="Confirm new password"
        name="confirm_password"
        type="password"
        autoComplete="new-password"
        required
        errors={state.fieldErrors?.confirm_password}
      />

      <Submit pending={pending}>Update password</Submit>
    </form>
  );
}
