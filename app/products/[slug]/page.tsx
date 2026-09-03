import { Check, Package } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductArtwork } from "@/components/products/product-artwork";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDate, formatFileSize, formatPrice } from "@/lib/format";
import { membershipProductIds } from "@/lib/products/seed";
import {
  getProductBySlug,
  getRelatedProducts,
  listProductSlugs,
} from "@/lib/products/queries";
import {
  defaultOffer,
  isFree,
  PRODUCT_TYPE_LABELS,
} from "@/lib/products/types";

export async function generateStaticParams() {
  const slugs = await listProductSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  const title = product.seo_title ?? product.name;
  const description =
    product.seo_description ?? product.tagline ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const offer = defaultOffer(product);
  const free = isFree(product);
  const inMembership = membershipProductIds.has(product.id);
  const related = await getRelatedProducts(product);

  return (
    <>
      {/* Hero */}
      <Section surface="dark" spacing="md">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[6fr_5fr] lg:gap-16">
            <div className="flex flex-col items-start gap-5">
              <Eyebrow>
                {product.category?.name ??
                  PRODUCT_TYPE_LABELS[product.product_type]}
              </Eyebrow>

              <h1 className="text-h1 text-foreground">{product.name}</h1>

              {/* Outcome statement - what this does for you, in one line */}
              {product.tagline ? (
                <p className="max-w-[52ch] text-body-lg text-muted-foreground">
                  {product.tagline}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge>{PRODUCT_TYPE_LABELS[product.product_type]}</Badge>
                {inMembership ? (
                  <Badge tone="accent">Included with membership</Badge>
                ) : null}
                {free ? <Badge tone="success">Free</Badge> : null}
              </div>

              {/* Purchase */}
              <div className="mt-4 w-full rounded-lg border border-border bg-surface p-6">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-h2 text-foreground">
                    {offer ? formatPrice(offer.price_cents, offer.currency) : "—"}
                  </span>
                  {offer?.compare_at_cents ? (
                    <span className="text-body-lg text-subtle-foreground line-through">
                      {formatPrice(offer.compare_at_cents, offer.currency)}
                    </span>
                  ) : null}
                  {offer && !free ? (
                    <span className="text-body-sm text-subtle-foreground">
                      one-time
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button href="/signup" size="lg" className="sm:flex-1">
                    {free ? "Get it free" : "Buy now"}
                  </Button>
                  {inMembership ? (
                    <Button href="/pricing" variant="secondary" size="lg">
                      Or join membership
                    </Button>
                  ) : null}
                </div>

                <p className="mt-4 text-body-sm text-subtle-foreground">
                  Checkout arrives in Phase 5. Access is granted from a verified
                  payment webhook, never from a success redirect.
                </p>
              </div>
            </div>

            <div className="lg:pt-2">
              <div className="rounded-xl border border-border bg-surface p-1">
                <div className="flex h-9 items-center gap-1.5 px-3">
                  <span className="size-2.5 rounded-full bg-border-strong" />
                  <span className="size-2.5 rounded-full bg-border-strong" />
                  <span className="size-2.5 rounded-full bg-border-strong" />
                </div>
                <ProductArtwork productType={product.product_type} />
              </div>
              <p className="mt-3 text-body-sm text-subtle-foreground">
                Preview media is a placeholder until product artwork is produced.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Detail */}
      <Section surface="light" spacing="md">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[7fr_4fr] lg:gap-20">
            <div className="flex flex-col gap-12">
              {product.description ? (
                <section className="flex flex-col gap-4">
                  <h2 className="text-h3 text-foreground">What this is</h2>
                  <p className="max-w-[68ch] text-body-lg text-muted-foreground">
                    {product.description}
                  </p>
                </section>
              ) : null}

              {product.assets.length > 0 ? (
                <section className="flex flex-col gap-5">
                  <h2 className="text-h3 text-foreground">What&rsquo;s included</h2>
                  <ul className="flex flex-col gap-3">
                    {product.assets.map((asset) => (
                      <li
                        key={asset.id}
                        className="flex gap-3 rounded-md border border-border bg-surface p-4"
                      >
                        <Check
                          size={18}
                          className="mt-0.5 shrink-0 text-success"
                          aria-hidden="true"
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-body-sm font-semibold text-foreground">
                            {asset.title}
                            {asset.file_size_bytes ? (
                              <span className="ml-2 font-normal text-subtle-foreground">
                                {formatFileSize(asset.file_size_bytes)}
                              </span>
                            ) : null}
                          </p>
                          {asset.description ? (
                            <p className="text-body-sm text-muted-foreground">
                              {asset.description}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {product.bundle_items.length > 0 ? (
                <section className="flex flex-col gap-5">
                  <h2 className="text-h3 text-foreground">
                    Products in this bundle
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {product.bundle_items.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`/products/${item.slug}`}
                          className="flex items-start gap-3 rounded-md border border-border bg-surface p-4 transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          <Package
                            size={18}
                            className="mt-0.5 shrink-0 text-accent"
                            aria-hidden="true"
                          />
                          <div className="flex flex-col gap-1">
                            <p className="text-body-sm font-semibold text-foreground">
                              {item.name}
                            </p>
                            {item.tagline ? (
                              <p className="text-body-sm text-muted-foreground">
                                {item.tagline}
                              </p>
                            ) : null}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            {/* Requirements come BEFORE purchase in reading order on mobile too:
                someone buying a workflow that needs infrastructure they lack is
                a refund. See docs/MASTER_PLAN.md section 7. */}
            <aside className="flex flex-col gap-8">
              {product.requirements ? (
                <section className="flex flex-col gap-3 rounded-lg border border-border-strong bg-surface-muted p-6">
                  <h2 className="text-label uppercase text-subtle-foreground">
                    Before you buy
                  </h2>
                  <p className="text-body-sm text-muted-foreground">
                    {product.requirements}
                  </p>
                </section>
              ) : null}

              {product.license_terms ? (
                <section className="flex flex-col gap-3">
                  <h2 className="text-label uppercase text-subtle-foreground">
                    License
                  </h2>
                  <p className="text-body-sm text-muted-foreground">
                    {product.license_terms}
                  </p>
                </section>
              ) : null}

              {product.published_at ? (
                <section className="flex flex-col gap-3">
                  <h2 className="text-label uppercase text-subtle-foreground">
                    Published
                  </h2>
                  <p className="text-body-sm text-muted-foreground">
                    {formatDate(product.published_at)}
                  </p>
                </section>
              ) : null}
            </aside>
          </div>
        </Container>
      </Section>

      {/* Related */}
      {related.length > 0 ? (
        <Section surface="dark" spacing="md">
          <Container>
            <SectionHeader eyebrow="Related" title="You might also need" />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id} className="flex">
                  <ProductCard product={item} className="w-full" />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
