# SODALES Design System

The visual system is defined once, here, and consumed through semantic tokens. Components
must not invent styling. This document is authoritative — if a design decision is not
written down here, it has not been made.

---

## 1. Brand palette

Four brand constants. These are the identity and do not change.

| Name | Hex | Role |
| --- | --- | --- |
| Electric Violet | `#5E4FB3` | Primary accent. Used selectively — never flood a layout with it. |
| Soft Ivory | `#F4F2ED` | Light foundation. Preferred over pure white. |
| Graphite Grey | `#35373B` | Secondary neutral. **Light surfaces only.** |
| Obsidian Black | `#111111` | Dark foundation. Preferred over pure `#000000`. |

### 1.1 The contrast problem, and how this system solves it

Measured WCAG 2.1 contrast ratios for the palette as originally specified:

| Pair | Ratio | Verdict |
| --- | --- | --- |
| Electric Violet text on Obsidian Black | **2.92:1** | Fails. Below the 3:1 floor for even large text. |
| Graphite Grey text on Obsidian Black | **1.58:1** | Fails badly. Effectively invisible. |
| Ivory text on Electric Violet | 5.78:1 | Passes AA. |
| Electric Violet text on Soft Ivory | 5.78:1 | Passes AA. |
| Obsidian Black text on Soft Ivory | 16.88:1 | Passes AAA. |
| Graphite Grey text on Soft Ivory | 10.66:1 | Passes AAA. |

So the palette is sound on light surfaces and broken on dark ones — which matters, because
the brand's strongest expression (hero, footer, feature sections, AI tools) is dark.

**The fix is at the token layer, not the palette layer.** Electric Violet stays the brand
color and is used unchanged on light surfaces. On dark surfaces, `--primary` and `--accent`
resolve to slightly lighter steps of the *same hue* (HSL hue 249, identical to `#5E4FB3`).
The shift is imperceptible as a brand change and makes every dark surface compliant.

Graphite Grey is demoted to a light-surface-only color. Dark surfaces use a warm neutral
grey for secondary text.

### 1.2 Extended ramp

Derived tints and shades, all at hue 249 to match Electric Violet exactly.

| Token | Hex | Purpose |
| --- | --- | --- |
| `--sodales-violet-soft` | `#AB9FEF` | Focus rings and accents on dark. 8.04:1 on Obsidian. |
| `--sodales-violet-light` | `#8373DE` | Links, icons and accent text on dark. 4.92:1 on Obsidian. |
| `--sodales-violet-bright` | `#6B5BC2` | Primary button fill on dark. 3.51:1 vs page, ivory-on-it 4.81:1. |
| `--sodales-violet` | `#5E4FB3` | **Brand core.** Primary button fill and accent text on light. |
| `--sodales-violet-deep` | `#4D409C` | Primary hover / pressed on light. 7.42:1 on Ivory. |
| `--sodales-ivory` | `#F4F2ED` | Brand light. |
| `--sodales-graphite` | `#35373B` | Brand neutral. |
| `--sodales-obsidian` | `#111111` | Brand dark. |

---

## 2. Semantic tokens

Components consume **only** these. The raw palette above appears in exactly one file,
`styles/brand-tokens.css`, and nowhere else.

### 2.1 Dark surface

Default for hero, footer, feature sections and AI tools.

| Token | Hex | Contrast vs page | Use |
| --- | --- | --- | --- |
| `--background` | `#111111` | — | Page ground |
| `--surface` | `#17181B` | 1.06 | Cards, panels |
| `--surface-elevated` | `#1E2024` | 1.16 | Modals, popovers, raised cards |
| `--surface-muted` | `#0C0C0D` | — | Recessed wells, code blocks |
| `--foreground` | `#F4F2ED` | 16.88 | Body and heading text |
| `--muted-foreground` | `#9B9A94` | 6.69 | Secondary text, descriptions |
| `--subtle-foreground` | `#7E7D78` | 4.58 | Metadata, timestamps, captions |
| `--border` | `#2A2C31` | 1.35 | Default hairlines |
| `--border-strong` | `#3C3F45` | 1.79 | Emphasised dividers, input borders |
| `--primary` | `#6B5BC2` | 3.51 | Primary button fill |
| `--primary-hover` | `#8373DE` | 4.92 | Primary button hover |
| `--primary-foreground` | `#F4F2ED` | 4.81 on fill | Text on primary |
| `--accent` | `#8373DE` | 4.92 | Links, accent text, active icons |
| `--ring` | `#AB9FEF` | 8.04 | Focus ring |
| `--success` | `#4ADE80` | 10.84 | |
| `--warning` | `#F5B849` | 10.64 | |
| `--danger` | `#F87171` | 6.83 | |

