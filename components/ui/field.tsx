import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Form field.
 *
 * Always a real <label> tied to the input — a placeholder is never the only
 * label, since it disappears the moment someone types. Errors are tied via
 * aria-describedby and marked aria-invalid, so they reach screen readers
 * rather than only being red. See docs/DESIGN_SYSTEM.md section 7.
 */
export function Field({
  label,
  name,
  errors,
  hint,
  className,
  ...inputProps
}: {
  label: string;
  name: string;
  errors?: string[];
  hint?: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "className">) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const hasError = Boolean(errors?.length);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={name} className="text-body-sm font-medium text-foreground">
        {label}
      </label>

      <input
        id={name}
        name={name}
        aria-invalid={hasError || undefined}
        aria-describedby={
          [hasError ? errorId : null, hint ? hintId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(
          "h-11 rounded-sm border bg-surface px-3.5 text-body-sm text-foreground",
          "placeholder:text-subtle-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          hasError ? "border-danger" : "border-border-strong",
        )}
        {...inputProps}
      />

      {hint ? (
        <p id={hintId} className="text-body-sm text-subtle-foreground">
          {hint}
        </p>
      ) : null}

      {hasError ? (
        <p id={errorId} className="text-body-sm text-danger">
          {errors?.[0]}
        </p>
      ) : null}
    </div>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: ReactNode;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4.5 rounded-sm border-border-strong accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      <label htmlFor={name} className="text-body-sm text-muted-foreground">
        {label}
      </label>
    </div>
  );
}

/** Form-level message, for anything not attached to a single field. */
export function FormMessage({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-sm border px-3.5 py-3 text-body-sm",
        tone === "error"
          ? "border-danger/40 text-danger"
          : "border-success/40 text-success",
      )}
    >
      {children}
    </p>
  );
}

/** Shared wrapper so label, hint and error markup stay identical across controls. */
function FieldShell({
  label,
  name,
  errors,
  hint,
  className,
  children,
}: {
  label: string;
  name: string;
  errors?: string[];
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const hasError = Boolean(errors?.length);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={name} className="text-body-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${name}-hint`} className="text-body-sm text-subtle-foreground">
          {hint}
        </p>
      ) : null}
      {hasError ? (
        <p id={`${name}-error`} className="text-body-sm text-danger">
          {errors?.[0]}
        </p>
      ) : null}
    </div>
  );
}

const controlClasses =
  "rounded-sm border bg-surface px-3.5 text-body-sm text-foreground placeholder:text-subtle-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  errors,
  hint,
  className,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  errors?: string[];
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <FieldShell
      label={label}
      name={name}
      errors={errors}
      hint={hint}
      className={className}
    >
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={errors?.length ? true : undefined}
        className={cn(
          controlClasses,
          "h-11",
          errors?.length ? "border-danger" : "border-border-strong",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function TextareaField({
  label,
  name,
  rows = 4,
  defaultValue,
  errors,
  hint,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  rows?: number;
  defaultValue?: string;
  errors?: string[];
  hint?: ReactNode;
  placeholder?: string;
  className?: string;
}) {
  return (
    <FieldShell
      label={label}
      name={name}
      errors={errors}
      hint={hint}
      className={className}
    >
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={errors?.length ? true : undefined}
        className={cn(
          controlClasses,
          "py-2.5 leading-relaxed",
          errors?.length ? "border-danger" : "border-border-strong",
        )}
      />
    </FieldShell>
  );
}
