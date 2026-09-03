# SODALES — Agent Entry Point

Premium digital-products storefront and membership platform. Single-owner store, **not** a
multi-vendor marketplace. Sells AI tools, automations, n8n workflows, prompt systems,
templates, resource packs, data products, courses, bundles and memberships.

The owner is not an experienced developer. When a task needs manual work in Supabase,
Vercel, the payment provider, GitHub, DNS, n8n or Resend, give exact click-by-click
instructions and say whether each value is safe to expose publicly.

---

## Read before you edit

| Doc | When you need it |
| --- | --- |
| [docs/AGENT_RULES.md](docs/AGENT_RULES.md) | **Always.** Full working rules. |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | **Always.** Current phase, next task, open decisions. |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Touching services, auth, payments, AI, storage. |
| [docs/DATABASE.md](docs/DATABASE.md) | Any schema, migration or RLS work. |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Any UI, color, type or spacing work. |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Deciding what to build next. |
| [docs/MASTER_PLAN.md](docs/MASTER_PLAN.md) | Product scope and business rules. |

Docs are the source of truth. If a request conflicts with them, say so, recommend whether
the decision should change, and update the doc if direction intentionally changes.

---

## Hard rules

1. **Never** put the Supabase service-role key, payment secrets, AI keys or Resend keys in
   any file under `app/` that can reach the browser. Server-only modules must start with
   `import 'server-only'`.
2. **Never** grant product access from a checkout-success redirect. Access comes only from a
   signature-verified webhook. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
3. **Never** check entitlements in the browser. Use `canUserAccessProduct()` from
   `lib/entitlements/` on the server.
4. **Never** serve a protected file from a public URL. Verify entitlement, then issue a
   short-lived signed URL.
5. **Never** hard-code a hex color, font size, radius or spacing value in a component. Use
   the semantic tokens. Adding a raw color requires a documented reason in
   [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
6. **Never** import a payment or AI provider SDK outside `lib/payments/` or `lib/ai/`.
7. **Never** run a destructive migration without flagging it and getting explicit approval.
8. **Never** commit `.env.local` or any real secret. New env vars go in `.env.example`.
9. **Never** silence errors with `any`, `@ts-ignore` or `eslint-disable` without a written
   justification in the same commit.
10. **Never** put an AI prompt in client-side JavaScript.

## Brand quick reference

Full system in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md). Do not deviate.

```
Electric Violet  #5E4FB3   accent, used sparingly
Soft Ivory       #F4F2ED   light foundation
Graphite Grey    #35373B   secondary neutral (light surfaces only)
Obsidian Black   #111111   dark foundation
```

Electric Violet **fails contrast as text on Obsidian Black (2.9:1)**. On dark surfaces use
the `--primary` / `--accent-foreground` tokens, never the raw brand hex. Graphite Grey is
unreadable on dark (1.6:1) — it is a light-surface color only.

Typeface: Inter. Icons: Lucide, no other icon pack.

## Commands

Nothing is scaffolded yet — see [PROJECT_STATUS.md](PROJECT_STATUS.md). Once Phase 1 lands:

```bash
npm run dev          # local dev server
npm run build        # production build — must pass before any work is "done"
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run test         # unit tests
```

Before reporting work complete: build passes, typecheck passes, lint passes, relevant tests
pass, no secrets committed, responsive behavior considered, tokens used, new env vars
documented, `PROJECT_STATUS.md` updated.

## Working style

One logical feature at a time. Inspect existing code before modifying it. Reuse existing
components rather than inventing parallel ones. Prefer Server Components; add `'use client'`
only where interaction genuinely requires it. Avoid new dependencies — justify any addition.
