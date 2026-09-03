import type {
  Category,
  Product,
  ProductAsset,
  ProductOffer,
  ProductWithRelations,
} from "@/lib/products/types";

/**
 * Development seed data.
 *
 * PLACEHOLDER CATALOG. These are the seven products the brief asked for as
 * development placeholders, not the real launch catalog — that is an open
 * decision in PROJECT_STATUS.md.
 *
 * Every row satisfies the types in ./types.ts, which mirror the real schema.
 * Phase 4 deletes this file and points lib/products/queries.ts at Supabase;
 * no component should need to change.
 */

const now = "2026-08-01T00:00:00.000Z";

export const categories: Category[] = [
  {
    id: "cat-ai-tools",
    slug: "ai-tools",
    name: "AI Tools",
    description: "Hosted tools that stay in your library and improve over time.",
    parent_id: null,
    sort_order: 1,
  },
  {
    id: "cat-automation",
    slug: "automation",
    name: "Automation",
    description: "Systems that run the job end to end without supervision.",
    parent_id: null,
    sort_order: 2,
  },
  {
    id: "cat-workflows",
    slug: "workflows",
    name: "Workflows",
    description: "Importable n8n workflows, documented and ready to run.",
    parent_id: null,
    sort_order: 3,
  },
  {
    id: "cat-prompt-systems",
    slug: "prompt-systems",
    name: "Prompt Systems",
    description: "Structured prompt sets with the reasoning written down.",
    parent_id: null,
    sort_order: 4,
  },
  {
    id: "cat-templates",
    slug: "templates",
    name: "Templates",
    description: "Reusable structures you can ship from on day one.",
    parent_id: null,
    sort_order: 5,
  },
];

