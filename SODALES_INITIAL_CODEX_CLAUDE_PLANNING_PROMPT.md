# SODALES Digital Products Platform — Initial Codex / Claude Code Planning Prompt

You are the senior product architect and lead full-stack engineer for a new commercial digital-products platform called **SODALES**.

I am the owner of the project. I have very limited traditional web-development knowledge, but I have some experience with GitHub, Vercel and Supabase. I primarily build through vibe coding using Codex or Claude Code inside the Antigravity IDE.

Your job is therefore not only to write code. You must keep the codebase understandable, maintainable, secure, visually consistent, and safe for future AI coding agents.

---

# DATE CONTEXT

September 2026.

---

# PROJECT GOAL

Build a premium ecommerce and membership platform for selling and providing access to digital products including:

- AI tools
- automation systems
- n8n workflows
- prompt systems
- templates
- resource packs
- databases / data products
- tutorials / courses
- bundles
- memberships
- external tools / resources

This is initially a **single-owner store**.

This is **NOT a multi-vendor marketplace**.

Long-term product strategy:

**Prompt → Template → Workflow → Automation → Tool → Subscription**

The platform should gradually evolve from a digital-product storefront into a membership-based library of AI tools, workflows, templates, software utilities and business systems.

---

# BRAND

## Brand Name

**SODALES**

SODALES should feel like a modern creative-intelligence and technology brand.

The brand should communicate:

- intelligence
- premium design
- creativity
- technology
- precision
- clarity
- confidence
- restrained futurism
- software credibility

Avoid cliché "AI startup" styling.

Do NOT rely on:

- excessive neon gradients
- glowing robot heads
- glowing brains
- crypto-style interfaces
- cyberpunk clutter
- random holograms
- over-designed dashboards
- generic startup illustrations
- unnecessary glassmorphism everywhere

The design should feel intentional, premium, editorial and software-oriented.

---

# BRAND REFERENCE FILES

The supplied visual references include:

- `Screenshot_2026-09-02_at_2.56.37_AM.png`
- `image(20260902-103047).png`
- `IMG_7040.png`
- `IMG_7041.jpeg`

Treat these as the visual direction for SODALES.

They establish:

- logo treatment
- spacing
- typography hierarchy
- dark and light compositions
- image framing
- violet accent usage
- page rhythm
- restrained futuristic styling
- premium SaaS / creative studio presentation

Do not simply copy the exact layouts shown in the references.

Translate their visual language into an ecommerce and software-product experience.

---

# COLOR SYSTEM

The official core palette is:

## Electric Violet

`#5E4FB3`

Primary SODALES accent.

Use for:

- primary actions
- active states
- links
- selected navigation states
- highlighted words
- UI emphasis
- product tags
- selected tabs
- important icons
- premium gradient accents

Electric Violet should be used selectively.

Do not flood every component with violet.

---

## Soft Ivory

`#F4F2ED`

Primary light background.

Use for:

- light-mode page surfaces
- premium editorial sections
- cards where appropriate
- product detail backgrounds
- readable large-format content

Avoid pure white unless there is a specific accessibility or UI reason.

---

## Graphite Grey

`#35373B`

Secondary neutral.

Use for:

- secondary text
- borders
- subdued panels
- inactive controls
- UI metadata
- neutral icons

---

## Obsidian Black

`#111111`

Primary dark foundation.

Use for:

- dark backgrounds
- hero sections
- footer
- premium product-feature sections
- strong text
- dark cards
- high-contrast navigation

Avoid absolute `#000000` as the default brand black unless technically necessary.

---

# SEMANTIC DESIGN TOKENS

Create reusable semantic tokens instead of scattering raw colors through components.

The design system should eventually expose concepts similar to:

```css
--background
--foreground
--surface
--surface-elevated
--surface-muted
--border
--border-strong
--primary
--primary-hover
--primary-foreground
--muted
--muted-foreground
--success
--warning
--danger
```

Map these to SODALES colors.

The implementation must support dark and light surfaces while maintaining the same identity.

---

# COLOR USAGE PRINCIPLES

## Dark Composition

Foundation:

- Obsidian Black
- Graphite Grey

Accent:

- Electric Violet

Text:

- Soft Ivory

Use dark compositions for:

