import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/lib/config/brand";

/**
 * Site header.
 *
 * Dark surface, per the brand's high-contrast navigation. A Server Component -
 * only the mobile panel needs client state.
 *
 * Header branding should read as a premium studio, not a retail banner: small
 * logo, restrained type, one primary action.
 */
export function SiteHeader() {
  return (
    <header
      data-surface="dark"
      className="sticky top-0 z-40 border-b border-border bg-background text-foreground"
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6 md:h-18">
          <Link
            href="/"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            aria-label="SODALES home"
          >
            <BrandLogo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              href="/login"
              variant="ghost"
              size="sm"
              className="hidden lg:inline-flex"
            >
              Sign in
            </Button>
            <Button href="/products" size="sm" className="hidden sm:inline-flex">
              Explore products
            </Button>
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