### 2.2 Light surface

Default for catalog, docs, pricing, account and long-form content.

| Token | Hex | Contrast vs page | Use |
| --- | --- | --- | --- |
| `--background` | `#F4F2ED` | — | Page ground |
| `--surface` | `#FBFAF7` | 1.07 | Cards, panels |
| `--surface-elevated` | `#FFFFFF` | 1.13 | Modals, popovers |
| `--surface-muted` | `#E8E5DE` | 1.12 | Recessed wells, code blocks |
| `--foreground` | `#111111` | 16.88 | Body and heading text |
| `--muted-foreground` | `#35373B` | 10.66 | Secondary text (Graphite Grey) |
| `--subtle-foreground` | `#5C5F65` | 5.72 | Metadata, captions |
| `--border` | `#DBD7CE` | 1.28 | Default hairlines |
| `--border-strong` | `#B9B4A8` | 1.85 | Emphasised dividers, input borders |
| `--primary` | `#5E4FB3` | 5.78 | Primary button fill |
| `--primary-hover` | `#4D409C` | 7.42 | Primary button hover |
| `--primary-foreground` | `#F4F2ED` | 5.78 on fill | Text on primary |
| `--accent` | `#5E4FB3` | 5.78 | Links, accent text |
| `--ring` | `#5E4FB3` | 5.78 | Focus ring |
| `--success` | `#1F7A44` | 4.78 | |
| `--warning` | `#8A5A00` | 5.30 | |
| `--danger` | `#B3261E` | 5.84 | |

Every value above has been measured. Any new color added to this system must be measured
against its own surface and recorded in this table before use.

### 2.3 Implementation

Tokens live in `styles/brand-tokens.css`. Dark and light are **surface scopes**, not a
user-level theme toggle — a single page routinely contains both.

```css
:root,
[data-surface="light"] { /* light tokens */ }

[data-surface="dark"]  { /* dark tokens */ }
```

A `<Section surface="dark">` sets `data-surface="dark"` on its own element, so every
descendant resolves the correct tokens automatically. Nested sections may invert freely.
Tailwind maps these to utilities (`bg-background`, `text-muted-foreground`, `border-border`)
so components never reference a hex.

---

## 3. Typography

**Primary typeface: Inter**, loaded via `next/font/google` with `display: swap`. Neue Haas
Grotesk or Akzidenz-Grotesk may replace it *only* if a legitimate license is purchased. Do
not download or bundle unlicensed font files, and do not approximate them with lookalike
free fonts.

Fallback stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

Enable OpenType features `cv11` (single-storey a) and `ss03` where available, for a cleaner
grotesk feel closer to the reference material.

### 3.1 Scale

Fluid via `clamp()`. Mobile values are deliberate, not shrunken desktop values.

| Token | Mobile → Desktop | Weight | Line height | Tracking |
| --- | --- | --- | --- | --- |
| `display-xl` | 40px → 88px | 800 | 0.92 | -0.03em |
| `display` | 34px → 64px | 700 | 0.96 | -0.025em |
| `h1` | 30px → 56px | 700 | 1.02 | -0.02em |
| `h2` | 26px → 44px | 700 | 1.08 | -0.02em |
| `h3` | 21px → 32px | 600 | 1.16 | -0.01em |
| `h4` | 18px → 24px | 600 | 1.25 | -0.01em |
| `body-lg` | 17px → 20px | 400 | 1.55 | 0 |
| `body` | 16px | 400 | 1.6 | 0 |
| `body-sm` | 14px | 400 | 1.55 | 0 |
| `label` | 11px → 12px | 600 | 1.2 | 0.12em, uppercase |
| `mono` | 13px → 14px | 400 | 1.5 | 0 |

```css
--font-size-display-xl: clamp(2.5rem, 1.2rem + 6.5vw, 5.5rem);
--font-size-display:    clamp(2.125rem, 1.3rem + 4.1vw, 4rem);
--font-size-h1:         clamp(1.875rem, 1.15rem + 3.6vw, 3.5rem);
```