- homepage hero
- AI tools
- premium product showcases
- major feature sections
- footer
- selected campaign sections

---

## Light Composition

Foundation:

- Soft Ivory

Text:

- Obsidian Black

Secondary text:

- Graphite Grey

Accent:

- Electric Violet

Use light compositions for:

- product browsing
- documentation-like content
- pricing
- detailed product descriptions
- account interfaces when readability benefits

---

# TYPOGRAPHY

## Primary Typeface

Preferred:

**Inter**

or, if appropriately licensed and available:

**Neue Haas Grotesk**

Do not bundle or distribute unlicensed font files.

If proprietary font assets are unavailable, use Inter as the production-safe default.

---

## Alternative Typeface

Brand references mention:

**Akzidenz-Grotesk**

Use only if licensing and assets are legitimately available.

Otherwise do not imitate it through questionable font downloads.

---

# TYPOGRAPHIC PERSONALITY

Typography is a major part of the SODALES identity.

Use:

- strong oversized display headings
- clean grotesk forms
- large scale contrast
- generous negative space
- tight display heading line-height
- readable body text
- restrained use of all-caps labels
- wide tracking for UI labels and metadata

Suggested desktop hierarchy:

```text
Display XL:
64–88px
700–800 weight
0.9–1.0 line-height

Display:
48–64px
700–800 weight

H1:
40–56px
700 weight

H2:
32–44px
650–700 weight

H3:
24–32px
600–700 weight

Body Large:
18–20px
400–500 weight

Body:
16px
400–500 weight

Small:
14px

UI Label:
11–12px
500–600 weight
uppercase where appropriate
0.08em–0.16em letter spacing
```

Use fluid typography with `clamp()` where useful.

Mobile typography must scale down intentionally instead of simply shrinking the desktop layout.

---

# BRAND TYPOGRAPHY RULES

The references show a clear distinction between:

- oversized editorial display type
- readable neutral body copy
- small wide-tracked UI labels

Preserve this relationship throughout the website.

Do not overuse uppercase text.

Use wide-tracked uppercase labels for:

- category indicators
- metadata
- eyebrow labels
- status labels
- short navigation markers

Do NOT use widely tracked uppercase text for long sentences.

---

# LOGO

Use the supplied SODALES logo identity as the official brand mark.

Support two main treatments:

## Dark Surface

Violet symbol / wordmark or appropriate high-contrast light treatment.

## Light Surface

Violet symbol with dark/graphite wordmark.

Logo usage should feel small, confident and restrained.

Do not make the logo unnecessarily large.

Header branding should resemble a premium creative studio or SaaS product, not a retail banner.

---

# VISUAL LANGUAGE

The visual references establish the following overall look:

**Premium creative technology.**

The website should combine:

- minimal editorial layouts
- large typography
- asymmetric compositions
- generous whitespace
- large visual product showcases
- dark-to-violet atmospheric backgrounds
- rounded product frames
- premium device mockup presentation where relevant
- high-quality screenshots
- subtle dimensionality
- clean grids
- deliberate overlaps
- occasional foreground visual elements crossing section boundaries
- strong hierarchy
- restrained animation

The interface must remain usable.

Visual experimentation must never interfere with:

- navigation
- checkout
- accessibility
- product discovery
- account management

---

# WEBSITE LOOK AND FEEL

The SODALES ecommerce platform should feel like a cross between:

- premium creative technology studio
- high-end SaaS company
- curated digital-product marketplace
- software tools platform

It should NOT feel like:

- Etsy
- a generic Shopify theme
- a cheap Gumroad storefront
- a template marketplace clone
- a crypto landing page
- a generic AI prompt shop

The site should feel proprietary.

---

# HOMEPAGE ART DIRECTION

The homepage should use the strongest expression of the SODALES brand.

Recommended direction:

## Hero

Dark Obsidian Black foundation with subtle violet atmospheric lighting.

Large editorial heading.

Example placeholder:

**Build smarter.  
Create faster.**

or another final brand statement decided later.

Include a strong product/tool showcase instead of generic abstract art.

Possible visual components:

- layered application interfaces
- browser frames
- mobile UI
- tool screenshots
- workflow visualizations
- premium 3D brand object used sparingly

Primary CTA:

**Explore Products**

Secondary CTA:

