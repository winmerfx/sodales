import type { Metadata } from "next";

import { PolicyPage } from "@/components/marketing/policy-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How SODALES handles your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy"
      summary="What data SODALES collects, why, and what happens to it."
      mustCover={[
        "What is collected at signup: email, name, and whether marketing email was opted into.",
        "What is collected at checkout, and that card details go to the payment provider and are never stored by SODALES.",
        "Analytics: what product and page events are recorded, and whether they are tied to an account.",
        "AI tools: that prompts and inputs are sent to a third-party model provider, which providers those are, and how long inputs are retained.",
        "Third parties that process data: hosting, database, payments, email, analytics, error monitoring.",
        "How long data is kept, and what happens to it when an account is deleted.",
        "How to request a copy of your data or its deletion, and who to contact.",
        "Cookies: which are strictly necessary (the session cookie) and which are optional.",
      ]}
    />
  );
}
