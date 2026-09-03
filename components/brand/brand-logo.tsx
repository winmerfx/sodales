import { cn } from "@/lib/utils";

/**
 * SODALES logo.
 *
 * PLACEHOLDER MARK. The real logo asset package has not been supplied - see
 * PROJECT_STATUS.md, Open Decisions. When the official SVG arrives, replace the
 * <svg> below and keep this component's API unchanged.
 *
 * Two treatments, per docs/DESIGN_SYSTEM.md section 6:
 *   dark surface  - violet mark, ivory wordmark
 *   light surface - violet mark, graphite wordmark
 *
 * Both are handled by tokens: the mark uses --primary and the wordmark uses
 * --foreground, so placing the logo inside a Section gives the right treatment
 * automatically.
 *
 * Keep it small and confident. Roughly 24-28px tall. Never a banner.
 */
export function BrandLogo({
  showWordmark = true,
  className,
}: {
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        width="28"
        height="28"
        aria-hidden="true"
        focusable="false"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="9" className="fill-primary" />
        <path
          d="M10.5 21.5 21.5 10.5"
          className="stroke-primary-foreground"
          strokeWidth="3.25"
          strokeLinecap="round"
        />
        <circle
          cx="11.75"
          cy="11.75"
          r="2.1"
          className="fill-primary-foreground"
        />
      </svg>

      {showWordmark ? (
        <span className="text-[0.95rem] font-bold tracking-[0.18em] text-foreground">
          SODALES
        </span>
      ) : null}
    </span>
  );
}