**View AI Tools**

Membership CTA may appear as a third lower-priority route.

---

# HERO PRINCIPLES

Do not create an oversized hero with meaningless filler.

The hero should immediately communicate that SODALES sells:

- tools
- systems
- workflows
- digital products

The visual should represent real or placeholder SODALES products.

Avoid generic stock photography as the primary homepage hero.

---

# SECTION RHYTHM

Alternate intentionally between:

### Dark immersive sections

and

### Soft Ivory editorial sections

This creates a branded visual rhythm.

Do not make every section a separate rounded card.

Allow large open areas.

Use cards only when the information architecture genuinely benefits from them.

---

# PRODUCT CARD DESIGN

Product cards should feel premium and content-rich.

Possible elements:

- product artwork / screenshot
- category eyebrow
- product name
- concise outcome-oriented description
- price
- membership inclusion badge
- product type
- "New" / "Popular" where meaningful
- hover affordance

Recommended visual treatment:

- subtle borders
- moderate corner radius
- strong imagery
- clean typography
- restrained shadows
- minimal gradients

Do not make every product card a glowing violet rectangle.

---

# PRODUCT ARTWORK

Each digital product should eventually have a strong visual identity.

Product imagery can use:

- device mockups
- workflow screenshots
- interface previews
- template screenshots
- abstract brand compositions
- product diagrams

The design should visually differentiate products while remaining connected to SODALES.

---

# UI SHAPE LANGUAGE

The references use modern rounded geometry.

Use:

- medium-to-large radii for major cards
- pill shapes for selected small controls
- rounded buttons where appropriate
- restrained border treatments

Avoid excessively bubbly UI.

Recommended starting radius system:

```text
sm: 8px
md: 12px
lg: 18px
xl: 24px
pill: 999px
```

Adjust during implementation if visual testing indicates improvements.

---

# BUTTONS

## Primary

Electric Violet background.

High-contrast foreground.

Clean rounded form.

Subtle hover transition.

## Secondary

Neutral / outline treatment.

## Tertiary

Text or icon action.

Do not add dramatic glow effects by default.

---

# ICONOGRAPHY

Use a single consistent icon family.

Recommended:

**Lucide**

Icons should be:

- simple
- geometric
- recognizable
- minimally decorated

Do not mix unrelated icon packs.

---

# MOTION

Motion should feel premium, not theatrical.

Use:

- subtle fade / translate reveals
- restrained hover transitions
- gentle image parallax only where useful
- lightweight section transitions
- subtle violet interaction feedback

Prefer CSS and native browser capabilities.

Do not introduce a large animation library unless a real need appears.

Respect `prefers-reduced-motion`.

---

# RESPONSIVE DESIGN

The website must be intentionally designed for:

- desktop
- laptop
- tablet
- mobile

Do not merely stack desktop components vertically.

Mobile navigation, typography, spacing and visuals should be reconsidered for the smaller viewport.

Product browsing and checkout must be excellent on mobile.

---

# ACCESSIBILITY

Brand aesthetics must not override usability.

Requirements:

- sufficient text contrast
- visible keyboard focus
- semantic HTML
- accessible forms
- meaningful button labels
- alt text for product imagery
- reduced-motion support
- logical heading hierarchy
- touch targets appropriate for mobile

Electric Violet should not be used as small body text where contrast becomes insufficient.

---

# TARGET STACK

- Next.js with App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage initially
- Lemon Squeezy for payments / subscriptions
- Vercel hosting
- n8n for automations
- Resend for transactional email
- PostHog for product analytics
- Sentry before production launch
- OpenAI / Anthropic / Gemini through a provider-independent AI service layer

---

# IMPORTANT ARCHITECTURAL PRINCIPLES

1. Keep the architecture simple.

2. Use one Next.js application initially.

3. Do not introduce microservices, Redis, queues, GraphQL or other infrastructure unless a demonstrated requirement exists.

4. Use React Server Components by default where appropriate and Client Components only where interaction requires them.

5. Do not add an ORM merely for abstraction unless it provides a strong concrete advantage. Supabase/Postgres and generated database types are acceptable.

6. All database changes must eventually be represented using reproducible migrations.

7. All exposed Supabase tables must have deliberate RLS policies and appropriate grants.

