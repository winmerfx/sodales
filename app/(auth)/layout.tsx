import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/ui/container";

/**
 * Auth pages share a narrow, centred, dark composition. Deliberately quiet:
 * nothing to read, nothing to decide, one thing to do.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-surface="dark" className="min-h-full bg-background py-16 md:py-24">
      <Container width="narrow">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            aria-label="SODALES home"
          >
            <BrandLogo />
          </Link>
          <div className="mt-10">{children}</div>
        </div>
      </Container>
    </div>
  );
}
