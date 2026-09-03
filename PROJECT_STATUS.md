# SODALES — Project Status

Read this first, every session. Update it at the end of every meaningful piece of work.

# Current Phase

**Phase 3 — Authentication.** Code complete and verified locally. **Blocked on one manual
step: migration `0001_profiles.sql` has not been run against Supabase**, so signup and login
cannot work until it is.

# Completed

**Phase 0 — Planning.** All documentation written: `CLAUDE.md`, `docs/MASTER_PLAN.md`,
`docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`,
`docs/AGENT_RULES.md`, `.env.example`.

**Phase 1 — Foundation.** Deployed to Vercel.

- Next.js 16.3.4, React 19.2.8, TypeScript, Tailwind v4, ESLint. App Router, no `src/`.
- `styles/brand-tokens.css` — the only file permitted to contain a raw hex. Brand constants
  plus semantic tokens for both surfaces, every ratio measured and annotated.
- Surface scoping via `[data-surface]` wired through Tailwind v4 `@theme inline`. Verified in
  the compiled CSS: `.bg-background` emits `var(--background)`, and both
  `[data-surface=light]` and `[data-surface=dark]` blocks are present, so one component is
  contrast-correct on either surface with no props.
- Fluid type scale (`display-xl` → `label`) with per-token line-height, tracking and weight.
- Inter via `next/font/google`, `cv11`/`ss03` enabled, `display: swap`.
- `lib/config/env.ts` — zod validation that fails the build loudly, with a documented
  `SKIP_ENV_VALIDATION=1` escape hatch for secret-less CI builds.
- `lib/config/brand.ts` — brand strings and navigation in one place.
- Three Supabase clients: browser (anon), server (anon + session), admin (service role,
  `import 'server-only'`, heavily commented as the RLS-bypassing boundary).
- Layout primitives: `Container` (narrow/content/wide/full), `Section` (sets `data-surface`),
  `SectionHeader`, `Eyebrow`.
- `Button` — five variants, three sizes, renders a real `<a>` when given `href`.
- `BrandLogo` — **placeholder mark**, both treatments handled by tokens.
- Responsive shell: sticky dark header with desktop nav, full-screen mobile panel (Escape to
  close, scroll lock, focus moved to the close button), dark footer, skip-to-content link.
- Base layer: visible `:focus-visible` ring, `prefers-reduced-motion` block, selection colors,
  media constraints.
- `npm run typecheck` and `npm run lint` scripts added.
- Git repository initialized on `main` and pushed to `github.com/winmerfx/sodales`. 37 files
  on the remote; `.env.local` is not among them.
- Verified with real credentials: `next build` passes with no `SKIP_ENV_VALIDATION`, so env
  validation accepts the live values.
- Client bundle scanned (21 files): `SUPABASE_SERVICE_ROLE_KEY` does not appear in it.

**Phase 2 — Public storefront.** Deployed.

- `lib/products/types.ts` — domain types mirroring `docs/DATABASE.md` §3, in snake_case so
  Supabase rows drop straight in at Phase 4 with no mapping layer.
- `lib/products/seed.ts` — the seven placeholder products with categories, offers, assets and
  bundle membership. Deleted in Phase 4.
- `lib/products/queries.ts` — the data access layer Phase 4 repoints at Supabase. All async,
  returning the shapes the real queries will return, so no page changes.
- `lib/products/filters.ts` — URL filter state with an allowlist parser; unknown values are
  discarded rather than passed through.
- `ProductCard`, `ProductArtwork` (placeholder), `Badge`, `EmptyState`, `ProductFilters`,
  `ProductSearch`.
- Routes: homepage, `/products` with search + filters + sort, `/products/[slug]`, `/pricing`,
  `sitemap.xml`, `robots.txt`.
- Filters are `<Link>` navigations, not client state — every view has a shareable URL and
  works without JavaScript. Only the search box is a Client Component.
- Verified at runtime against a production server: all filter, search, sort and combined-filter
  counts correct; unknown `type` params discarded; empty state renders; canonical and OG tags
  correct on product pages; 7 product pages prerendered.

**Phase 3 — Authentication.**

- `supabase/migrations/0001_profiles.sql` — first migration. Creates `user_role`, `profiles`,
  the signup trigger, `is_admin()`, RLS policies, and both layers of role protection.
  **Not yet applied.**
- `middleware.ts` — session refresh plus coarse redirects for `/dashboard` and `/admin`.
- `lib/auth/` — `getUser`, `getProfile`, `requireUser`, `requireProfile`, `requireAdmin`.
  Uses `getUser()` rather than `getSession()`, which does not verify the cookie.
- `lib/validation/auth.ts` — zod schemas. Password rule is length-only (10+); composition
  rules push people toward weaker, more predictable passwords.