8. Supabase service-role credentials must never reach the browser.

9. API keys and provider secrets must remain server-side.

10. Payment access must be granted from verified Lemon Squeezy webhook events, never merely from a checkout-success redirect.

11. Product access should use a centralized entitlement system.

12. Protected files should eventually use short-lived signed URLs after an entitlement check.

13. AI prompts, provider credentials and proprietary AI logic must stay server-side.

14. AI providers must be abstracted so individual tools are not permanently coupled to OpenAI, Anthropic or Gemini.

15. Do not build unlimited AI usage. The architecture must support usage tracking and eventual plan limits.

16. Avoid premature abstractions, but create clear service boundaries for:
   - auth
   - products
   - payments
   - entitlements
   - storage
   - AI
   - email
   - analytics

17. Optimize for clarity and reliability over cleverness.

18. Avoid unnecessary dependencies.

19. Never perform destructive database operations without explicitly flagging them.

20. Never commit secrets.

21. The SODALES design tokens must be centralized and reusable.

22. Do not hard-code brand colors repeatedly inside individual components.

23. Reuse consistent layout, typography, spacing, radius and interaction primitives.

24. Visual polish must never compromise performance or accessibility.

---

# BUSINESS MODEL

The platform will support:

- free products
- one-time products
- bundles
- monthly subscriptions
- annual subscriptions later
- membership-gated products
- AI tool access

The same product may contain multiple resources such as:

- downloadable file
- external link
- protected page
- tutorial
- workflow
- license key
- AI tool
- instructions

---

# CORE PRODUCT TYPES

```text
download
template
prompt_system
workflow
automation
database
course
tool
bundle
membership
external_access
```

---

# CORE FULFILLMENT TYPES

```text
file
external_link
protected_page
video
license_key
tool_access
subscription_access
instructions
```

---

# CORE ENTITLEMENT LOGIC

A user can access a product when at least one of these applies:

- product is free
- user owns the product
- user owns a bundle containing the product
- user has a direct entitlement
- user has an active membership whose plan includes the product

Do not scatter this logic throughout the application.

Eventually centralize it behind something conceptually similar to:

```ts
canUserAccessProduct(userId, productId)
```

---

# EXPECTED PUBLIC ROUTES

```text
/
/products
/products/[slug]
/pricing
/login
/signup
/forgot-password
/resources
```

---

# EXPECTED CUSTOMER ROUTES

```text
/dashboard
/dashboard/library
/dashboard/tools
/dashboard/membership
/dashboard/downloads
/dashboard/account
```

---

# EXPECTED ADMIN ROUTES

```text
/admin
/admin/products
/admin/categories
/admin/orders
/admin/customers
/admin/subscriptions
/admin/entitlements
/admin/tools
```

---

# EXPECTED DATABASE DOMAINS

```text
profiles
categories
products
product_offers
product_assets
bundles
bundle_items
orders
order_items
membership_plans
plan_products
subscriptions
entitlements
download_events
tool_usage
```

Do not blindly create these tables yet.

First validate the schema and relationships.

---

# CUSTOMER EXPERIENCE

## Homepage

Recommended sections:

1. SODALES hero
2. Product categories
3. Featured products
4. Featured AI tools
5. Popular workflows
6. Bundle spotlight
7. Membership proposition
8. How SODALES works
9. Testimonials placeholder
10. Latest resources
11. Email lead magnet
12. FAQ
13. Footer

Do not let the homepage become excessively long without hierarchy.

---

## Product Store

Must support:

- search
- category filters
- product-type filters
- free / paid filtering
- sort
- featured products
- responsive product grid

---

## Product Page

Recommended sections:

1. product hero
2. outcome statement
3. preview media
4. purchase CTA
5. membership inclusion
6. problem
7. solution / outcome
8. what is included
9. screenshots / examples
10. requirements
11. how it works
12. tutorials
13. updates
14. license / usage
15. FAQ
16. related products
17. membership upsell

---

# MEMBER DASHBOARD

The dashboard should feel like a premium software library.

Do not make it look like an admin spreadsheet.

Core areas:

## Overview

- membership status
- recent products
- quick-launch tools
- updates

## My Library

- owned products
- filters by product type
- search
- recently accessed

## AI Tools

- available tools
- usage state
- plan restrictions where relevant

