import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { brand } from "@/lib/config/brand";

/**
 * Shared shell for the legal pages.
 *
 * These are PLACEHOLDERS. They deliberately do not contain policy text that
 * reads as binding — an outline of what each policy must cover is genuinely
 * useful, whereas invented terms that look real are worse than nothing: they
 * would be relied on by customers and by the payment provider, and neither the
 * owner nor this codebase can stand behind them.
 *
 * Replace each with reviewed text before taking live payments (Phase 10).
 */
export function PolicyPage({
  title,
  summary,
  mustCover,
  children,
}: {
  title: string;
  summary: string;
  mustCover: string[];
  children?: ReactNode;
}) {
  return (
    <>
      <Section surface="dark" spacing="sm">
        <Container width="narrow">
          <SectionHeader
            as="h1"
            size="h1"
            eyebrow="Policy"
            title={title}
            subtitle={summary}
          />
        </Container>
      </Section>

      <Section surface="light" spacing="md">
        <Container width="narrow">
          <div
            role="note"
            className="rounded-lg border-2 border-warning/50 bg-surface p-6"
          >
            <p className="text-label uppercase text-warning">
              Placeholder — not yet a policy
            </p>
            <p className="mt-3 text-body-sm text-muted-foreground">
              This page is scaffolding so the site&rsquo;s navigation is
              complete. It is not a legal document, nobody has reviewed it, and
              it must be replaced with real text before SODALES takes payments.
              Most payment providers require a published refund policy before
              they will approve an account.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-5">
            <h2 className="text-h3 text-foreground">
              What this policy needs to cover
            </h2>
            <ul className="flex flex-col gap-3">
              {mustCover.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-border-strong pl-4 text-body-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {children ? <div className="mt-12">{children}</div> : null}

          <p className="mt-12 border-t border-border pt-8 text-body-sm text-subtle-foreground">
            Questions in the meantime:{" "}
            <a
              href={`mailto:${brand.supportEmail}`}
              className="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {brand.supportEmail}
            </a>
          </p>
        </Container>
      </Section>
    </>
  );
}
