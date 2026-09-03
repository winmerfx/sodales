# SODALES Architecture

One Next.js application on Vercel, backed by Supabase. No microservices, no Redis, no
GraphQL, no message queue. Infrastructure gets added when a concrete requirement appears and
is written down here, not before.

---

## 1. System overview

```
                    ┌──────────────────────────────┐
   Browser  ─────►  │  Next.js (App Router)        │
                    │  Vercel                      │
                    │                              │
                    │  Server Components (default) │
                    │  Client Components (opt-in)  │
                    │  Route Handlers  /api/*       │
                    │  Server Actions              │
                    └───────────┬──────────────────┘
                                │ server-only
        ┌───────────────┬───────┴────────┬───────────────┬──────────────┐
        ▼               ▼                ▼               ▼              ▼
   Supabase        Payment          AI providers      Resend        PostHog
   Postgres        provider         (OpenAI /                       Sentry
   Auth            (webhooks)       Anthropic /
   Storage                          Gemini)
```

Everything with a secret runs on the server. The browser talks only to Next.js and to
Supabase's anon-key client (which is safe to expose and constrained by RLS).

---

## 2. Folder structure

```
app/
  (marketing)/              # public pages, dark/light editorial
    page.tsx                # homepage
    pricing/
    resources/
  products/
    page.tsx                # catalog
    [slug]/page.tsx         # product detail
  (auth)/
    login/  signup/  forgot-password/
  dashboard/                # customer, requires session
    library/  tools/  membership/  downloads/  account/
  admin/                    # requires profiles.role = 'admin'
    products/  categories/  orders/  customers/
    subscriptions/  entitlements/  tools/
  api/
    webhooks/payments/route.ts   # signature-verified, no session
    download/[assetId]/route.ts  # entitlement-gated signed URL
    tools/[slug]/route.ts        # AI tool endpoint
  auth/
    callback/route.ts       # Supabase auth exchange

components/
  ui/           # shadcn primitives + SODALES variants
  marketing/    # hero, feature sections, faq
  products/     # ProductCard, filters, gallery
  dashboard/    # library grid, tool cards, membership panel
  admin/        # tables, forms

lib/
  auth/         # session helpers, requireUser, requireAdmin
  supabase/     # client factories + generated types
  payments/     # provider interface + adapter + webhook handling
  entitlements/ # canUserAccessProduct and grant/revoke
  storage/      # signed URL issuance
  ai/           # AIService + provider adapters
  email/        # Resend wrapper + templates
  analytics/    # PostHog event helpers
  validation/   # zod schemas shared by forms and endpoints
  config/       # brand config, env parsing

styles/brand-tokens.css
supabase/migrations/
supabase/tests/
public/brand/
docs/
tests/
```

**Rule:** a provider SDK may be imported only inside its own `lib/` folder. If
`@lemonsqueezy/*` or `openai` appears anywhere in `app/` or `components/`, that is a bug.

---

## 3. Service boundaries

Eight boundaries. Each exposes a small interface; callers never see provider details.

| Service | Module | Responsibility |
| --- | --- | --- |
| Auth | `lib/auth` | Session retrieval, route guards, role checks |
| Products | `lib/products` | Catalog queries, filters, search |
| Payments | `lib/payments` | Checkout creation, webhook verification, event normalization |
| Entitlements | `lib/entitlements` | The single source of truth for "can this user access this?" |
| Storage | `lib/storage` | Signed URL issuance for protected assets |
| AI | `lib/ai` | Provider-independent generation with usage accounting |
| Email | `lib/email` | Transactional sends |
| Analytics | `lib/analytics` | Typed business events |

---

## 4. Supabase clients

Three distinct clients. Using the wrong one is the most common security mistake in this kind
of app.

| Client | Key | Where | RLS |
| --- | --- | --- | --- |
| Browser client | anon | Client Components | Enforced |
| Server client | anon + user session cookie | Server Components, Server Actions, Route Handlers | Enforced as that user |
| Admin client | **service role** | `lib/**` only, files starting `import 'server-only'` | **Bypassed** |

The admin client is used for exactly three things: webhook processing, entitlement grants,
and signed-URL issuance after an entitlement check. Every other read goes through the
session-scoped server client so RLS stays the second line of defence.

---

## 5. Authentication and authorization

**Authentication** is Supabase Auth (email + password for V1, OAuth optional later). Sessions
live in httpOnly cookies via `@supabase/ssr`. Middleware refreshes the session and redirects
unauthenticated users away from `/dashboard` and `/admin`.

**Authorization** is `profiles.role`, a database column — never `user_metadata`, which the
user can edit through the Supabase client and would be a trivial privilege escalation.

Three layers, all required:

1. **Middleware** — cheap redirect for unauthenticated users. Convenience, not security.
2. **Server guard** — `requireUser()` / `requireAdmin()` at the top of every protected page,
   action and route handler. This is the real check.
3. **RLS** — the database refuses the query even if layers 1 and 2 are bypassed.

Never rely on layer 1 alone. Never rely on hiding UI.

---

## 6. Payment flow

### 6.1 Provider status

