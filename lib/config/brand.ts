/**
 * Brand configuration.
 *
 * Values that appear across the site live here rather than being retyped into
 * components, so a rename or a tagline decision is one edit.
 * Placeholders are tracked in PROJECT_STATUS.md under Open Decisions.
 */

export const brand = {
  name: "SODALES",
  /** TODO: final tagline undecided - PROJECT_STATUS.md */
  tagline: "Tools, systems and workflows for people who build.",
  description:
    "Premium AI tools, automations, workflows, prompt systems and templates. Built to produce a result, not to sit in a folder.",
  supportEmail: process.env.SUPPORT_EMAIL ?? "support@example.com",
  defaultCurrency: "USD",
} as const;

/** Primary navigation. Routes land in Phase 2 and Phase 3. */
export const primaryNav = [
  { label: "Products", href: "/products" },
  { label: "AI Tools", href: "/products?type=tool" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
] as const;

export const footerNav = [
  {
    title: "Store",
    links: [
      { label: "All products", href: "/products" },
      { label: "AI tools", href: "/products?type=tool" },
      { label: "Workflows", href: "/products?type=workflow" },
      { label: "Bundles", href: "/products?type=bundle" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/signup" },
      { label: "Your library", href: "/dashboard/library" },
      { label: "Membership", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refunds", href: "/refunds" },
    ],
  },
] as const;