Display type never wraps to more than three lines at any breakpoint. Body copy is capped at
`--measure` (68ch).

### 3.2 Typographic rules

The reference material's identity comes from a three-way contrast: **oversized editorial
display**, **neutral readable body**, and **small wide-tracked uppercase labels**. Preserve
all three — losing the label tier is what makes a design like this go generic.

- Uppercase + wide tracking is for eyebrows, category chips, metadata, status badges and
  short nav markers **only**. Never for a sentence.
- One `display-xl` per page maximum, and only in a hero.
- Headings step down in order. Never pick a size for visual reasons and skip a level — style
  the correct semantic tag instead.
- Negative tracking on display sizes is what makes large Inter look intentional. Do not omit it.

---

## 4. Layout

| Token | Value |
| --- | --- |
| `--container` | 1280px |
| `--container-narrow` | 880px (long-form, docs, legal) |
| `--container-wide` | 1440px (full-bleed showcases) |
| `--gutter` | 20px mobile / 32px tablet / 48px desktop |
| `--measure` | 68ch |

**Spacing scale** (4px base): `4 8 12 16 20 24 32 40 48 64 80 96 128 160`. No arbitrary values.

**Section rhythm:** vertical padding `clamp(64px, 9vw, 128px)`. Adjacent sections sharing a
surface merge their padding rather than doubling it.

**Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`.

**Grid:** 12 columns desktop, 8 tablet, 4 mobile. Asymmetric compositions (7/5, 8/4) are
preferred over centered symmetry for editorial sections.

### 4.1 Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 8px | Inputs, chips, small controls |
| `--radius-md` | 12px | Buttons, small cards |
| `--radius-lg` | 18px | Product cards, panels |
| `--radius-xl` | 24px | Showcase frames, modals, media |
| `--radius-pill` | 999px | Category chips, badges, filter pills |

### 4.2 Elevation

Shadows are restrained. On dark surfaces, elevation is communicated by **surface lightness
and border**, not by shadow — shadows are nearly invisible on `#111111`.

```css
--shadow-sm: 0 1px 2px rgb(17 17 17 / 0.06);
--shadow-md: 0 4px 16px -4px rgb(17 17 17 / 0.10);
--shadow-lg: 0 16px 48px -12px rgb(17 17 17 / 0.16);
```

No violet glow shadows by default.

---

## 5. Components

### 5.1 Buttons

| Variant | Fill | Text | Border |
| --- | --- | --- | --- |
| Primary | `--primary` | `--primary-foreground` | none |
| Secondary | `--surface` | `--foreground` | `--border-strong` |
| Ghost | transparent | `--foreground` | none; `--surface` on hover |
| Link | transparent | `--accent` | none; underline on hover |
| Danger | `--danger` | contrast-checked per surface | none |

Sizes: `sm` 36px · `md` 44px · `lg` 52px. Minimum touch target 44×44px on mobile.
Radius `--radius-md`. Transition `background-color 160ms ease`. **No glow, no gradient fills.**
Focus: 2px `--ring`, offset 2px, always visible on keyboard focus.

### 5.2 Product card

Structure, top to bottom: media (16:10, `--radius-lg`, lazy-loaded, real alt text) → category
eyebrow (`label` token) → product name (`h4`) → one-line outcome description
(`--muted-foreground`, clamped to 2 lines) → footer row with price and badges.

Treatment: `--surface` fill, 1px `--border`, `--radius-lg`. Hover raises the border to
`--border-strong` and lifts the media 2px over 180ms. No violet fill, no glow, no gradient.
Violet appears only in a badge, or in the price when the product is a membership inclusion.

The whole card is one link. Do not nest interactive elements inside it.

Badges: `Included with membership` (violet, subtle), `Free`, `New`, `Popular`. Maximum two
per card — more reads as clutter.

### 5.3 Other primitives

- **Chip** — pill, `label` type, `--surface-muted` fill; active state uses `--primary` fill.
- **Input** — 44px, `--radius-sm`, 1px `--border-strong`, `--ring` on focus. Always a real
  `<label>`; a placeholder is never the only label.
