# SODALES Master Plan

## 1. Business goal

SODALES sells digital products that produce a result for the buyer — AI tools, automations,
n8n workflows, prompt systems, templates, resource packs, data products and courses.

It is a **single-owner store**, not a marketplace. There are no vendors, no seller onboarding,
no payout splits, and no seller dashboards. Every design and schema decision assumes one
catalog owner.

The long-term arc:

```
Prompt → Template → Workflow → Automation → Tool → Subscription
```

Each step up that ladder is worth more to the customer and harder to copy. The platform starts
as a storefront selling one-off assets and evolves into a membership library of working tools.
That trajectory is why entitlements, memberships and AI usage accounting exist in the
architecture from the beginning even though V1 barely uses them — retrofitting them later
means rewriting checkout, access control and the dashboard at once.

**The commercial objective for V1 is not revenue.** It is proving the loop end to end: a
stranger discovers a product, pays, receives access automatically, and uses it. Everything
else is optimization.

---

## 2. Customer experience

Two audiences, one funnel.

**The buyer** wants a specific outcome and is evaluating whether this product delivers it.
They need the outcome stated in one line, evidence it works (real screenshots, not marketing
abstraction), a clear list of what they receive, and a frictionless purchase.

**The member** has already bought and returns to use what they own. They need their library to
load fast, downloads that work on the first click, and tools that are ready without hunting.

```
Visitor → Product view → Checkout → Purchase → First use → Repeat use → Membership → Renewal
```

The weakest link is **first use**. A customer who buys a workflow and never gets it running
does not renew and does not return. So delivery quality — instructions, requirements,
tutorials, an obvious next step after purchase — matters more than an extra homepage section.

---

## 3. Product types

| Type | What the customer gets |
| --- | --- |
| `download` | A file: a pack, an asset set, a document |
| `template` | A reusable structure — Notion, spreadsheet, doc, design |
| `prompt_system` | A structured set of prompts with instructions |
| `workflow` | An importable n8n or similar workflow |
| `automation` | A multi-part system combining workflows and configuration |
| `database` | A structured dataset |
| `course` | Sequenced tutorial content |
| `tool` | Access to a hosted AI tool inside SODALES |
| `bundle` | A product containing other products |
| `external_access` | Access to something hosted elsewhere |

A bundle is itself a product (see `DATABASE.md` §7.1). Membership is a plan, not a product.

## 4. Fulfillment types

One product can deliver several of these at once — that is normal, not an edge case. A
workflow product typically ships a `file`, an `instructions` page, and a `video`.

| Type | Delivery |
| --- | --- |
| `file` | Private storage, signed URL after entitlement check |
| `external_link` | A URL revealed only to entitled users |
| `protected_page` | Markdown rendered behind an entitlement check |
| `video` | Hosted video behind an entitlement check |
| `license_key` | A key issued to the buyer |
| `tool_access` | Unlocks an AI tool route |
| `subscription_access` | Membership-gated area |
| `instructions` | Setup guidance, requirements, troubleshooting |

---

## 5. Memberships

One plan at launch. Multiple plans and annual billing are structurally supported but not built
in V1 — pricing tiers are much easier to design once real purchase data exists.

A membership grants access to every product in its `plan_products` list, plus an AI usage
quota. Access is evaluated live, so adding a product to the plan reaches every member
immediately.

Cancellation keeps access until the end of the paid period. Access is never cut off mid-cycle
for a customer who has paid for that cycle.

**Membership access is not ownership.** When a subscription lapses, membership-derived access
ends. Anything a member should keep permanently must be granted as a real entitlement at the
moment it is earned. This distinction must be stated plainly on the pricing page — surprising
someone by removing access is how a store earns chargebacks.

---

## 6. User roles

| Role | Capability |
| --- | --- |
| Visitor | Browse published products, view pricing, read resources, create an account |
| Customer | Everything above, plus their library, downloads, entitled tools, account |
| Member | Everything above, plus plan-included products and AI quota |
| Admin | Full catalog, order, subscription and entitlement management |

