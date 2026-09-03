# SODALES Roadmap

Eleven phases. One at a time, in order, each finished before the next begins. "Finished" means
the definition of done is met and `PROJECT_STATUS.md` is updated.

**Manual setup** sections list what only the owner can do — creating accounts, copying keys,
clicking through third-party dashboards. Everything else is the agent's job.

| Phase | Outcome | Blocked by |
| --- | --- | --- |
| 0 | Planning docs | — |
| 1 | Branded shell on Vercel | Supabase + Vercel accounts |
| 2 | Public storefront on seed data | 1 |
| 3 | Authentication | 1 |
| 4 | Database + admin, real catalog data | 2, 3 |
| 5 | Payments | 4, payment provider account |
| 6 | Entitlements + library | 5 |
| 7 | Memberships | 6 |
| 8 | First AI tool | 6, tool decision, AI key |
| 9 | Analytics + email | 5 |
| 10 | Launch hardening | all |

---

## Phase 0 — Planning ✅ Complete

**Objective.** Establish documentation as the source of truth before any code exists.

**Delivered.** `CLAUDE.md`, `docs/MASTER_PLAN.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`,
`docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`, `docs/AGENT_RULES.md`, `PROJECT_STATUS.md`,
`.env.example`.

**Definition of done.** All docs exist; the palette's dark-surface contrast failure is resolved
at the token layer; the payment provider is isolated behind an interface.

---

## Phase 1 — Foundation and design system

**Objective.** A deployed, branded, empty shell. No product features. This phase exists so that
every later phase inherits a working design system instead of inventing styling page by page.

**Tasks.**

1. `git init`, `.gitignore`, push to GitHub.
2. `create-next-app` — TypeScript, App Router, Tailwind, ESLint, `src/` off.
3. `styles/brand-tokens.css` with every token from `DESIGN_SYSTEM.md` §2, scoped by
   `[data-surface]`. Wire tokens into the Tailwind theme so utilities resolve to them.
4. Inter via `next/font/google`; the type scale from §3.1 as Tailwind utilities.
5. `lib/config/env.ts` — zod-validated environment parsing that fails the build on a missing
   variable.
6. `lib/supabase/` — browser, server and admin client factories. Admin client gets
   `import 'server-only'`.
7. Layout primitives: `Container`, `Section` (sets `data-surface`), `SectionHeader`, `Eyebrow`.
8. `Button` with all five variants, and `BrandLogo` in both treatments.
9. Responsive app shell: header with mobile navigation, footer. Skip-to-content link.
10. Reduced-motion block, focus-visible styles, base resets.
11. `npm run typecheck` and `npm run lint` scripts.
12. Deploy to Vercel.

**Dependencies.** Supabase and Vercel accounts.

**Definition of done.** The shell deploys to a live URL. Header and footer are responsive at
375px, 768px and 1440px. A page with one dark and one light `Section` renders both correctly
with no hard-coded hex anywhere in `components/`. Keyboard tab order is visible throughout.

**Checks.** `npm run build`, `npm run typecheck`, `npm run lint`. Manual pass at all three
widths. Tab through the header with a keyboard.

**Manual setup.**

1. **GitHub** — create a private repository named `sodales`. Do not initialize it with any
   files; the agent will push.
