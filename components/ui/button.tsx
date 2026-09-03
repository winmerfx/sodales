import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "link"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary:
    "bg-surface text-foreground border border-border-strong hover:bg-surface-muted",
  ghost: "text-foreground hover:bg-surface",
  link: "text-accent underline-offset-4 hover:underline px-0",
  danger: "bg-danger text-background hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-body-sm",
  md: "h-11 px-5 text-body-sm",
  lg: "h-13 px-7 text-body",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & {
    href: string;
  };

/**
 * Button.
 *
 * No glow, no gradient fills - see docs/DESIGN_SYSTEM.md section 5.1. Colors
 * come from surface-scoped tokens, so one variant is contrast-safe on both
 * dark and light sections without the caller doing anything.
 *
 * Renders a real <a> when given `href`. A navigation styled as a button must
 * still be a link, or middle-click, open-in-new-tab and screen readers break.
 */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium",
    "transition-colors duration-150 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    variant !== "link" && sizes[size],
    fullWidth && "w-full",
    className,
  );

  if (rest.href !== undefined) {
    return (
      <Link className={classes} {...(rest as ComponentPropsWithoutRef<typeof Link>)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
