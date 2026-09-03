import { FileText } from "lucide-react";
import type { Metadata } from "next";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { getLeadMagnet } from "@/lib/products/queries";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Free worksheets, guides and teardowns from SODALES. No signup required to read.",
  alternates: { canonical: "/resources" },
};

/**
 * Resources hub.
 *
 * Real content is a post-launch concern, but the route is linked from the
 * header and footer, so it has to exist and it has to be worth landing on.
 * Today it surfaces the free lead magnet, which is the one genuine resource
 * that exists.
 */
export default async function ResourcesPage() {
  const leadMagnet = await getLeadMagnet();

  return (
    <>
      <Section surface="dark" spacing="sm">
        <Container>
          <SectionHeader
            as="h1"
            size="h1"
            eyebrow="Resources"
            title="Free things worth your time"
            subtitle="Worksheets, teardowns and guides. Nothing here is a pitch with a download gate bolted on."
          />
        </Container>
      </Section>

      <Section surface="light" spacing="md">
        <Container>
          {leadMagnet ? (
            <div className="flex flex-col gap-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ProductCard product={leadMagnet} />
              </div>

              <div className="rounded-lg border border-border bg-surface p-8">
                <h2 className="text-h4 text-foreground">More on the way</h2>
                <p className="mt-3 max-w-[62ch] text-body-sm text-muted-foreground">
                  Guides and teardowns are published here as they are written.
                  In the meantime, the catalog is the best picture of how
                  SODALES approaches this work.
                </p>
                <div className="mt-6">
                  <Button href="/products" variant="secondary">
                    Browse the catalog
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No resources published yet"
              description="Free guides and worksheets will appear here as they are written."
              action={{ label: "Browse the catalog", href: "/products" }}
            />
          )}
        </Container>
      </Section>
    </>
  );
}