2. **Supabase** — sign in at supabase.com → **New project**. Name it `sodales-dev`, pick the
   region closest to you, and save the database password in a password manager (it is shown
   once). Wait for provisioning, then go to **Project Settings → API** and copy three values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` — safe to expose publicly
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` — safe to expose; it is designed for
     browsers and is constrained by row-level security
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` — **never expose this.** It bypasses
     all security rules. It goes in `.env.local` and Vercel's environment settings only.
3. **Vercel** — sign in, **Add New → Project**, import the `sodales` repository, accept the
   Next.js defaults. Before the first deploy, open **Settings → Environment Variables** and add
   the three Supabase values above.
4. Paste the same three values into a local file named `.env.local` (copy `.env.example` as a
   starting point). This file is git-ignored and must never be committed.

---

## Phase 2 — Public storefront

**Objective.** The complete public browsing experience, running on seed data.

Seed data is typed to match `DATABASE.md` exactly — the same field names, types and enum
values. Phase 4 then swaps the data source without touching components. Building the storefront
against a shape you invent now and a schema you design later means building it twice.

**Tasks.**

1. `lib/products/types.ts` — TypeScript types mirroring `DATABASE.md` §3.
2. `lib/products/seed.ts` — the seven placeholder products, satisfying those types.
3. `ProductCard` per `DESIGN_SYSTEM.md` §5.2.
4. Homepage: hero, categories, featured products, featured tools, bundle spotlight, membership
   proposition, how-it-works, FAQ, footer. Alternating dark/light rhythm.
5. `/products` — grid with category, type and free/paid filters plus sort, all as URL search
   params.
6. `/products/[slug]` — full product page per `MASTER_PLAN.md` §7.
7. `/pricing` — membership proposition.
8. Per-page metadata, Open Graph tags, canonical URLs, `sitemap.xml`, `robots.txt`.
9. Loading and empty states for every list.

**Dependencies.** Phase 1.

**Definition of done.** Every public route renders from seed data. Filters survive a page
refresh and are shareable as URLs. Product pages produce correct OG tags. Mobile product page
keeps the purchase CTA reachable. No layout shift on image load.

**Checks.** Build, typecheck, lint. Lighthouse on homepage and one product page: performance
and accessibility ≥ 90. Manual pass at 375/768/1440.

**Manual setup.** None.

---

## Phase 3 — Authentication

**Objective.** Accounts and protected routes.

**Tasks.**

1. Supabase Auth with `@supabase/ssr`, cookie-based sessions.
2. `/signup`, `/login`, `/forgot-password`, reset flow, `/auth/callback`.
3. Middleware refreshing sessions and guarding `/dashboard` and `/admin`.
4. `lib/auth/` — `getUser()`, `requireUser()`, `requireAdmin()`.
5. `profiles` table plus the signup trigger, RLS, and the `role` column protection from
   `DATABASE.md` §5.2.
6. Dashboard shell with its navigation; every section an empty state for now.
7. `/dashboard/account` — profile editing.

**Dependencies.** Phase 1.

**Definition of done.** A user can sign up, receive the confirmation email, log in, reset a
password and log out. `/dashboard` and `/admin` redirect anonymous users. `/admin` returns 403
for a non-admin **even when the URL is entered directly**. A user cannot change their own
`role` through the API — verify this explicitly.

**Checks.** Build, typecheck, lint. Manual attempt to escalate to admin via a direct Supabase
client call — must fail.

**Manual setup.**

1. **Supabase → Authentication → Providers** — confirm **Email** is enabled.
2. **Authentication → URL Configuration** — set **Site URL** to your Vercel URL, and add
   `http://localhost:3000/**` plus `https://<your-vercel-url>/**` to **Redirect URLs**. Without
   this, confirmation links fail.
3. Decide whether to require email confirmation (**Authentication → Providers → Email →
   Confirm email**). Recommended on.
4. After creating your own account, promote it in **SQL Editor**:
   ```sql
   update public.profiles set role = 'admin' where email = 'your@email.com';
   ```
   This is the only time an admin role is set by hand.

---

## Phase 4 — Product database and admin

**Objective.** Move the storefront from seed data to the database.

**Tasks.**

1. Migrations for `categories`, `products`, `product_offers`, `product_assets`, `bundle_items`
   — with enums, constraints, indexes and `search_vector`.
2. RLS policies per `DATABASE.md` §5.
3. Generate `lib/supabase/types.ts`.
4. `lib/products/` queries replacing the seed module. Component props do not change.
5. Postgres full-text search on the catalog.
6. Admin CRUD for products, categories, offers and assets, with zod validation.
7. Draft / published / archived states; drafts invisible publicly.
8. Storage buckets `public-assets` and `protected-assets`, plus admin upload.
9. Seed the real launch catalog.

**Dependencies.** Phases 2 and 3.

