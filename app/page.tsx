import { ArrowRight, Check, Download } from "lucide-react";

import { ProductArtwork } from "@/components/products/product-artwork";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { formatPrice } from "@/lib/format";
import {
  getLeadMagnet,
  listCategories,
  listFeaturedProducts,
  listProductsByType,
} from "@/lib/products/queries";
import { defaultOffer } from "@/lib/products/types";

const steps = [
  {
    title: "Find the system",
    body: "Browse by outcome, not by file type. Every product states what it does for you in one line.",
  },
  {
    title: "Buy once, own it",
    body: "Purchases land in your library within seconds of payment clearing, granted from a verified webhook.",
  },
  {
    title: "Get it running",
    body: "Requirements are listed before you buy. Setup guides ship with anything that needs configuring.",
  },
];

const faqs = [
  {
    q: "Do I keep what I buy if I cancel a membership?",
    a: "Anything you bought outright is yours permanently. Membership-included products are access, not ownership — that access ends when the subscription does. Every product page says which it is before you pay.",
  },
  {
    q: "What do I need to run the workflows?",
    a: "Most need an n8n instance, self-hosted or cloud, plus accounts for whatever they connect to. Requirements are listed on every product page before the buy button, not after.",
  },
  {
    q: "Are the AI tools unlimited?",
    a: "No, and nobody offering that is being straight with you — every generation costs money to run. Plans carry a clear monthly quota, and your usage is visible in your dashboard.",
  },
  {
    q: "Can I use these with client work?",
    a: "Yes. The standard license covers use in your own business and for clients. You cannot resell or redistribute the files themselves.",
  },
];