- Routes: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/auth/callback`,
  and a guarded `/admin` placeholder proving the authorization boundary.
- Dashboard shell: overview, library, tools, membership, downloads, account — each with a
  designed empty state naming the phase that fills it.
- Account page edits name and marketing opt-in. Password changes go through an emailed link,
  not an in-session form.
- `AccountLink` is a Client Component on purpose: reading the session in the header would call
  `cookies()` and drop the homepage and every product page out of static rendering.
- Verified at runtime: `/dashboard`, `/dashboard/*`, `/admin` and `/reset-password` all 307 to
  `/login?next=…` when anonymous; public routes 200; `/auth/callback` without a code redirects
  to `/login?error=missing_code`. Homepage and product pages still render statically.

# In Progress

Phase 3 cannot be fully verified until the migration is applied — signup writes to `profiles`
via a trigger that does not exist yet.

# Next Recommended Task

1. **Apply `supabase/migrations/0001_profiles.sql`** and configure auth URLs (see Manual Setup).
2. Verify signup → confirmation email → login → dashboard, and confirm a non-admin visiting
   `/admin` lands on `/dashboard`.
3. Then **Phase 4 — Product database and admin**, which builds directly on this schema.

# Decisions Made

| Decision | Rationale |
| --- | --- |
| Semantic token layer resolves violet per surface | Electric Violet on Obsidian Black measures 2.92:1 and fails WCAG. Brand color unchanged on light; dark surfaces use a lighter step of the identical hue (HSL 249). |
| Graphite Grey is a light-surface color only | 1.58:1 on Obsidian Black. Dark surfaces use a warm neutral at 6.69:1. |
| Tailwind v4 `@theme inline` over a JS config | v4 is CSS-first. `inline` makes utilities emit `var(--token)` so `[data-surface]` re-points them contextually — the whole surface system depends on this. |
| Payment provider isolated behind `PaymentProvider` | Lemon Squeezy's status is uncertain. Swapping providers becomes one adapter file. |
| `webhook_events` table added | Providers retry webhooks. Without an idempotency key, retries double-grant entitlements and double-count revenue. |
| Bundles are products, not a separate table | A bundle needs a slug, page, artwork, offers and SEO — all of which `products` provides. |
| Membership access computed, not materialized | Editing a plan's product list takes effect immediately for every member, with no backfill. |
| Phase 2 builds against typed seed data matching the schema | Avoids building the storefront twice. |
| `CLAUDE.md` added as the entry point | Claude Code auto-loads it; `docs/AGENT_RULES.md` alone would never be read. |
| Mobile nav closes via link handlers, not a pathname effect | React 19's `react-hooks/set-state-in-effect` rule; setState in an effect body causes cascading renders. |
| Explicit `{ children: ReactNode }` in the root layout | The scaffold's generated `LayoutProps<"/">` only exists after a build, so standalone `tsc --noEmit` failed on a clean checkout. |
| Postgres full-text search for V1 | No Algolia or Typesense until search quality demonstrably fails. |
| Two Supabase projects, dev and prod | Preview deployments must never touch production data. |

# Open Decisions

None block Phase 2.

**Blocks Phase 5 (payments):** payment provider — confirm Lemon Squeezy accepts new merchants
in your country, or target Stripe/Paddle instead.

**Blocks Phase 8 (AI tool):** which tool ships first; which provider and model.

**Blocks Phase 10 (launch):** domain; refund policy; commercial-use licensing; support policy.

**Wanted soon, not blocking:** final tagline (placeholder in `lib/config/brand.ts`); logo asset
package; the four brand reference images (`docs/DESIGN_SYSTEM.md` §8 is provisional without
them); launch catalog; membership plan name, price and inclusions.

# Known Issues

- `BrandLogo` is a placeholder mark, not the real identity. API is stable — swap the SVG.
- `docs/DESIGN_SYSTEM.md` §8 is written from the brief alone; reference images not supplied.
- The type scale assumes Inter. Licensing Neue Haas Grotesk later means re-checking it against
  different metrics.
- `SUPPORT_EMAIL` falls back to `support@example.com` until set.
- Not yet verified in a browser at 375 / 768 / 1440, or by tabbing through with a keyboard.
  Runtime checks so far are HTML-level only.
- Product artwork is a placeholder composition, not real screenshots. Real imagery is blocked
  on the launch catalog decision.
- `q=` search is a naive substring match over name, tagline and description. Phase 4 replaces
  it with the `search_vector` GIN index.
- Signup, login, password reset and the role guard are **unverified against a real database** —
  the migration has not been applied. Only the anonymous redirect paths have been tested.
- The `/auth/callback` open-redirect guard was not exercised end to end: the test request was
  rejected at code exchange before reaching the redirect. The check itself is a same-origin
  path test and was reviewed, not proven.

# Manual Setup Required

**Blocking Phase 3 completion — all in the Supabase dashboard:**

1. **Run the migration.** Open **SQL Editor → New query**, paste the entire contents of
   `supabase/migrations/0001_profiles.sql`, and Run. It only creates things; it drops nothing.
2. **Authentication → Providers → Email** — confirm it is enabled. Leave "Confirm email" on.
3. **Authentication → URL Configuration** — set **Site URL** to your Vercel URL, and add both
   `http://localhost:3000/**` and `https://<your-vercel-url>/**` to **Redirect URLs**.
   Confirmation and reset links fail silently without this.
4. **After signing up**, promote yourself in **SQL Editor**:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
   This is the only time a role is set by hand. There is no self-service path to admin.

Done: `.env.local` created and validated; GitHub connected and pushed; Vercel deployed.

**Later phases:** payment provider account (5), AI provider key with a billing limit (8),
PostHog project and Resend domain verification (9), custom domain and production Supabase
project (10).

# Environment Variables Needed

Full table in `docs/ARCHITECTURE.md` §12. Template in `.env.example`.

**Phase 1 (now):** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

**Phase 5:** `PAYMENTS_API_KEY`, `PAYMENTS_WEBHOOK_SECRET`, `PAYMENTS_STORE_ID`

**Phase 8:** one of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`

**Phase 9:** `RESEND_API_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

**Phase 10:** `SENTRY_DSN`

`NEXT_PUBLIC_*` is compiled into the browser bundle and visible to anyone. Everything else must
stay server-side. `SUPABASE_SERVICE_ROLE_KEY` bypasses all database security — treat it like a
password to the entire database.

# Last Updated

2026-09-04 — Phase 3 authentication built. Build, typecheck, lint and anonymous-guard runtime
checks pass. Awaiting migration 0001 to verify against a real database.
