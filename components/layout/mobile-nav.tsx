"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { primaryNav } from "@/lib/config/brand";

/**
 * Mobile navigation.
 *
 * The only Client Component in the shell - it needs open/closed state. Kept as
 * a leaf so the header itself stays a Server Component.
 *
 * Mobile navigation is reconsidered for the viewport rather than being the
 * desktop bar stacked vertically: full-height panel, large tap targets,
 * account actions promoted to the bottom where a thumb reaches.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Closed from the link handlers below rather than from a pathname effect -
  // setState in an effect body causes cascading renders.
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    // Prevent the page behind the panel from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        className="inline-flex size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-surface="dark"
          className="fixed inset-0 z-50 flex flex-col bg-background text-foreground"
        >
          <div className="flex h-16 items-center justify-between px-5">
            <span className="text-label uppercase text-subtle-foreground">
              Menu
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 pt-4">
            <ul className="flex flex-col">
              {primaryNav.map((item) => (
                <li key={item.href} className="border-b border-border">
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block py-5 text-h3 text-foreground transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 border-t border-border px-5 py-6">
            <Button
              href="/login"
              variant="secondary"
              size="lg"
              fullWidth
              onClick={close}
            >
              Sign in
            </Button>
            <Button href="/products" size="lg" fullWidth onClick={close}>
              Explore products
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
