import { ArrowRight, Boxes, Workflow, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";

/**
 * Phase 1 shell page.
 *
 * This is NOT the homepage. It exists to prove the design system works: both
 * surfaces, the type scale, buttons, and the responsive shell. The real
 * homepage is built in Phase 2 against typed seed data.
 */

const pillars = [
  {
    icon: Workflow,
    title: "Workflows and automations",
    body: "Importable n8n workflows and multi-part systems that run the job end to end, not a diagram of one.",
  },
  {
    icon: Sparkles,
    title: "AI tools",
    body: "Hosted tools that stay in your library. Metered, versioned, and improved over time.",
  },
  {
    icon: Boxes,
    title: "Templates and systems",
    body: "Prompt systems, templates and resource packs built to produce a result on the first pass.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero - dark composition */}
      <Section surface="dark" spacing="lg">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <div className="flex flex-col items-start gap-6">
              <Eyebrow>Phase 1 — Foundation</Eyebrow>
              <h1 className="text-display-xl text-foreground">
                Build smarter.
                <br />
                Create faster.
              </h1>
              <p className="max-w-[52ch] text-body-lg text-muted-foreground">
                The SODALES design system is live. Tokens, typography, layout
                primitives and the responsive shell are in place — the catalog
                arrives in Phase 2.
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Button href="/products" size="lg">
                  Explore products
                  <ArrowRight size={18} aria-hidden="true" />
                </Button>
                <Button href="/pricing" variant="secondary" size="lg">
                  View membership
                </Button>
              </div>
            </div>

            {/* Placeholder for the product showcase built in Phase 2 */}
            <div className="rounded-xl border border-border bg-surface p-1">
              <div className="flex h-9 items-center gap-1.5 px-3">
                <span className="size-2.5 rounded-full bg-border-strong" />
                <span className="size-2.5 rounded-full bg-border-strong" />
                <span className="size-2.5 rounded-full bg-border-strong" />
              </div>
              <div className="flex aspect-[16/11] items-center justify-center rounded-lg bg-surface-muted">
                <p className="text-label uppercase text-subtle-foreground">
                  Product showcase — Phase 2
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Light composition - proves tokens invert with no component changes */}
      <Section surface="light">
        <Container>
          <SectionHeader
            eyebrow="What SODALES sells"
            title="Systems that do the work"
            subtitle="Every product is judged on one thing: whether it produces the result it promised, on the first attempt."
          />

          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <li
                key={pillar.title}
                className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-7 transition-colors hover:border-border-strong"
              >
                <pillar.icon
                  size={22}
                  className="text-accent"
                  aria-hidden="true"
                />
                <h3 className="text-h4 text-foreground">{pillar.title}</h3>
                <p className="text-body-sm text-muted-foreground">
                  {pillar.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Dark again - section rhythm */}
      <Section surface="dark">
        <Container width="narrow">
          <div className="flex flex-col items-center gap-6 text-center">
            <SectionHeader
              align="center"
              eyebrow="Next"
              title="Phase 2 — Public storefront"
              subtitle="Homepage, catalog, filters, search and product pages, built against typed seed data that matches the database schema exactly."
            />
            <Button href="/products" variant="secondary" size="lg">
              Not built yet
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