export default async function Home() {
  const [featured, tools, workflows, categories, leadMagnet] = await Promise.all(
    [
      listFeaturedProducts(3),
      listProductsByType("tool", 2),
      listProductsByType("workflow", 2),
      listCategories(),
      getLeadMagnet(),
    ],
  );

  const bundle = featured.find((p) => p.product_type === "bundle");
  const bundleOffer = bundle ? defaultOffer(bundle) : null;

  return (
    <>
      {/* Hero */}
      <Section surface="dark" spacing="lg">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <div className="flex flex-col items-start gap-6">
              <Eyebrow>Tools · Workflows · Systems</Eyebrow>
              <h1 className="text-display-xl text-foreground">
                Build smarter.
                <br />
                Create faster.
              </h1>
              <p className="max-w-[52ch] text-body-lg text-muted-foreground">
                AI tools, automations and workflow systems that produce a result
                on the first pass. Bought once, kept in a library that improves
                over time.
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Button href="/products" size="lg">
                  Explore products
                  <ArrowRight size={18} aria-hidden="true" />
                </Button>
                <Button
                  href="/products?type=tool"
                  variant="secondary"
                  size="lg"
                >
                  View AI tools
                </Button>
              </div>
            </div>

            {/* Product showcase, not abstract art */}
            {featured[0] ? (
              <div className="rounded-xl border border-border bg-surface p-1">
                <div className="flex h-9 items-center gap-1.5 px-3">
                  <span className="size-2.5 rounded-full bg-border-strong" />
                  <span className="size-2.5 rounded-full bg-border-strong" />
                  <span className="size-2.5 rounded-full bg-border-strong" />
                </div>
                <ProductArtwork productType={featured[0].product_type} />
                <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <p className="text-body-sm font-semibold text-foreground">
                    {featured[0].name}
                  </p>
                  <Badge tone="accent">Featured</Badge>
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* Categories */}
      <Section surface="light" spacing="sm">
        <Container>
          <nav aria-label="Product categories">
            <ul className="flex flex-wrap gap-2.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`/products?category=${category.slug}`}
                    className="inline-flex h-10 items-center rounded-full border border-border bg-surface px-4 text-body-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>

      {/* Featured products */}
      <Section surface="light" spacing="md">
        <Container>
          <SectionHeader
            eyebrow="Featured"
            title="Start with these"
            subtitle="The three that remove the most manual work for the most people."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} className="w-full" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* AI tools and workflows */}
      <Section surface="dark" spacing="md">
        <Container>
          <SectionHeader
            eyebrow="Where this is going"
            title="From a file you download to a tool you use"
            subtitle="Templates and workflows solve a problem once. Hosted tools keep solving it, and keep getting better."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...tools, ...workflows].map((product) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} className="w-full" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Bundle spotlight */}
      {bundle ? (
        <Section surface="light" spacing="md">
          <Container>
            <div className="grid items-center gap-10 rounded-xl border border-border bg-surface p-6 md:p-10 lg:grid-cols-[5fr_6fr] lg:gap-16">
              <ProductArtwork productType="bundle" className="rounded-lg" />
              <div className="flex flex-col items-start gap-5">
                <Eyebrow>Bundle</Eyebrow>
                <h2 className="text-h2 text-foreground">{bundle.name}</h2>
                <p className="max-w-[52ch] text-body-lg text-muted-foreground">
                  {bundle.tagline}
                </p>
                <ul className="flex flex-col gap-2">
                  {bundle.bundle_items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-2.5 text-body-sm text-muted-foreground"
                    >
                      <Check
                        size={16}
                        className="shrink-0 text-success"
                        aria-hidden="true"
                      />
                      {item.name}
                    </li>
                  ))}
                </ul>
                {bundleOffer ? (
                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-h3 text-foreground">
                      {formatPrice(bundleOffer.price_cents, bundleOffer.currency)}
                    </span>
                    {bundleOffer.compare_at_cents ? (
                      <span className="text-body-lg text-subtle-foreground line-through">
                        {formatPrice(
                          bundleOffer.compare_at_cents,
                          bundleOffer.currency,
                        )}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <Button href={`/products/${bundle.slug}`} size="lg">
                  See what&rsquo;s inside
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Membership */}
      <Section surface="dark" spacing="md">
        <Container width="narrow">
          <div className="flex flex-col items-center gap-6 text-center">
            <SectionHeader
              align="center"
              eyebrow="Membership"
              title="Or get the library"
              subtitle="One subscription covering the tools, workflows and systems as they ship — including an AI quota. Cancel and you keep everything you bought outright."
            />
            <Button href="/pricing" size="lg">
              See what&rsquo;s included
            </Button>
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section surface="light" spacing="md">
        <Container>
          <SectionHeader eyebrow="How it works" title="No surprises" />
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-3">
                <span className="text-label uppercase text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h4 text-foreground">{step.title}</h3>
                <p className="text-body-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Lead magnet */}
      {leadMagnet ? (
        <Section surface="dark" spacing="md">
          <Container>
            <div className="flex flex-col items-start gap-6 rounded-xl border border-border bg-surface p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="flex flex-col gap-3">
                <Eyebrow>Free</Eyebrow>
                <h2 className="text-h3 text-foreground">{leadMagnet.name}</h2>
                <p className="max-w-[52ch] text-body-sm text-muted-foreground">
                  {leadMagnet.tagline}
                </p>
              </div>
              <Button
                href={`/products/${leadMagnet.slug}`}
                size="lg"
                className="shrink-0"
              >
                <Download size={18} aria-hidden="true" />
                Get it free
              </Button>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* FAQ - native disclosure, no JavaScript needed */}
      <Section surface="light" spacing="md">
        <Container width="narrow">
          <SectionHeader eyebrow="FAQ" title="Straight answers" />
          <div className="mt-10 flex flex-col">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group border-b border-border py-5 first:border-t"
              >
                <summary className="cursor-pointer list-none text-body-lg font-semibold text-foreground marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                  <span className="flex items-start justify-between gap-6">
                    {faq.q}
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-accent transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 max-w-[68ch] text-body-sm text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