The brief specifies Lemon Squeezy. **Verify its current status for new merchants before
Phase 5** — Lemon Squeezy was acquired by Stripe and its merchant onboarding has been in
flux. This is recorded as an open decision in `PROJECT_STATUS.md`.

The architecture therefore treats the payment provider as **replaceable**. Everything outside
`lib/payments/` speaks a normalized vocabulary, so switching to Stripe or Paddle changes one
adapter file plus environment variables, not the application.

### 6.2 The interface

```ts
// lib/payments/types.ts
export interface PaymentProvider {
  createCheckout(input: CreateCheckoutInput): Promise<{ url: string }>;
  verifyWebhook(rawBody: string, headers: Headers): Promise<VerifiedWebhook>;
  getBillingPortalUrl(providerSubscriptionId: string): Promise<string>;
}

export type CreateCheckoutInput = {
  offerId: string;          // our product_offers.id
  userId: string | null;    // null = guest checkout, matched by email later
  email?: string;
  successUrl: string;
  metadata: Record<string, string>;  // always includes offerId and userId
};

/** Normalized events. The rest of the app never sees a provider payload. */
export type PaymentEvent =
  | { type: 'order.completed';            providerEventId: string; order: NormalizedOrder }
  | { type: 'order.refunded';             providerEventId: string; providerOrderId: string }
  | { type: 'subscription.activated';     providerEventId: string; subscription: NormalizedSubscription }
  | { type: 'subscription.updated';       providerEventId: string; subscription: NormalizedSubscription }
  | { type: 'subscription.cancelled';     providerEventId: string; subscription: NormalizedSubscription }
  | { type: 'subscription.resumed';       providerEventId: string; subscription: NormalizedSubscription }
  | { type: 'subscription.expired';       providerEventId: string; subscription: NormalizedSubscription }
  | { type: 'subscription.payment_failed';    providerEventId: string; subscription: NormalizedSubscription }
  | { type: 'subscription.payment_recovered'; providerEventId: string; subscription: NormalizedSubscription };
```

### 6.3 Purchase flow

```
Product page
  └─► Server Action: createCheckout(offerId)
        └─► provider hosted checkout  ─► customer pays
                                            │
              ┌─────────────────────────────┴──────────────────────────┐
              ▼                                                        ▼
   Browser redirected to /checkout/success            POST /api/webhooks/payments
   "Payment received — your library will               1. read RAW body (no parsing first)
    update in a few seconds."                          2. verify signature  → 401 if bad
   Shows library state, grants NOTHING.                3. dedupe on provider_event_id
                                                       4. upsert order + order_items
                                                       5. grant entitlements
                                                       6. queue confirmation email
                                                       7. mark event processed → 200
```

**The success page never grants access.** It is a cosmetic redirect that anyone can navigate
to directly. Access comes only from step 5, behind signature verification.

### 6.4 Webhook rules

- Read the **raw** request body before any JSON parsing; signature verification is computed
  over exact bytes. In a Next.js route handler, `await req.text()`.
- Verify with a timing-safe comparison (`crypto.timingSafeEqual`).
- **Idempotency is mandatory.** Providers retry. Every event is inserted into
  `webhook_events` with a unique `provider_event_id`; a conflict means "already handled,
  return 200 and stop". Without this, retries double-grant entitlements and corrupt revenue
  reporting.
- Return 2xx quickly. Errors return 5xx so the provider retries; never return 200 on failure.
- Store the full payload for replay and debugging.
- Webhook routes take no session and must be excluded from auth middleware.

---

## 7. Entitlement flow

One function. It is imported everywhere access is decided and duplicated nowhere.

```ts
// lib/entitlements/index.ts
export async function canUserAccessProduct(
  userId: string | null,
  productId: string,
): Promise<AccessResult>;

export type AccessResult =
  | { allowed: true;  reason: 'free' | 'purchase' | 'bundle' | 'membership' | 'manual' }
  | { allowed: false; reason: 'anonymous' | 'not_owned' | 'expired' | 'revoked' };
```

Resolution order:

1. Product is free → allow.
2. Non-revoked, unexpired row in `entitlements` for this user and product → allow.
3. Active subscription whose plan includes this product → allow.
4. Otherwise deny.

**Purchases and bundle grants are materialized** into `entitlements` rows at webhook time —
they are permanent facts. **Membership access is computed at read time**, not materialized,
so that editing a plan's product list takes effect immediately for every member and never
requires a backfill. This split is deliberate; see `DATABASE.md` §6.

`AccessResult` carries a reason so the UI can say "included with your membership" rather than
just showing or hiding a button.

---

## 8. Storage and protected downloads

Supabase Storage, two buckets:

- `public-assets` — product artwork, previews, OG images. Public read.
- `protected-assets` — deliverable files. **Private.** No public policy at all.

```
GET /api/download/[assetId]
  1. requireUser()
  2. look up asset → product
  3. canUserAccessProduct(user.id, productId)   → 403 if denied
  4. admin client creates signed URL, TTL 60s
  5. insert download_events row
  6. 302 redirect to the signed URL
```

Signed URLs are short-lived and never stored, logged in analytics, or emailed.

---

## 9. AI architecture