**Definition of done.** The storefront reads entirely from Postgres. Draft products are
invisible to anonymous and non-admin users — verified by querying as an anonymous client, not
by checking the UI. Admin can create a product with offers and assets end to end. Search
returns sensible results.

**Checks.** Build, typecheck, lint. RLS verification as anonymous and as a second user.
Migrations replay cleanly on a fresh database.

**Manual setup.** **Supabase → Storage** — create buckets `public-assets` (public) and
`protected-assets` (**private — leave "Public bucket" off**). The private setting is what makes
paid files paid.

---

## Phase 5 — Payments

**Objective.** Real purchases producing verified orders.

> **Before starting:** confirm the payment provider. The brief specifies Lemon Squeezy, which
> was acquired by Stripe and whose merchant onboarding has been in flux. Check whether it
> accepts new merchants in your country. If not, the adapter targets Stripe or Paddle instead —
> a change confined to `lib/payments/`.

**Tasks.**

1. `lib/payments/types.ts` — the `PaymentProvider` interface and normalized events from
   `ARCHITECTURE.md` §6.2.
2. The provider adapter, implementing that interface.
3. `orders`, `order_items`, `webhook_events` migrations.
4. Checkout Server Action from the product page.
5. `POST /api/webhooks/payments` — raw body read, timing-safe signature verification,
   idempotent insert into `webhook_events`, order sync.
6. `/checkout/success` — informational only, grants nothing.
7. Admin order list with webhook event inspection.
8. Test purchases in the provider's test mode, including a deliberate webhook replay.

**Dependencies.** Phase 4, payment provider account.

**Definition of done.** A test purchase creates exactly one order. **Replaying the same webhook
creates no duplicate** — verify by re-sending from the provider dashboard. An invalid signature
returns 401. Navigating directly to `/checkout/success` grants nothing. No provider SDK import
exists outside `lib/payments/`.

**Checks.** Build, typecheck, lint. Webhook signature test with a forged payload. Replay test.

**Manual setup.**

1. Create the provider account and a store; complete tax and payout details.
2. Create a product and variant matching a SODALES `product_offer`. Copy the **variant ID** into
   the offer's `provider_variant_id` via admin.
3. **API key** — create one, copy to `PAYMENTS_API_KEY`. **Secret.**
4. **Webhooks** — add an endpoint at `https://<your-domain>/api/webhooks/payments`. Subscribe to
   order and subscription events. Copy the **signing secret** to `PAYMENTS_WEBHOOK_SECRET`.
   **Secret** — it is what proves a request genuinely came from the provider.
5. Add both to Vercel environment variables and `.env.local`.
6. Use test mode until Phase 10.

---

## Phase 6 — Entitlements and library

**Objective.** Customers actually receive what they paid for.

**Tasks.**

1. `entitlements` migration plus the `can_access_product` SQL function.
2. `lib/entitlements/canUserAccessProduct()` returning `AccessResult` with a reason.
3. Grant entitlements from the order webhook, expanding bundles into per-child grants.
4. Revoke on refund — set `revoked_at`, never delete.
5. `/dashboard/library` — owned products, type filters, search, recently accessed.
6. `GET /api/download/[assetId]` — entitlement check then a 60-second signed URL.
7. `download_events` logging; `/dashboard/downloads`.
8. Protected page and external-link fulfillment rendering.
9. Guest-order reconciliation: link an order to a matching account by email at signup.
10. pgTAP tests proving RLS denies cross-user reads.

**Dependencies.** Phase 5.

**Definition of done.** A test purchase appears in the library within seconds. A download works
for the owner and returns 403 for a non-owner — verify by requesting another user's asset ID
directly. A signed URL expires. Buying a bundle grants every child product individually. A
refund removes access. The TypeScript and SQL access functions agree, asserted by a test.

**Checks.** Build, typecheck, lint, pgTAP suite. Cross-user access attempt must fail.

**Manual setup.** None.

---

## Phase 7 — Memberships

**Objective.** Recurring revenue.

**Tasks.**

