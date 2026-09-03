# Agent Rules

Rules for any AI agent working in this repository. [`CLAUDE.md`](../CLAUDE.md) is the short
version loaded automatically; this is the full reasoning.

The owner is not an experienced developer and cannot be expected to catch a subtle security or
design regression in review. That single fact is why these rules are stricter than usual: the
codebase has to protect itself.

---

## 1. Before you touch anything

1. Read [`PROJECT_STATUS.md`](../PROJECT_STATUS.md) — current phase, next task, open decisions,
   known issues.
2. Read the doc covering your area (`ARCHITECTURE`, `DATABASE`, `DESIGN_SYSTEM`, `MASTER_PLAN`).
3. Inspect the code you are about to change, and the code around it. Never assume a file's
   contents from its name.
4. Confirm the task belongs to the current phase. If it belongs to a later one, say so and ask
   before proceeding.

## 2. Scope

**One logical feature at a time.** Not one feature plus a refactor plus a dependency bump.
Mixed changes are unreviewable, and this owner cannot untangle them.

If you notice an unrelated problem, note it in **Known Issues** in `PROJECT_STATUS.md` and keep
going. Do not fix it in passing.

Do not build ahead of the roadmap. Do not add abstraction for a second use case that does not
exist yet.

## 3. Documentation is the source of truth

When a request conflicts with a documented decision:

1. Name the conflict explicitly.
2. Explain what the doc says and why.
3. Recommend whether the decision should change.
4. If the owner confirms a change, **update the doc in the same commit as the code.**

Silently implementing something that contradicts the docs is the worst outcome — it leaves the
documentation lying, and every future agent inherits the lie.

## 4. Security

Non-negotiable. Violating any of these is a defect regardless of what was asked.

1. `SUPABASE_SERVICE_ROLE_KEY` never reaches the browser. Every module touching it starts with
   `import 'server-only'`.
2. No secret in any `NEXT_PUBLIC_*` variable. That prefix means "compiled into the JavaScript
   bundle and visible to everyone".
3. Product access is granted **only** from a signature-verified webhook. Never from a redirect,
   a query parameter, or client state.
4. Entitlements are checked server-side via `canUserAccessProduct()`. Hiding a button is not
   access control.
5. Protected files are served through short-lived signed URLs after an entitlement check —
   never from a public bucket or a permanent URL.
6. Authorization reads `profiles.role`. Never `user_metadata` or `raw_user_meta_data` — the
   user can edit those.
7. Every route handler and Server Action validates its input with zod. Client validation is UX,
   not security.
8. Webhook signatures are verified over the **raw** body with a timing-safe comparison.
9. AI prompts stay server-side. They are the product.
10. Expensive endpoints are rate-limited.
11. RLS is enabled on every exposed table with deliberate policies. Never disable RLS to make
    something work — that means the policy is wrong.
12. Never commit `.env.local` or a real key. If a secret is ever committed, say so immediately
    and loudly; it must be rotated, not just deleted.

## 5. Database

1. All schema changes are migrations in `supabase/migrations/`. Nothing by hand in the
   dashboard.
2. **Flag destructive operations before running them.** `drop`, `truncate`, `alter ... drop
   column`, anything discarding data. State exactly what is lost and wait for approval. Never
   bundle one quietly into a larger migration.
3. Prefer additive changes: add nullable, backfill, then constrain.
4. Regenerate `lib/supabase/types.ts` after every migration.
5. Test against the dev project first. Production only after review.
6. New table means new RLS policies in the same migration. A table without policies is either
   fully open or fully closed, and both are bugs waiting to happen.

## 6. Design system

1. Never hard-code a hex, font size, radius or spacing value in a component. Use tokens.
2. Adding a color requires measuring its contrast against its surface and recording it in
   `DESIGN_SYSTEM.md` §2.
3. Electric Violet `#5E4FB3` fails contrast as text on Obsidian Black (2.92:1). Graphite Grey
   is unreadable on dark (1.58:1). Use the semantic tokens, which handle this. This is the most
   likely visual regression in the project.
4. Reuse existing components. Two similar-looking things is not yet a pattern — build the
   abstraction on the second real use, not the first.
5. Never degrade responsive behavior to match a desktop mockup. Check 375px, 768px, 1440px.
6. Never remove focus outlines without an equivalent replacement.
7. Respect `prefers-reduced-motion`.
8. Keep violet restrained — roughly three uses per screen.

## 7. Code quality

1. Server Components by default. `'use client'` only where interaction genuinely requires it,
   and as far down the tree as possible.
2. No `any`, `@ts-ignore` or `eslint-disable` without a written justification in the same
   commit. These hide the exact bugs this owner cannot catch.
3. No new dependency without justification. Check whether the platform, Tailwind, shadcn or an
   existing dependency already solves it. More dependencies means more supply-chain surface and
   more upgrade work.
4. Provider SDKs import only inside their own `lib/` folder.
5. Handle errors visibly. No empty `catch`. A caught error either recovers meaningfully or
   surfaces.
6. Every list state needs loading, empty and error handling.

## 8. Before reporting work complete

- [ ] `npm run build` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] Relevant tests pass
- [ ] No secrets committed; new env vars in `.env.example` and documented in `ARCHITECTURE.md` §12
- [ ] No authorization bypass introduced
- [ ] Responsive at 375 / 768 / 1440
- [ ] Keyboard accessible, focus visible
- [ ] Design tokens used, no hard-coded values
- [ ] `PROJECT_STATUS.md` updated
- [ ] Docs updated if architecture or design changed

**Report honestly.** If tests fail, say so and include the output. If something was skipped,
say what and why. If part of the task is blocked, finish everything else and state plainly what
is left. Never report "done" for partial work — this owner is trusting the report over their
own review.

## 9. Communicating with the owner

When manual work is needed in Supabase, Vercel, the payment provider, GitHub, DNS, n8n or
Resend:

- Name the service and the exact screen: "Supabase → Project Settings → API".
- Say what to click, what value to copy, and where to paste it.
- Say why it is needed.
- **Always say whether a value is safe to expose publicly.** This is the mistake most likely to
  cost real money.
- Do not assume any setting's location is known.

Conversely: when no manual action is needed, do not pad the response with setup explanation.

Explain architectural decisions in plain language, including the trade-off. "I used X because Y,
at the cost of Z" is useful; "I used X (best practice)" is not.
