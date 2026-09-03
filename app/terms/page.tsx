import type { Metadata } from "next";

import { PolicyPage } from "@/components/marketing/policy-page";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms of using SODALES and the products sold on it.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms"
      summary="What you agree to when you buy from or subscribe to SODALES."
      mustCover={[
        "What a purchase grants: a licence to use the product, not ownership of it.",
        "The difference between buying outright and membership access — and that membership access ends when the subscription does.",
        "Permitted use: in your own business and for client work.",
        "Prohibited use: reselling, redistributing or republishing the files themselves.",
        "AI tool usage limits, and that no plan includes unlimited generation.",
        "That products may be updated, and what happens to older versions.",
        "Acceptable use and grounds for suspending an account.",
        "Limitation of liability, and that products are provided without warranty of a specific business outcome.",
        "Which jurisdiction's law applies.",
      ]}
    />
  );
}