1. `membership_plans`, `plan_products`, `subscriptions` migrations.
2. Subscription lifecycle webhooks: activated, updated, cancelled, resumed, expired,
   payment_failed, payment_recovered.
3. Membership branch in `canUserAccessProduct` (computed, per `DATABASE.md` §6).
4. `/pricing` reading real plans; membership inclusion badges on product cards.
5. `/dashboard/membership` — status, renewal date, billing portal link.
6. Cancellation retains access until `current_period_end`.

**Dependencies.** Phase 6.

**Definition of done.** Subscribing unlocks every plan product immediately. Cancelling retains
access until period end, then removes it. Adding a product to `plan_products` reaches existing
members with no backfill. Payment failure is handled without instantly revoking access.

**Checks.** Build, typecheck, lint. Full lifecycle exercised in test mode.

**Manual setup.** Create the subscription variant in the provider, copy its ID into the plan.
Enable the customer billing portal.

---

## Phase 8 — First AI tool

**Objective.** Establish the pattern every future tool follows. **One tool only.**

**Tasks.**

1. `lib/ai/` — `AIProvider` interface, one adapter, `AIService.generate()`.
2. Prompts in `lib/ai/prompts/`, server-side only.
3. `tool_usage` migration.
4. `POST /api/tools/[slug]` — auth, zod validation, entitlement check, quota check, generate,
   log.
5. Postgres-backed rate limiting and monthly plan quota.
6. Tool UI at `/dashboard/tools/[slug]` with streaming if useful, and real error states for
   quota exceeded, rate limited and provider failure.
7. Admin usage and cost view.

**Dependencies.** Phase 6, the tool decision, an AI provider key.

**Definition of done.** An entitled user generates a result. A non-entitled user gets 403.
Exceeding quota is blocked **before** the provider call. Every call — successes and failures —
writes a `tool_usage` row with token counts and cost. No prompt text appears in the client
bundle: verify with a production build search.

**Checks.** Build, typecheck, lint. Grep the built client bundle for prompt strings — must
return nothing.

**Manual setup.** Create an API key at the chosen provider, set a **billing limit** on that
account, and add the key to Vercel and `.env.local`. **Secret and billable.**

---

## Phase 9 — Analytics and email

**Objective.** Know what is happening and confirm it to customers.

**Tasks.** PostHog (server-side for revenue events, client-side for engagement); the typed
event union; Resend with domain verification; welcome, purchase-confirmation and subscription
lifecycle emails; email failures isolated from webhook success; the lead-magnet capture flow
and `email_subscribers`.

**Dependencies.** Phase 5.

**Definition of done.** The funnel from `product_viewed` to `purchase_completed` is visible in
PostHog. A purchase sends a confirmation with a working library link. A failing email never
blocks entitlement creation.

**Manual setup.** PostHog project → copy the project API key (safe to expose). Resend account →
**add and verify your sending domain** by creating the DNS records Resend lists at your domain
registrar; verification takes minutes to a few hours. Without it, email lands in spam. Copy the
API key — **secret**.

---

## Phase 10 — Launch hardening

**Objective.** Safe to take real money.

**Tasks.** Full RLS review table by table; pgTAP coverage; payment and webhook replay tests;
mobile pass on real devices; accessibility audit (keyboard, screen reader, contrast against
`DESIGN_SYSTEM.md` §2); SEO and structured data; Sentry; legal pages — privacy, terms, refund
policy; production Supabase project; live payment mode; backup verification; a load sanity
check.

**Definition of done.** No table lacks a deliberate policy. No secret in the client bundle. A
real purchase in live mode delivers access. Backups confirmed restorable. Legal pages published.

**Manual setup.** Create the `sodales-prod` Supabase project and run migrations against it.
Switch the provider to live mode and repoint the webhook at the production domain. Connect the
custom domain in Vercel. Write the refund policy — the payment provider requires one and
customers will read it.

---

## After launch

Nothing here delays V1: reviews, favorites, affiliates, referrals, collections, advanced
search, recommendations, annual plans, AI credit top-ups, team accounts, license tiers, public
API, changelog, version history, community, PWA, CRM, support ticketing.