function product(overrides: Partial<Product> & Pick<Product, "id" | "slug" | "name" | "product_type">): Product {
  return {
    tagline: null,
    description: null,
    status: "published",
    category_id: null,
    cover_image_url: null,
    is_featured: false,
    requirements: null,
    license_terms:
      "Single-operator commercial license. Use it in your own business and for client work. Do not resell or redistribute the files themselves.",
    seo_title: null,
    seo_description: null,
    og_image_url: null,
    published_at: now,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

const products: Product[] = [
  product({
    id: "prd-brief-composer",
    slug: "brief-composer",
    name: "Brief Composer",
    product_type: "tool",
    category_id: "cat-ai-tools",
    is_featured: true,
    tagline: "Turn a messy client call into a scoped brief in under a minute.",
    description:
      "Paste raw notes from a discovery call and get back a structured brief: objective, constraints, deliverables, out-of-scope, open questions and a first-pass timeline. Built for people who lose an hour after every call turning notes into something a team can act on.",
    requirements:
      "A SODALES account. No API key of your own required — generations run on your plan's included quota.",
    published_at: "2026-08-20T00:00:00.000Z",
  }),
  product({
    id: "prd-onboarding-engine",
    slug: "client-onboarding-engine",
    name: "Client Onboarding Engine",
    product_type: "automation",
    category_id: "cat-automation",
    is_featured: true,
    tagline:
      "Signed contract to kicked-off project without anyone touching a keyboard.",
    description:
      "A complete onboarding system: contract signature triggers folder creation, task templates, a welcome sequence, an intake form, and a kickoff call booking. Ships as connected n8n workflows plus the document templates they depend on.",
    requirements:
      "A self-hosted or cloud n8n instance, and accounts for the tools you connect. Setup takes roughly 90 minutes following the included guide.",
    published_at: "2026-08-14T00:00:00.000Z",
  }),
  product({
    id: "prd-lead-enrichment",
    slug: "lead-enrichment-pipeline",
    name: "Lead Enrichment Pipeline",
    product_type: "workflow",
    category_id: "cat-workflows",
    is_featured: true,
    tagline:
      "Every inbound lead researched, scored and routed before you read it.",
    description:
      "An n8n workflow that takes a raw form submission, enriches it from public sources, scores it against your ideal-customer criteria, and routes it to the right place with a short written summary of who they are and why they matter.",
    requirements:
      "n8n 1.x, and an enrichment provider account. The workflow ships with the provider abstracted so you can swap it.",
    published_at: "2026-08-08T00:00:00.000Z",
  }),
  product({
    id: "prd-positioning-prompts",
    slug: "positioning-prompt-system",
    name: "Positioning Prompt System",
    product_type: "prompt_system",
    category_id: "cat-prompt-systems",
    tagline:
      "Find the sentence that makes the right buyer stop scrolling.",
    description:
      "Fourteen chained prompts that move from customer research to a defensible positioning statement, with the reasoning behind each step written out so you can adapt rather than copy. Includes worked examples for a service business, a SaaS product and a digital product store.",
    requirements: "Any capable chat model. Tested on current frontier models.",
    published_at: "2026-07-30T00:00:00.000Z",
  }),
  product({
    id: "prd-offer-page-kit",
    slug: "offer-page-template-kit",
    name: "Offer Page Template Kit",
    product_type: "template",
    category_id: "cat-templates",
    tagline: "A sales page structure that survives contact with a real buyer.",
    description:
      "Six offer-page layouts with the copy structure annotated section by section: what each block is for, what to write, and the failure mode it prevents. Supplied as editable documents plus a plain-text outline you can hand to a writer.",
    requirements: "None.",
    published_at: "2026-07-22T00:00:00.000Z",
  }),
  product({
    id: "prd-operator-bundle",
    slug: "operator-bundle",
    name: "The Operator Bundle",
    product_type: "bundle",
    category_id: "cat-automation",
    is_featured: true,
    tagline: "The four systems that remove the most manual work, together.",
    description:
      "Brief Composer, the Client Onboarding Engine, the Lead Enrichment Pipeline and the Positioning Prompt System — bought together. Everything a small team needs to stop doing the same three hours of admin every week.",
    requirements:
      "See each included product. The bundle is worth it only if you run, or plan to run, n8n.",
    published_at: "2026-08-20T00:00:00.000Z",
  }),
  product({
    id: "prd-automation-audit",
    slug: "automation-audit-checklist",
    name: "The Automation Audit",
    product_type: "download",
    category_id: "cat-automation",
    tagline:
      "Find the three tasks in your week worth automating first. Free.",
    description:
      "A 12-page worksheet for auditing where your time actually goes and which tasks repay automation soonest. Deliberately opinionated: it will tell you when a task is not worth automating, which is most of them.",
    requirements: "None. Bring one week of honest time tracking.",
    published_at: "2026-07-15T00:00:00.000Z",
  }),
];

const offers: ProductOffer[] = [
  {
    id: "off-brief-composer",
    product_id: "prd-brief-composer",
    name: "Standard license",
    kind: "one_time",
    price_cents: 4900,
    compare_at_cents: null,
    currency: "USD",
    provider: null,
    provider_variant_id: null,
    is_default: true,
    is_active: true,
  },
  {
    id: "off-onboarding-engine",
    product_id: "prd-onboarding-engine",
    name: "Standard license",
    kind: "one_time",
    price_cents: 14900,
    compare_at_cents: null,
    currency: "USD",
    provider: null,
    provider_variant_id: null,
    is_default: true,
    is_active: true,
  },
  {
    id: "off-lead-enrichment",
    product_id: "prd-lead-enrichment",
    name: "Standard license",
    kind: "one_time",
    price_cents: 8900,
    compare_at_cents: null,
    currency: "USD",
    provider: null,
    provider_variant_id: null,
    is_default: true,
    is_active: true,
  },
  {
    id: "off-positioning-prompts",
    product_id: "prd-positioning-prompts",
    name: "Standard license",
    kind: "one_time",
    price_cents: 3900,
    compare_at_cents: null,
    currency: "USD",
    provider: null,
    provider_variant_id: null,
    is_default: true,
    is_active: true,
  },
  {
    id: "off-offer-page-kit",
    product_id: "prd-offer-page-kit",
    name: "Standard license",
    kind: "one_time",
    price_cents: 2900,
    compare_at_cents: null,
    currency: "USD",
    provider: null,
    provider_variant_id: null,
    is_default: true,
    is_active: true,
  },
  {
    id: "off-operator-bundle",
    product_id: "prd-operator-bundle",
    name: "Bundle license",
    kind: "one_time",
    price_cents: 19900,
    compare_at_cents: 32600,
    currency: "USD",
    provider: null,
    provider_variant_id: null,
    is_default: true,
    is_active: true,
  },
  {
    id: "off-automation-audit",
    product_id: "prd-automation-audit",
    name: "Free download",
    kind: "free",
    price_cents: 0,
    compare_at_cents: null,
    currency: "USD",
    provider: null,
    provider_variant_id: null,
    is_default: true,
    is_active: true,
  },
];

const assets: ProductAsset[] = [
  {
    id: "ast-brief-composer-tool",
    product_id: "prd-brief-composer",
    fulfillment_type: "tool_access",
    title: "Open Brief Composer",
    description: "Runs in your dashboard. Counts against your plan's quota.",
    storage_path: null,
    external_url: null,
    body: null,
    tool_slug: "brief-composer",
    file_size_bytes: null,
    is_preview: false,
    sort_order: 1,
  },
  {
    id: "ast-onboarding-workflows",
    product_id: "prd-onboarding-engine",
    fulfillment_type: "file",
    title: "n8n workflow files (6)",
    description: "Import-ready JSON for each stage of the onboarding sequence.",
    storage_path: "onboarding-engine/workflows.zip",
    external_url: null,
    body: null,
    tool_slug: null,
    file_size_bytes: 184320,
    is_preview: false,
    sort_order: 1,
  },
  {
    id: "ast-onboarding-setup",
    product_id: "prd-onboarding-engine",
    fulfillment_type: "instructions",
    title: "Setup guide",
    description: "Credentials, environment variables and the order to import in.",
    storage_path: null,
    external_url: null,
    body: null,
    tool_slug: null,
    file_size_bytes: null,
    is_preview: false,
    sort_order: 2,
  },
  {
    id: "ast-lead-enrichment-workflow",
    product_id: "prd-lead-enrichment",
    fulfillment_type: "file",
    title: "Workflow JSON",
    description: "Single import, provider credentials abstracted into variables.",
    storage_path: "lead-enrichment/workflow.json",
    external_url: null,
    body: null,
    tool_slug: null,
    file_size_bytes: 42130,
    is_preview: false,
    sort_order: 1,
  },
  {
    id: "ast-positioning-prompts",
    product_id: "prd-positioning-prompts",
    fulfillment_type: "protected_page",
    title: "The prompt system",
    description: "All fourteen prompts with commentary, readable in your library.",
    storage_path: null,
    external_url: null,
    body: null,
    tool_slug: null,
    file_size_bytes: null,
    is_preview: false,
    sort_order: 1,
  },
  {
    id: "ast-offer-page-kit",
    product_id: "prd-offer-page-kit",
    fulfillment_type: "file",
    title: "Template pack",
    description: "Six layouts as editable documents plus plain-text outlines.",
    storage_path: "offer-page-kit/templates.zip",
    external_url: null,
    body: null,
    tool_slug: null,
    file_size_bytes: 2310000,
    is_preview: false,
    sort_order: 1,
  },
  {
    id: "ast-automation-audit",
    product_id: "prd-automation-audit",
    fulfillment_type: "file",
    title: "The Automation Audit (PDF)",
    description: "12 pages, printable.",
    storage_path: "automation-audit/audit.pdf",
    external_url: null,
    body: null,
    tool_slug: null,
    file_size_bytes: 940000,
    is_preview: false,
    sort_order: 1,
  },
];

/** Bundle membership: bundle product id -> child product ids. */
const bundleItems: Record<string, string[]> = {
  "prd-operator-bundle": [
    "prd-brief-composer",
    "prd-onboarding-engine",
    "prd-lead-enrichment",
    "prd-positioning-prompts",
  ],
};

/** Products included in the membership plan, by id. */
export const membershipProductIds = new Set<string>([
  "prd-brief-composer",
  "prd-lead-enrichment",
  "prd-positioning-prompts",
  "prd-offer-page-kit",
]);

/** Assembled rows, joined the way the Phase 4 queries will return them. */
export const seedProducts: ProductWithRelations[] = products.map((row) => ({
  ...row,
  category: categories.find((c) => c.id === row.category_id) ?? null,
  offers: offers.filter((o) => o.product_id === row.id),
  assets: assets.filter((a) => a.product_id === row.id),
  bundle_items: (bundleItems[row.id] ?? [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p)),
}));