```
Client ──► POST /api/tools/[slug]  (or Server Action)
             1. requireUser()
             2. zod-validate input
             3. canUserAccessProduct(user, toolProductId)
             4. rate limit + plan quota check
             5. AIService.generate({...})
             6. log tool_usage: tokens, model, cost, latency, status
             7. return result
```

```ts
// lib/ai/types.ts
export interface AIProvider {
  readonly name: 'openai' | 'anthropic' | 'gemini';
  generate(req: AIRequest): Promise<AIResponse>;
}

export type AIRequest = {
  system: string;                 // server-side only, never sent to the browser
  messages: AIMessage[];
  model: string;
  maxTokens: number;
  temperature?: number;
};

export type AIResponse = {
  text: string;
  usage: { inputTokens: number; outputTokens: number };
  model: string;
  costMicroUsd: number;
};
```

Rules:

- Prompts live in `lib/ai/prompts/` on the server. A prompt in client JavaScript is a leak of
  the actual product.
- Tools reference a capability (`'fast-draft'`, `'long-reasoning'`), not a provider. Provider
  and model are resolved from config so swapping is a config change.
- Every call writes a `tool_usage` row, including failures. Cost visibility from day one.
- Quotas are enforced **before** the provider call, not after.
- No unlimited generation on any plan, ever.

**Rate limiting:** V1 uses a Postgres counter over a time window — no Redis. If load makes
that insufficient, revisit and document the change here.

---

## 10. Email and analytics

**Resend.** Transactional only in V1: welcome, purchase confirmation with library link,
password reset (Supabase-driven), subscription lifecycle notices. Sends are fire-and-forget
relative to the webhook — an email failure must never fail entitlement creation.

**PostHog.** Server-side capture for anything that affects revenue (`purchase_completed`,
`membership_started`) so ad-blockers cannot skew business data; client-side for engagement
(`product_viewed`, `tool_opened`). Event names are a typed union in `lib/analytics/events.ts`
so they cannot drift.

**Sentry.** Added in Phase 10, before launch.

---

## 11. Environments

| Environment | Branch | Supabase project | Payments |
| --- | --- | --- | --- |
| Local | any | dev project | provider test mode |
| Preview | PR branches | dev project | provider test mode |
| Production | `main` | prod project | live mode |

Two separate Supabase projects. Preview deployments must never point at production data.
Migrations run against dev first, then production after review.

---

## 12. Environment variables

`NEXT_PUBLIC_*` is compiled into the JavaScript bundle and visible to anyone. Everything else
stays server-side.

| Variable | Public? | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes — safe | Canonical URLs, OG tags, checkout redirects |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes — safe | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes — safe by design, RLS-constrained | Browser Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | **NO — full DB access, bypasses RLS** | Webhooks, grants, signed URLs |
| `PAYMENTS_API_KEY` | **NO** | Creating checkouts |
| `PAYMENTS_WEBHOOK_SECRET` | **NO** | Verifying webhook signatures |
| `PAYMENTS_STORE_ID` | **NO** (not secret, but no reason to expose) | Provider store identifier |
| `OPENAI_API_KEY` | **NO — billable** | AI provider |
| `ANTHROPIC_API_KEY` | **NO — billable** | AI provider |
| `GOOGLE_AI_API_KEY` | **NO — billable** | AI provider |
| `RESEND_API_KEY` | **NO — can send mail as your domain** | Transactional email |
| `NEXT_PUBLIC_POSTHOG_KEY` | Yes — safe, write-only ingest | Analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | Yes — safe | Analytics |
| `SENTRY_DSN` | Yes — safe | Error monitoring |
| `ADMIN_EMAIL` | **NO** | Bootstrapping the first admin |
| `PRODUCTS_SOURCE` | Not secret | **Temporary.** `database` reads the catalog from Postgres; unset uses the seed module. Deleted once the switch is verified. |

Env vars are parsed and validated once at startup through a zod schema in `lib/config/env.ts`.
A missing or malformed variable fails the build loudly rather than producing a confusing
runtime error. Every new variable must be added to `.env.example` in the same commit.

---

## 13. Security boundaries

| Boundary | Enforcement |
| --- | --- |
| Browser ↔ server secrets | `import 'server-only'` on every secret-touching module |
| Anonymous ↔ user data | RLS on every exposed table, no exceptions |
| User ↔ admin | `profiles.role` in the database, never `user_metadata` |
| Unpaid ↔ paid content | `canUserAccessProduct` server-side, plus RLS |
| Public ↔ protected files | Private bucket, signed URLs after entitlement check |
| Untrusted ↔ trusted input | zod validation on every action and route handler |
| Forged ↔ genuine webhooks | Timing-safe signature verification + event dedupe |
| Free ↔ metered AI | Quota check before the provider call, usage logged after |

---

## 14. Decisions deliberately deferred

Not built in V1, and each would need a written justification here first: Redis, a job queue,
GraphQL, an ORM, Algolia/Typesense (Postgres full-text search covers V1), a CDN beyond
Vercel's, multi-currency, a custom tax engine, server-side cart (checkout is single-offer;
if multi-item carts become necessary, that is a documented change).