- **Section header** — optional eyebrow, `h2`, optional `body-lg` subhead capped at `--measure`.
- **Browser / device frame** — `--radius-xl`, 1px `--border`, subtle top chrome bar. Presents
  real product screenshots. Never wraps decorative abstract art.
- **Empty state** — icon, `h4`, one line of `--muted-foreground`, one action. Library and
  downloads must never show a bare "no results".
- **Metric** — large number in `h2`, `label` beneath. Dashboard use.

Build a component only on its second real use. Two similar things is not yet a pattern.

---

## 6. Visual rules

**Surface rhythm.** Alternate dark and light sections deliberately: dark hero → light catalog
→ dark feature → light pricing → dark footer. Do not make every section a rounded card
floating on a page; let large sections run full-bleed with generous open space.

**Violet discipline.** On any given screen violet should appear in roughly three places: the
primary action, the active navigation state, and one accent (a badge or a highlighted word).
If a screenshot shows violet in more than five places, it is overused.

**Imagery.** Product artwork is real interface screenshots, workflow diagrams, template
previews and device mockups. No generic stock photography as a hero. No glowing brains, robot
heads, neon circuit boards or holograms. Every product image needs descriptive alt text
naming the product and what is shown.

**Borders over shadows.** The premium feel comes from precise hairlines and spacing, not from
drop shadows or glassmorphism. Use blur or translucency at most once per page.

**Motion.** Fade plus 8–16px translate reveals, 200–320ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
Hover transitions 160ms. Prefer CSS; no animation library unless a concrete need appears.
Everything non-essential must be wrapped:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Logo.** Small and confident — roughly 24–28px tall in the header. Violet mark with light
wordmark on dark; violet mark with graphite wordmark on light. Never stretched, never
recolored outside these two treatments, never enlarged into a banner.

---

## 7. Accessibility (non-negotiable)

- All text meets 4.5:1; large text and UI boundaries meet 3:1. Values in §2 are measured.
- Visible keyboard focus on every interactive element. Never `outline: none` without a
  replacement ring.
- Semantic HTML: one `<h1>` per page, ordered headings, real `<button>` and `<a>`, real
  `<label>`, landmark regions.
- Form errors are announced, tied to their input via `aria-describedby`, and never conveyed
  by color alone.
- Touch targets ≥ 44×44px.
- `prefers-reduced-motion` respected.
- Electric Violet is never used for small body text on dark. This is the single most likely
  accessibility regression in this project — check it in every UI review.

---

## 8. How the brand references were interpreted

> **Status:** the four supplied reference images (`Screenshot_2026-09-02_at_2.56.37_AM.png`,
> `image(20260902-103047).png`, `IMG_7040.png`, `IMG_7041.jpeg`) are **not present in the
> repository**. This section is derived from the written brief alone. When the images are
> added to `public/brand/references/`, revisit it and record any correction.

The references establish a premium creative-technology language: oversized editorial type,
generous negative space, asymmetric composition, dark-to-violet atmospheric backgrounds,
rounded media frames and restrained violet accenting.

Translating that into an ecommerce product means keeping the *language* and rejecting the
*layout*, because a portfolio page and a storefront have different jobs:

| Reference behavior | Storefront translation |
| --- | --- |
| Full-viewport editorial hero | Hero capped around 80vh with a real product showcase and two clear CTAs. A shopper must reach product within one scroll. |
| Sparse, gallery-like grids | Denser, scannable product grid — but with reference-level card spacing and hairline borders, not a tight generic-theme grid. |
| Type as the primary subject | Type leads marketing sections; in catalog, product detail and dashboard, information hierarchy leads and type supports. |
| Atmospheric violet gradients | Confined to the hero and one or two feature sections. Catalog, checkout, dashboard and account stay clean and readable. |
| Decorative overlaps crossing sections | Allowed once or twice on the homepage only. Never near navigation, filters, checkout or forms. |

The dashboard is the sharpest departure: it should read as a **premium software library**,
using the same tokens, type scale and card language as the storefront — not as an admin table
and not as an order-history list.

---

## 9. Open design decisions

Tracked in [../PROJECT_STATUS.md](../PROJECT_STATUS.md). None block Phase 1.

- Final tagline and domain
- Full logo asset package (SVG, both treatments, favicon set)
- Whether to license Neue Haas Grotesk for display type
- Open Graph image template
- Reference images added to the repo