"Member" is not a database role — it is a customer with an active subscription. The only
values in `profiles.role` are `customer` and `admin`. The first admin is assigned manually via
SQL; there is no self-service path to it.

---

## 7. Storefront

**Homepage** — the strongest expression of the brand. Ordered by what a first-time visitor
needs: hero with a real product showcase → categories → featured products → featured AI tools
→ popular workflows → bundle spotlight → membership proposition → how it works → testimonials
→ latest resources → email capture → FAQ → footer.

Not every section ships in Phase 2, and the page must not become a long scroll without
hierarchy. If a section does not help someone decide, it does not belong.

**Catalog** — search, category filter, product-type filter, free/paid filter, sort, responsive
grid. Filters must be URL state so a filtered view can be shared and indexed.

**Product page** — hero → outcome statement → preview media → purchase CTA → membership
inclusion → problem → solution → what's included → screenshots → requirements → how it works →
tutorials → updates → license → FAQ → related products.

The purchase CTA must remain reachable while scrolling on mobile. Requirements must appear
before purchase, not after — a customer who buys a workflow needing infrastructure they lack
is a refund.

---

## 8. Member dashboard

The dashboard should read as a **premium software library**, not an order-history table. Same
tokens, type scale and card language as the storefront.

| Area | Contents |
| --- | --- |
| Overview | Membership status, recent products, quick-launch tools, updates |
| My Library | Owned products, type filters, search, recently accessed |
| AI Tools | Available tools, usage state, plan limits |
| Membership | Current plan, upgrade options, billing portal link |
| Downloads | Recent resources, download history |
| Account | Profile, settings |

Every list needs a designed empty state. A new customer sees the empty dashboard before they
ever see a full one — a bare "no results" is a bad first impression at exactly the wrong moment.

---

## 9. Admin

Operational, not a CMS: overview, products, categories, assets, orders, customers,
subscriptions, entitlements, tools.

Build only what running the business requires. Two capabilities matter more than they look:
**manual entitlement grant** (for support cases, comps and failed webhooks) and **webhook event
inspection** (for diagnosing a purchase that did not land). Without them, every payment problem
becomes a database query.

---

## 10. AI tools

AI tools are the strategic direction — the part of the catalog that cannot be copied by
reselling a file, and the reason a subscription makes sense.

V1 ships **one** tool. Its purpose is to establish the pattern: protected route, server-side
prompt, entitlement check, validated input, quota enforcement, usage logging, provider
abstraction, graceful failure. Every later tool follows it.

Constraints that hold permanently:

- Prompts never reach the browser. They are the product.
- No plan offers unlimited generation. Every request costs money.
- Quota is checked before the provider call, never after.
- Every call is logged with tokens and cost, including failures.
- Tools address a capability, not a provider — no tool is coupled to OpenAI, Anthropic or
  Gemini.

The specific first tool is undecided and tracked in `PROJECT_STATUS.md`. It does not block
Phases 1–7.

---

## 11. V1 launch scope

- **3 paid products** — a low-ticket entry product, a mid-ticket workflow or system, and a
  premium bundle
- **1 free lead magnet** — for email acquisition
- **1 membership plan** — kept deliberately simple
- **1 embedded AI tool** — demonstrating the direction

---

## 12. V1 non-goals

Not built, and each would need a documented decision to change: multi-vendor marketplace,
native mobile app, blockchain or NFT licensing, custom payment processing, custom tax engine,
microservices, real-time chat, social features, custom video hosting, custom email platform,
unlimited AI generation, a general-purpose CMS, custom analytics infrastructure.

## 13. Deferred until after launch

Valuable, but nothing here should delay V1: reviews, favorites, wishlists, affiliates,
referrals, collections, advanced search, recommendations, annual memberships, AI credit
top-ups, team accounts, commercial license tiers, public API, changelog, product version
history, community, PWA, CRM, support ticketing.

The discipline that matters: **shipping the loop beats broadening the catalog.** A store with
three products that reliably deliver beats one with twenty that half-work.
