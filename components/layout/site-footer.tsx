import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/ui/container";
import { brand, footerNav } from "@/lib/config/brand";

export function SiteFooter() {
  return (
    <footer
      data-surface="dark"
      className="mt-auto border-t border-border bg-background text-foreground"
    >
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-8 lg:py-20">
          <div className="flex flex-col gap-4">
            <BrandLogo />
            <p className="max-w-[38ch] text-body-sm text-muted-foreground">
              {brand.description}
            </p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-label uppercase text-subtle-foreground">
                {group.title}
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-8 text-body-sm text-subtle-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p>
            <a
              href={`mailto:${brand.supportEmail}`}
              className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {brand.supportEmail}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
