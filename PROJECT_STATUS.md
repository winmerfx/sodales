# SODALES — Project Status

Read this first, every session. Update it at the end of every meaningful piece of work.

# Current Phase

**Phase 2 — Public storefront.** Built and verified locally on seed data. Phase 1 is
complete and deployed.

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

**Phase 2 — Public storefront.**

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

# In Progress

Nothing.

# Next Recommended Task

**Phase 3 — Authentication** (`docs/ROADMAP.md`): Supabase Auth, signup/login/reset, session
middleware, `profiles` table with the `role` column protection, and the dashboard shell.

Phase 3 is the first phase that writes a migration, so read `docs/DATABASE.md` §5 first.

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

# Manual Setup Required

**Nothing blocking right now.** Phase 3 needs no new accounts — it uses the existing Supabase
project. Manual steps arrive at its end: enabling the Email provider, setting the auth redirect
URLs, and promoting your own account to admin with one SQL statement.

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

2026-09-04 — Phase 1 deployed. Phase 2 storefront built on seed data; build, typecheck, lint
and runtime filter checks all pass.