## Membership

- current plan
- upgrade / downgrade options
- billing access

## Downloads

- recent resources
- download history

## Account

- profile
- account settings

The customer library should feel closer to a premium software collection than an order-history page.

---

# CHECKOUT FLOW

```text
Product Page
   ↓
Lemon Squeezy Checkout
   ↓
Successful Payment
   ↓
Lemon Squeezy Webhook
   ↓
Server verifies webhook signature
   ↓
Order synchronized
   ↓
Entitlement created
   ↓
Customer Library updated
   ↓
Confirmation email
```

Never grant access purely because the browser was redirected to a success page.

---

# SUBSCRIPTION FLOW

```text
Customer subscribes
   ↓
Lemon Squeezy
   ↓
subscription_created
   ↓
Local subscription activated
   ↓
Membership access enabled
```

Future webhook events should handle:

```text
subscription_updated
subscription_cancelled
subscription_resumed
subscription_expired
subscription_payment_failed
subscription_payment_recovered
```

Cancellation should generally allow access until the paid billing period ends.

---

# FILE DELIVERY SECURITY

Protected digital files should not use permanent public URLs.

Expected flow:

```text
User requests download
   ↓
Server verifies entitlement
   ↓
Server creates temporary signed URL
   ↓
Browser downloads asset
```

---

# AI TOOL ARCHITECTURE

Do not put AI prompts directly in frontend JavaScript.

Use:

```text
Browser
   ↓
Server endpoint / server action
   ↓
Authentication check
   ↓
Entitlement check
   ↓
Usage / rate-limit check
   ↓
Internal AI service
   ↓
Provider
```

Create an internal abstraction conceptually similar to:

```ts
AIService.generate()
```

Do not permanently couple a tool directly to one provider.

---

# AI USAGE ECONOMICS

Every AI request has cost.

The architecture should eventually support:

- usage tracking
- plan limits
- rate limiting
- model cost tracking
- abuse prevention
- credit systems later

Do not promise unlimited AI generations.

---

# ADMIN

Initial admin sections:

- overview
- products
- categories
- assets
- orders
- customers
- subscriptions
- entitlements
- tools

Do not build an enormous CMS.

Build only what is necessary to operate the business.

---

# SEARCH

Use PostgreSQL search for V1.

Do not add Algolia, Typesense or Elasticsearch immediately.

---

# MARKETING ARCHITECTURE PLACEHOLDERS

Allow future support for:

- discount codes
- affiliate links
- email capture
- lead magnets
- upsells
- cross-sells
- bundles
- membership upsells
- abandoned-checkout automation
- launch campaigns
- referral program

Not all need implementation in V1.

---

# SEO

Every public product should support:

- unique URL
- page title
- description
- Open Graph metadata
- canonical URL
- product structured data where appropriate

Eventually support:

```text
/sitemap.xml
/robots.txt
/resources
```

---

# ANALYTICS EVENTS

Plan for business events such as:

```text
product_viewed
product_previewed
checkout_started
purchase_completed
membership_viewed
membership_started
tool_opened
tool_generation_completed
asset_downloaded
lead_magnet_downloaded
account_created
```

Important funnel:

```text
Visitor
→ Product View
→ Checkout
→ Purchase
→ Product Usage
→ Membership
→ Renewal
```

---

# KEY BUSINESS METRICS

Eventually track:

## Acquisition

- visitors
- email subscribers
- account conversion

## Ecommerce

- product-page conversion
- checkout conversion
- revenue
- average order value
- revenue by product

## Membership

- MRR
- new subscriptions
- upgrades
- downgrades
- churn
- lifetime value

## Product

- downloads
- tool usage
- most-used products
- inactive purchases

## AI

- requests
- cost per user
- cost per tool
- gross margin per plan

---

# SECURITY REQUIREMENTS

Non-negotiable:

- Enable Supabase RLS on exposed tables.
- Define deliberate database grants and policies.
- Never expose Supabase service-role credentials.
- Never expose Lemon Squeezy API secrets.
- Never expose AI API keys.
- Never expose Resend API keys.
- Verify webhook signatures.
- Validate user input server-side.
- Use temporary signed URLs.
- Check entitlements server-side.
- Rate-limit expensive endpoints.
- Keep authorization away from editable user metadata.
- Maintain `.env.example`.
- Never commit `.env.local`.
- Do not execute destructive database migrations without review.

