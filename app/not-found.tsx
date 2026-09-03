import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Branded 404.
 *
 * The Next default is unstyled and reads as a broken deployment. A 404 is a
 * normal part of a site and should still look like the site.
 */
export default function NotFound() {
  return (
    <Section surface="dark" spacing="lg" className="min-h-full">
      <Container width="narrow">
        <div className="flex flex-col items-start gap-6">
          <Eyebrow>404</Eyebrow>
          <h1 className="text-display text-foreground">
            That page doesn&rsquo;t exist.
          </h1>
          <p className="max-w-[52ch] text-body-lg text-muted-foreground">
            The link may be out of date, or the product may have been renamed.
            The catalog is the quickest way back to something useful.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="/products" size="lg">
              Browse products
            </Button>
            <Button href="/" variant="secondary" size="lg">
              Back to home
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
