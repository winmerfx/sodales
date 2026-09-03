import { Check } from "lucide-react";
import type { Metadata } from "next";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { listProducts } from "@/lib/products/queries";
import { membershipProductIds } from "@/lib/products/seed";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "One membership covering the SODALES tool and workflow library, with a clear monthly AI quota. Buy outright or subscribe.",
  alternates: { canonical: "/pricing" },
};

const included = [
  "Every product marked “Included with membership”",
  "New library additions as they ship",
  "A monthly AI generation quota, visible in your dashboard",
  "Setup guides and updates for everything included",
];

const notIncluded = [
  "Products sold outright — those stay one-time purchases",
  "Unlimited AI generation. Every request costs money to run",
];

export default async function PricingPage() {
  const all = await listProducts();
  const inMembership = all.filter((product) =>
    membershipProductIds.has(product.id),
  );

  return (
    <>
      <Section surface="dark" spacing="md">
        <Container width="narrow">
          <SectionHeader
            as="h1"
            size="h1"
            align="center"
            eyebrow="Membership"
            title="Buy what you need, or get the library"
            subtitle="Pricing is not final — plan name, price and inclusions are open decisions. The structure below is what ships."
          />
        </Container>
      </Section>

      <Section surface="light" spacing="md">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* One-time */}
            <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-label uppercase text-subtle-foreground">
                  One-time
                </h2>
                <p className="text-h2 text-foreground">Buy outright</p>
                <p className="text-body-sm text-muted-foreground">
                  Pay once. It is yours permanently, including future updates to
                  that product.
                </p>
              </div>
              <Button href="/products" variant="secondary" size="lg">
                Browse products
              </Button>
            </div>

            {/* Membership */}
            <div className="flex flex-col gap-6 rounded-xl border-2 border-primary bg-surface p-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-label uppercase text-accent">Membership</h2>
                <p className="text-h2 text-foreground">
                  Price TBD
                  <span className="ml-2 text-body-lg font-normal text-subtle-foreground">
                    / month
                  </span>
                </p>
                <p className="text-body-sm text-muted-foreground">
                  Access to the included library while your subscription is
                  active, plus a monthly AI quota.
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {included.map((item) => (
                  <li key={item} className="flex gap-2.5 text-body-sm text-muted-foreground">
                    <Check
                      size={17}
                      className="mt-0.5 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <Button href="/signup" size="lg">
                Join the waitlist
              </Button>
            </div>
          </div>

          {/* Being explicit about what membership is NOT prevents chargebacks.
              See docs/MASTER_PLAN.md section 5. */}
          <div className="mt-10 rounded-lg border border-border-strong bg-surface-muted p-6">
            <h2 className="text-label uppercase text-subtle-foreground">
              What membership is not
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {notIncluded.map((item) => (
                <li key={item} className="text-body-sm text-muted-foreground">
                  — {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-[68ch] text-body-sm text-muted-foreground">
              Membership is access, not ownership. If you cancel, products you
              bought outright stay in your library; membership-included products
              do not. Access runs to the end of the period you have paid for.
            </p>
          </div>
        </Container>
      </Section>

      {inMembership.length > 0 ? (
        <Section surface="dark" spacing="md">
          <Container>
            <SectionHeader
              eyebrow="Included"
              title="What the membership covers today"
              subtitle="This list grows. Adding a product to the plan reaches every existing member immediately."
            />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {inMembership.map((product) => (
                <li key={product.id} className="flex">
                  <ProductCard product={product} className="w-full" />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