---

# REPOSITORY PHILOSOPHY

Use one Next.js application.

Do not begin with:

- microservices
- Kubernetes
- separate frontend/backend repositories
- event buses
- GraphQL
- Redis
- complex message queues

Add infrastructure only when a real requirement appears.

The codebase should favor:

**simple → modular → replaceable**

rather than:

**enterprise-looking → complicated**

---

# SUGGESTED PROJECT STRUCTURE

```text
/
├── app/
│   ├── (marketing)/
│   ├── products/
│   ├── dashboard/
│   ├── admin/
│   ├── api/
│   └── auth/
│
├── components/
│   ├── ui/
│   ├── marketing/
│   ├── products/
│   ├── dashboard/
│   └── admin/
│
├── lib/
│   ├── auth/
│   ├── supabase/
│   ├── payments/
│   ├── entitlements/
│   ├── storage/
│   ├── ai/
│   ├── email/
│   ├── analytics/
│   └── validation/
│
├── styles/
│   └── brand-tokens.css
│
├── supabase/
│   ├── migrations/
│   └── tests/
│
├── public/
│   └── brand/
│
├── docs/
│
└── tests/
```

Exact structure may evolve after repository inspection.

---

# DESIGN SYSTEM IMPLEMENTATION

When implementation begins, establish the brand before building many pages.

Create centralized definitions for:

- colors
- typography
- spacing
- radius
- container widths
- shadows
- borders
- motion
- breakpoints
- button variants
- card variants
- form controls

Do not let individual pages independently invent styling.

Consider creating components such as:

```text
BrandLogo
Container
Section
SectionHeader
Eyebrow
Button
ProductCard
ToolCard
CategoryChip
MembershipBadge
BrowserFrame
DeviceFrame
Metric
EmptyState
```

Only create abstractions once they are genuinely reused.

---

# DEVELOPMENT RULES FOR VIBE CODING

Because development will primarily use Codex or Claude Code:

1. Read project documentation before making changes.
2. Inspect existing code before modifying.
3. Work on one logical feature at a time.
4. Explain major architectural decisions.
5. Avoid unnecessary dependencies.
6. Reuse existing components.
7. Run lint, type-check and relevant tests.
8. Never silently modify production database structures.
9. Use migrations for database changes.
10. Update documentation when architecture changes.
11. Update project status after meaningful work.
12. Preserve the SODALES brand system.
13. Do not invent new colors or fonts without documenting the reason.
14. Do not degrade responsive behavior to match desktop mockups.
15. Do not use low-quality placeholder styling once the design system exists.

---

# REQUIRED PLANNING FILES

Create:

```text
/docs/MASTER_PLAN.md
/docs/ARCHITECTURE.md
/docs/DATABASE.md
/docs/DESIGN_SYSTEM.md
/docs/ROADMAP.md
/docs/AGENT_RULES.md
/PROJECT_STATUS.md
```

---

# MASTER_PLAN.MD

Document:

- business goal
- customer experience
- product types
- fulfillment types
- memberships
- user roles
- storefront
- dashboard
- admin
- AI tools
- future features
- V1 non-goals

---

# ARCHITECTURE.MD

Document:

- system architecture
- service boundaries
- authentication
- authorization
- payment flow
- entitlement flow
- storage strategy
- webhook strategy
- AI architecture
- email
- analytics
- environment separation
- security boundaries
- expected folder structure

---

# DATABASE.MD

Document:

- proposed tables
- key columns
- relationships
- indexes
- enums or constrained values
- RLS strategy
- admin authorization strategy
- bundles
- subscriptions
- entitlements
- protected downloads
- AI usage tracking

Include a Mermaid ER diagram if practical.

Do not create production migrations yet.

---

# DESIGN_SYSTEM.MD

This is mandatory.

Document the SODALES visual system including:

## Colors

```text
Electric Violet  #5E4FB3
Soft Ivory       #F4F2ED
Graphite Grey    #35373B
Obsidian Black   #111111
```

## Typography

Primary:

- Inter
- Neue Haas Grotesk where legitimately available

Alternative reference:

- Akzidenz-Grotesk where legitimately available

Document:

- font stacks
- heading hierarchy
- body styles
- labels
- tracking
- responsive scaling

## Components

Document proposed:

- buttons
- cards
- navigation
- product cards
- chips
- forms
- modals
- dashboard surfaces
- browser/device presentation frames

## Layout

Document:

- content widths
- gutters
- grid
- section spacing
- mobile behavior

## Visual Rules

Document:

- dark vs light sections
- violet usage
- border treatment
- imagery
- product artwork
- motion
- accessibility

## Reference Interpretation

Explain how the supplied branding references are translated into the ecommerce product without blindly duplicating the reference page layouts.

---

# ROADMAP.MD

Turn development phases into actionable milestones.

For every phase include:

- objective
- implementation tasks
- dependencies
- definition of done
- tests/checks
- manual setup required from me

---

# AGENT_RULES.MD

Must instruct future agents to:

- read documentation first
- inspect before editing
- preserve brand tokens
- avoid arbitrary design drift
- work on one feature at a time
- reuse established patterns
- avoid unnecessary packages
- document environment variables
- protect secrets
- use migrations
- explain destructive actions
- run quality checks
- update project documentation
- update project status

---

# PROJECT_STATUS.MD

Use:

```md
# Current Phase

# Completed

# In Progress

# Next Recommended Task

# Decisions Made

# Open Decisions

# Known Issues

# Manual Setup Required

# Environment Variables Needed

# Last Updated
```

---

# DEVELOPMENT PHASES

## Phase 0 — Planning & Repository Foundation

Deliverables:

- repository inspection
- architecture documentation
- database plan
- design-system documentation
- environment strategy
- repo conventions
- roadmap
- project status

No major application features yet.

---

## Phase 1 — Application Foundation + SODALES Design System

Build:

- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Supabase connection
- environment validation
- global SODALES tokens
- typography
- logo implementation
- layout primitives
- buttons
- cards
- navigation
- responsive shell
- linting / type checking

Definition of done:

A branded SODALES shell deploys successfully to Vercel.

---

## Phase 2 — Public Storefront

Build:

- homepage
- product catalog
- product categories
- product detail page
- product cards
- filters
- search basics
- responsive layouts
- seed/demo products

No real checkout required yet.

---

## Phase 3 — Authentication

Build:

- signup
- login
- logout
- password recovery
- protected routes
- profile
- dashboard shell

---

## Phase 4 — Product Database & Admin

Build:

- product schema
- category schema
- offers
- product assets
- admin CRUD
- publishing states

Move storefront from mock data to database data.

---

## Phase 5 — Payments

Integrate Lemon Squeezy.

Build:

- checkout
- provider IDs
- webhook endpoint
- signature verification
- order synchronization
- test purchases

---

## Phase 6 — Entitlements & Product Library

Build:

- centralized entitlement service
- owned products
- customer library
- protected resources
- signed URLs
- bundle access
- download tracking

---

## Phase 7 — Memberships

Build:

- membership plans
- subscription synchronization
- membership comparison
- plan-based product access
- upgrades
- billing portal

---

## Phase 8 — First AI Tool

Build only one first.

Placeholder:

`{{FIRST_AI_TOOL}}`

Architecture:

- protected route
- server AI service
- entitlement check
- request validation
- usage logging
- provider abstraction
- error handling

Use it to establish the pattern for future AI products.

---

## Phase 9 — Analytics & Email

Add:

- PostHog
- ecommerce events
- product analytics
- Resend
- transactional email

---

## Phase 10 — Launch Hardening

Complete:

- RLS review
- database tests
- payment tests
- webhook replay tests
- mobile review
- accessibility review
- SEO
- error monitoring
- legal-page placeholders
- privacy policy
- terms
- refund policy
- backups
- production environment review

---

# POST-LAUNCH FEATURES

Do not delay V1 for:

- reviews
- favorites
- wishlists
- affiliate system
- referral program
- product collections
- advanced search
- recommendations
- annual memberships
- AI credit top-ups
- team accounts
- commercial licenses
- API access
- public changelog
- product version history
- community
- PWA
- advanced CRM
- support ticketing

---

# V1 NON-GOALS

Do NOT build unless strategy changes:

- multi-vendor marketplace
- native mobile app
- blockchain/NFT licensing
- custom payment processor
- custom tax engine
- microservices
- real-time chat
- social network
- custom video hosting
- custom email platform
- unlimited AI generation
- massive CMS
- custom analytics platform

---

# INITIAL PRODUCT PLACEHOLDERS

Create seed data for:

```text
{{AI_TOOL_01}}
{{AUTOMATION_01}}
{{N8N_WORKFLOW_01}}
{{PROMPT_SYSTEM_01}}
{{TEMPLATE_01}}
{{BUNDLE_01}}
{{FREE_LEAD_MAGNET_01}}
```

These are development placeholders.

---

# BRAND PLACEHOLDERS

Use configuration rather than scattering temporary values.

```text
BRAND_NAME=SODALES
BRAND_TAGLINE={{BRAND_TAGLINE}}
DOMAIN={{DOMAIN}}
SUPPORT_EMAIL={{SUPPORT_EMAIL}}
DEFAULT_CURRENCY=USD
```

---

# OPEN BUSINESS DECISIONS

These do not block planning:

## Brand

- final tagline
- domain
- full logo asset package
- motion treatment

## Launch Catalog

- first 3 paid products
- first free product
- first bundle

## Membership

- plan names
- pricing
- inclusions

## AI

- first embedded tool

## Policies

- refund policy
- commercial-use licensing
- support policy

## Marketing

- primary launch audience
- main acquisition channel
- lead magnet

Use placeholders where necessary.

---

# RECOMMENDED V1 LAUNCH SCOPE

Target:

## 3 Paid Products

- low-ticket entry product
- strong mid-ticket workflow/system
- premium bundle

## 1 Free Lead Magnet

For email acquisition.

## 1 Membership

Keep subscriptions simple initially.

## 1 Embedded AI Tool

Enough to demonstrate the future direction.

---

# IMPORTANT VIBE-CODING REQUIREMENT

I am not an experienced developer.

When later implementation requires me to manually do something in:

- Supabase
- Vercel
- Lemon Squeezy
- GitHub
- DNS
- n8n
- Resend

provide exact beginner-friendly instructions.

Explain:

- where to click
- what to create
- what value to copy
- where to paste it
- why it is needed
- whether it is safe to expose publicly

Do not assume I know where settings are located.

Do not overload me with explanations when no manual action is required.

---

# SOURCE OF TRUTH

Repository documentation becomes the source of truth.

When future requests conflict with existing architecture or brand rules:

1. identify the conflict
2. explain it
3. recommend whether the current decision should change
4. update documentation if direction intentionally changes

---

# CODE QUALITY EXPECTATIONS

Before declaring future development work complete:

- project compiles
- TypeScript passes
- lint passes
- relevant tests pass
- no secrets are committed
- no obvious authorization bypass exists
- responsive behavior is considered
- accessibility is considered
- SODALES design-system consistency is preserved
- newly introduced environment variables are documented

Do not hide errors with:

```text
any
@ts-ignore
eslint-disable
```

unless there is a clearly justified and documented reason.

---

# YOUR TASK FOR THIS FIRST SESSION

**DO NOT BUILD THE APPLICATION YET.**

First inspect the existing repository.

Determine whether it is:

- empty
- partially initialized
- already a Next.js application
- contains useful existing configuration

Do not delete or replace useful existing work.

Then create or update:

```text
/docs/MASTER_PLAN.md
/docs/ARCHITECTURE.md
/docs/DATABASE.md
/docs/DESIGN_SYSTEM.md
/docs/ROADMAP.md
/docs/AGENT_RULES.md
/PROJECT_STATUS.md
```

The planning documentation must incorporate both:

1. the product / technical architecture described above
2. the SODALES visual identity described above

Do not begin Phase 1.

---

# FIRST SESSION OUTPUT

After inspecting the repository and writing the documentation, respond with:

1. What you found in the repository.
2. What planning files you created or updated.
3. Your recommended final architecture.
4. Your interpretation of the SODALES design system.
5. Any architecture or design decisions you changed from this brief and why.
6. Open decisions that can safely wait.
7. The exact next development milestone.
8. Any action required from me before starting Phase 1.

Do not begin Phase 1 unless I explicitly ask you to continue.

Start by inspecting the repository.
