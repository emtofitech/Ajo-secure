# Ajo Secure

Community rotating savings (Ajo/Esusu) where the organizer coordinates the group
but never holds or redirects the pooled money — plus **Ajo-to-Goods**, a separate,
optional way to save toward goods from an approved vendor catalog.

Built with **React 18 + Vite 6 + Tailwind CSS 4**.

One app, two surfaces:

| Route      | What it is                                                        |
| ---------- | ----------------------------------------------------------------- |
| `/`        | The public landing page (hero, "how it works", features, footer).  |
| `/app/*`   | The member dashboard (cycles, ledger, notifications, profile).     |
| `/dashboard` | Friendly alias for `/app` — redirects there.                    |
| `/app/goods` | **Ajo-to-Goods**, behind the `FEATURES.ajoToGoods` flag.        |

Routing is `react-router-dom`. The landing page is documented from
[Design tokens](#design-tokens) down to [Deploying](#deploying); the dashboard and
Ajo-to-Goods are documented in [The dashboard](#the-dashboard) and
[Ajo-to-Goods](#ajo-to-goods).

> The landing page is **two `<section>`s**: the full-viewport hero (`h-screen`,
> `overflow-hidden`, no scroll of its own) and a `min-h-screen` "how it works"
> section below it. The page scrolls vertically between them; it never scrolls
> horizontally. `body` keeps `overflow-x: hidden` and does **not** set
> `overflow: hidden`.

## Design tokens

Deep navy-black with a single electric-blue accent. No other hues.

| Token            | Value                      | Role                                    |
| ---------------- | -------------------------- | --------------------------------------- |
| Page bg          | `#020817`                  | Section background                      |
| Accent           | `#5AB0FF`                  | Logo hover, Get Started, CTA, badges, links |
| Accent hover     | `#8CC8FF`                  | Button hover                            |
| Electric glow    | `#1D4ED8`, `#2563EB`       | Radial glows, image drop-shadows        |
| Primary text     | `#FFFFFF`                  |                                         |
| Muted text       | `text-white/60`, `text-white/50` | Subcopy, step secondary lines      |
| Grid line        | `bg-white/[0.05]`          | Hero + section-two grid motif           |
| Plus mark        | `bg-white/70`              | Hero intersections                      |
| Step rule        | `border-[#5AB0FF]/60`      | Border on each step square              |
| Phone frame      | `border-white/25` on `#050f24` | Section-two phone mockup            |

In Tailwind 4 these live as `@theme` custom properties in
`src/styles/index.css` (`--color-navy`, `--color-accent`, `--color-electric`, …).

**Legacy aliases.** The first build used different token names (`ice`, `forest`,
`cream`, `stone`, `panel`, …). Those names are retained in `@theme` pointing at
the blue palette so the old section components still resolve if they are ever
imported again. See *Not currently rendered* below.

### Easing

Two curves, used consistently throughout:

- **Entrances / reveals** — `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out)
- **Interactive** — `cubic-bezier(0.76, 0, 0.24, 1)`

### Fonts

- `Graphik LCG` — the wordmark, the `<h1>`, and the phone headline **only**
  (`.font-graphik`)
- `Manrope` 400/500 — everything else (`.font-manrope`)

Both are loaded from `<link>` tags in `index.html`.

## The gutter

The composition hangs off one two-value gutter: **20px below `md`, 35px at `md`
and up**.

| Element    | Classes                                        |
| ---------- | ---------------------------------------------- |
| Hero nav   | `px-5 md:px-[35px]` (plus `py-5 md:py-[27px]`) |
| H1         | `left-5 md:left-[35px]`                        |
| Section 2  | `px-5 md:px-[35px]` (inner `max-w-[1280px]`, `pt-10`) |

The spec calls for these Tailwind arbitrary values inline rather than a shared
`.gutter` class, so the value is repeated. **If you change one, change them all**
— they must match exactly or the edges visibly misalign.

## 1 · The hero

Z-order, back to front:

```
glow layer  →  floating money  →  grid + content
```

1. **Glow layer** (`anim-fade-in`) — three absolutely positioned blurred radial
   gradients (`rgba(37,99,235,.35)`, `rgba(90,176,255,.18)`, `rgba(29,78,216,.22)`)
   plus a vignette. Replaces the background video.
2. **Floating money** (`FloatingMoney`) — the three artworks, 8 instances.
3. **Content** (`relative z-10`) — nav, H1, grid.

Also inside the content layer:

- **`GridLines`** — 4 verticals (`12.6% / 37.5% / 61.9% / 86.2%`), 2 horizontals
  (`32.7% / 71.4%`), and a plus mark at all 8 intersections.

Everything else that used to live here — the `CentralNodes` diagram, the
`[ CONTRIBUTE ] / [ LEDGER ] / [ PAYOUT ]` labels, the six `ConnectorLine` SVGs,
and the whole bottom row (`START AN AJO GROUP` CTA, `NOT A WALLET — A SECURE
LEDGER` badge, chamfered info card, `VIEW_FEE_BREAKDOWN` link) — has been removed
from the hero, and the CTA + fee-card copy is now gone from the page entirely. The
three steps live in section two.

The hero keeps: the navbar, the `<h1>`, the sub-copy and the pair of action
buttons, the blue glow background, the grid lines and plus marks, and the
floating money.

The copy is one absolutely-positioned block (`[data-hero-copy]`) so the sub-copy
and the buttons always flow under the headline: the `<h1>` renders on **two
lines by construction** (`Save Together.` / `Get Paid Securely.`) at
`text-[30px] sm:text-[42px] md:text-[56px]`, with only the word **Securely.**
picked out in the deep app blue (`#2563EB` — the same blue as the section-four
headings). Beneath it sits the sub-copy (`text-[13px] sm:text-[14.5px]`, muted
white) and a `flex flex-wrap gap-3` row of two square buttons — **Start a group**
(accent-filled) and **Join a group** (outline) — both in-page anchors to
`#how-it-works`. Holding the headline to two lines is what keeps those buttons
above the fold on short viewports.

### Navbar

`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-5
md:px-[35px] py-5 md:py-[27px]` (`.site-nav`).

The bar is **pinned to the viewport**: it stays put while the page scrolls rather
than riding off with the hero. A passive `scroll` listener (ref + class toggle,
no state) adds `.is-scrolled` past 8px, fading in a blurred navy bar
(`rgba(2,8,23,0.85)` + `backdrop-filter: blur(12px)`) with a hairline bottom
border. Over the hero it is transparent.

- **Left** — a link to `#` holding the logo mark (`h-[28px] md:h-[32px] w-auto`)
  and the wordmark **`AjoSecure`** (`font-graphik text-white text-[18px]
  md:text-[21px] leading-[21px] whitespace-nowrap`). Both use `anim-fade-up`
  at 200ms.
- **Right** — a **Get Started** button (`bg-[#5AB0FF] hover:bg-[#8CC8FF]
  text-black`, square corners, `anim-slide-right` at 500ms) linking to the
  dashboard at `/app` (`/dashboard` is kept as an alias). Shown at **every**
  breakpoint.

There are **no numbered nav links** (`01. HOW_IT_WORKS` … `04. AJO_STAR`), **no
wallet strip** (`GROUP:`, `[ VERIFIED ]`, `STATUS:`, `AJO_STAR ★ 4.8`), **no
hamburger and no mobile menu**. The bar is logo + Get Started at all widths.

### Breakpoints

| Width        | What changes                                                       |
| ------------ | ------------------------------------------------------------------ |
| `< sm` (640) | Money instances 5–8 hidden; instance 1 drops to `top-[64%]`.       |
| `sm`         | Instance 1 returns to `top-[19%]`; money reaches 8 visible.        |
| `md` (768)   | Grid/money spacing at its desktop values.                          |
| `lg` (1024)  | Section two switches from stacked to a 2-column grid.              |

The nav itself is the same at every width.

### Entrance timeline

| When (ms) | What                             |
| --------- | -------------------------------- |
| 200       | Logo + wordmark                  |
| 300–1200  | Money images (then loop forever) |
| 400       | H1                               |
| 500       | Get Started                      |
| 600–950   | Grid lines                       |
| 1000–1560 | Plus marks                       |

## Floating money

Each artwork is a `FloatingMoney` instance. Three separate elements so no two
animations ever fight over `transform`:

```
outer div   absolute + position + width + aspect-ratio + blur + .money-parallax  (mouse parallax)
  inner div absolute inset-0 + .anim-scale-in                                   (entrance)
    <img>   .money-float .a|.b                                                  (endless drift)
```

| # | Image      | Position                                   | Width (mobile → lg) | Opacity | Blur | Dur | dx / dy   | Rot      | Loop | < `sm` |
| - | ---------- | ------------------------------------------ | ------------------- | ------- | ---- | --- | --------- | -------- | ---- | ------ |
| 1 | money-pile | `top-[64%] right-[6%] sm:top-[19%]`        | 120 → 260px         | 1       | —    | 9s  | 14 / -18  | -8°→6°   | a    | show   |
| 2 | money-box  | `top-[46%] right-[18%]`                    | 100 → 220px         | 1       | —    | 11s | -18 / 22  | 10°→-4°  | b    | show   |
| 3 | money-diff | `bottom-[18%] left-[40%]`                  | 90 → 190px          | 0.95    | —    | 10s | 20 / -18  | -12°→8°  | a    | show   |
| 4 | money-pile | `bottom-[14%] left-[6%]`                   | 70 → 140px          | 0.55    | 2px  | 13s | 12 / 20   | 14°→-6°  | b    | show   |
| 5 | money-box  | `bottom-[30%] left-[52%]`                  | 60 → 110px          | 0.45    | 3px  | 14s | -14 / 16  | -6°→12°  | a    | hide   |
| 6 | money-diff | `top-[108px] right-[30%]`                  | 50 → 90px           | 0.40    | 3px  | 12s | 10 / 18   | 8°→-10°  | b    | hide   |
| 7 | money-pile | `bottom-[34%] right-[3%]`                  | 56 → 100px          | 0.50    | 2px  | 15s | -10 / -20 | -10°→10° | a    | hide   |
| 8 | money-box  | `bottom-[5%] left-[30%]`                   | 64 → 120px          | 0.50    | 2px  | 12s | 16 / -14  | 6°→-12°  | b    | hide   |

With the node diagram gone, the large sharp piles sit **right and centre** and
the small blurred ones fill the lower band, leaving the top-left quadrant clear
for the H1. Two positions are tuned rather than free-floating:

- **1** — at phones the `<h1>` is `max-w-[300px]` and spans nearly the full
  width, leaving no top-right gap, so it drops to `top-[64%]` below `sm` and
  returns to `top-[19%]` at `sm`+.
- **6** — this is the one instance that must clear the **navbar**, whose box is
  ~94px tall (`py-[27px]` + the 39.6px button). A percentage that clears the bar
  at 720px height sits too low at 1024px, so it uses a fixed `top-[108px]`.

Other notes:

- Big + sharp = foreground; small + blurred + low-opacity = depth.
- `animation-delay` is **negative** (`-2s` … `-11s`) so instances don't drift in sync.
- The layer is `pointer-events-none`, and every image is `alt=""`,
  `aria-hidden="true"` and `draggable={false}`.
- **Optional mouse parallax** (`md+`, no re-renders): the rAF loop writes
  `--px`/`--py` onto each `[data-depth]` box, scaled by depth (bigger = more).
  It is skipped entirely under `prefers-reduced-motion`.

## 2 · Section two — how it works

`<section id="how-it-works" class="relative w-full min-h-screen bg-[#020817]
overflow-hidden border-t border-white/10">` — the `border-t` is the seam with the
hero, and the section carries `pt-10` (40px) of top padding so the pinned navbar
does not crowd the content. Inside: a glow layer (radial blue behind the phone at
25%/50% and behind the vault at 85%/15%) and the same `bg-white/[0.05]`
grid-line motif as the hero.
Inner wrapper: `max-w-[1280px] mx-auto px-5 md:px-[35px] pt-10 pb-[80px]
md:pb-[120px] grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-[56px] lg:gap-[72px]
items-start` — `items-start` keeps the right column top-aligned with the phone.

### Left column — CSS-only phone

A pure-CSS phone frame (no image): `w-[280px] sm:w-[300px] h-[600px]
rounded-[40px] border border-white/25 bg-[#050f24]` with a
`shadow-[0_30px_80px_rgba(37,99,235,0.35)]`, a centred black notch
(`w-[90px] h-[22px] rounded-full`), and an inset screen (`inset-[12px]
rounded-[30px] pt-[44px] pb-[20px]`) over a blue gradient
(`#0b2a66 → #0a1d4a → #020817`). The frame is `role="img"` with a descriptive
`aria-label` and drifts ±8px on a 7s loop (`.float-y`). Inside the screen: a
two-line headline (each line `whitespace-nowrap` so "Get Paid Securely." can
never orphan), a "Lagos Traders" group card carrying the ₦ count-up and a
progress bar, a verified-recipient row, the fee lines, and a status pill pinned
to the bottom. Two glass toasts (`hidden sm:flex`) overlap the frame, and a large
blurred blue circle sits behind it.

### Right column — header, vault, steps

A `flex flex-col gap-[32px]` stack, **top-aligned with the phone**:

1. **Header** — a plain `HOW_IT_WORKS` eyebrow (no bracket decoration), the
   `<h2>` "Ajo that runs on rules, not on trust." and the subcopy paragraph.
2. **Vault** — the blue steel vault sits **directly under the subcopy**
   (`w-[140px] sm:w-[180px] md:w-[220px]`, `.float-y` drift, `inset(0 0 6% 0)`
   clip kept as a no-op safety net) over a soft elliptical floor glow.
3. **Steps timeline** — three rows of a 44px **square** icon badge
   (`border-[#5AB0FF]/60`, → `#5AB0FF` + `bg-[#5AB0FF]/10` on hover) joined by 1px
   gradient connector lines, each with `01./02./03.` + `CONTRIBUTE / LEDGER /
   PAYOUT`, a description and a secondary line. The whole row shifts 4px
   right on hover.

The CTA row (`START AN AJO GROUP` + trust items) and the chamfered fee card
(`NOT A WALLET — A SECURE LEDGER`) are **gone** — there is no fee breakdown on the
page, so the phone screen's fee lines are the only place fees appear.

### Scroll reveal

One `IntersectionObserver` on the section root (threshold `0.2`) adds
`.is-visible`; the CSS then plays `fadeUp` on every `.reveal` descendant, and the
stagger comes from an **inline `animation-delay`** (0 → 360ms in 120ms steps:
phone, header, vault, steps). The same observer runs a 1200ms ease-out ₦
count-up (`data-countup`, `requestAnimationFrame`, `toLocaleString("en-NG")`).
**No component state is involved** — a ref plus a class toggle. If
`IntersectionObserver` is missing the class is added immediately so nothing can
stay hidden.

## Images

`src/images/` holds the originals (`logo.png` and `vault.png` are 1254²; the
money PNGs are 3000–3848px; ~24 MB total, **gitignored**). The build ships WebP
in `src/assets/` — **0.52 MB, a 98% reduction**:

| Asset        | Source             | Shipped            | Notes                          |
| ------------ | ------------------ | ------------------ | ------------------------------ |
| `money-box`  | 3000×3000 · 6.3 MB | 1280×1280 · 251 KB | alpha preserved                |
| `money-diff` | 3840×2160 · 6.5 MB | 1280×720 · 118 KB  | alpha preserved                |
| `money-pile` | 3848×2160 · 9.1 MB | 1280×719 · 145 KB  | alpha preserved                |
| `vault`      | 1254×1254 · 1.3 MB | 900×900 · 19 KB    | white + grey shadow cut out    |
| `logo`       | 1254×1254 · 1.0 MB | 253×256 · 13 KB    | white cut out, cropped to crest |

> `logo.png` is a **stacked lockup** (crest over a wordmark). At the nav's 32px
> height the baked-in wordmark would be an illegible smudge next to the separate
> `AjoSecure` text, so the optimizer crops to the largest connected shape — the
> crest. `logo.png` and `vault.png` have **no alpha**; the optimizer flood-fills
> their near-white background to transparent from the borders inward (interior
> whites are kept). The vault uses a **lower white threshold (200, not 230)**
> because its grey contact shadow sits around 200–225 and otherwise survived the
> cut-out as a pale smudge under the feet.

To regenerate after swapping artwork in `src/images/`:

```bash
npm run optimize:images
```

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

| Script                    | What it does                                        |
| ------------------------- | --------------------------------------------------- |
| `npm run dev`             | Dev server with HMR                                 |
| `npm start`               | Alias for `dev`                                     |
| `npm run build`           | Production build into `dist/`                       |
| `npm run preview`         | Serve the production build locally                  |
| `npm run lint`            | ESLint (includes the React Hooks rules)             |
| `npm run verify`          | SSR-render the landing page and assert the DOM contract |
| `npm run verify:goods`    | Assert the Ajo-to-Goods ledger + state contract (69 checks) |
| `npm run optimize:images` | PNG → WebP (resize, white cut-out, logo crop)       |

Requires Node 18+ (developed on Node 22).

### `npm run verify`

`scripts/verify-hero.mjs` renders `Hero.jsx`, `SectionTwo.jsx`, `Footer.jsx` and
the landing composition (`LandingPage.jsx`) through Vite's SSR pipeline and
asserts the DOM contract — element counts, the 8 money instances and their CSS
variables, the 8 plus marks, the removed hero elements staying removed, the
pinned nav's logo/wordmark/Get Started (now linking to `/app`), the two-line
hero headline with its deep-blue accent word plus sub-copy and the two
in-page action buttons, the section two phone + header/vault/steps,
the light section-four features band (six cards, copy and palette),
the CTA and fee card staying removed, the footer, the 4 reveal targets and their
inline stagger, the `@layer base` cascade fix, the `float-y`/`pulse-dot`/`bar-fill`/
`.site-nav` styles and the reduced-motion coverage (**103 assertions**).

It renders `LandingPage` directly rather than the router shell `App.jsx`, because
`react-router-dom` is CommonJS and does not survive Vite's SSR interop. The
routing itself is asserted at the source level instead: `App.jsx` must map `/` to
the landing page, mount the dashboard at `/app/*` and alias `/dashboard` onto it.

```bash
npm run verify    # exits non-zero on any failure
```

It catches structure and regression bugs, **not** visual ones — text
overlapping artwork and image cropping still need an eye on the page.

### `npm run verify:goods`

`scripts/verify-goods.mjs` exercises the Ajo-to-Goods **service layer** directly
(no browser) and asserts **69 contract checks**:

- the state machine — only whitelisted transitions, and `CANCELLED` /
  `MEMBER_CONFIRMED` are not parkable;
- balanced double-entry ledger legs (`isBalanced`) with integer kobo, and the
  ledger staying append-only;
- catalog-only vendors — a free-text vendor or item is rejected;
- the full journey (create → save → `TARGET_REACHED` → confirm → vendor notified
  → accepted → received → `FULFILLED`) writing a notification and an audit entry
  at each transition;
- cancel issuing a compensating `GOODS_REFUND` while the original entries are
  left untouched;
- a notification, audit entry and ledger entry for every transition.

```bash
npm run verify:goods    # exits non-zero on any failure
```

### Headless layout checks

The floating money is positioned in viewport percentages while the headline is a
fixed-pixel box, so collisions depend on the exact viewport. The page was
measured in **headless Chrome** via `puppeteer-core` at 8 sizes:

```
320×568  375×667  640×800  768×1024  1024×768  1280×720  1440×900  1920×1080
```

For each size the harness measures the **real text glyph boxes**
(`Range.getClientRects()`, one rect per rendered line) and the **un-animated
money wrapper boxes** (not the `<img>`, whose rect moves with the float
animation), scrolls section two into view, then asserts:

| Check | Result |
| ----- | ------ |
| Page does not scroll horizontally | pass |
| Nav does not overflow its content box | pass |
| Headline glyphs ∩ money | 0 |
| Nav box ∩ money | 0 |
| No money boxes off-screen | pass |
| All money + vault + logo images loaded | pass |
| Get Started visible at every width | pass |
| Section two reveals all fire (4/4) | pass |
| Phone headline never orphans (always 2 lines) | pass |
| Phone on the left at `lg`+, uncropped at 1440×900 | pass |
| Toasts hidden below `sm` | pass |
| Right column top-aligned with the phone at `lg`+ | pass |
| Vault sits above the steps (no overlap) | pass |
| Nav stays pinned + bar'd on scroll and at page bottom | pass |
| Footer visible at the page bottom | pass |
| Page scrolls vertically (hero → section two) | pass |
| Console / page errors | 0 |

This is what caught the nav grazing money instance 6 at 1024/1280 (the navbar is
~94px tall, so a percentage position that clears it at 720px height sits too low
at 1024px — hence the fixed `top-[108px]`).

The harness is a scratch tool, not committed — the browser path is machine
specific. `npm run verify` is the committed, portable regression gate.

## The dashboard

Mounted at `/app/*` by `src/App.jsx`; the tree lives in
`src/dashboard/DashboardRoutes.jsx` under a single layout route
(`layout/DashboardLayout.jsx`).

```
/dashboard           → redirects to /app (friendly alias)
/app                 DashboardHome   — six cards, cycles, recent ledger
/app/cycles          CyclesPage
/app/ledger          LedgerPage      — All / Ajo / Goods filter
/app/notifications   NotificationsPage
/app/profile         ProfilePage
/app/goods           GoodsHome       — flag-gated
/app/goods/new       GoodsHome       — opens the create modal
/app/goods/:id       GoodsTargetDetail
```

`DashboardLayout` renders a fixed 248px sidebar at `lg`+ and a slide-over drawer
below it, plus a sticky topbar with the page title (derived from the path), a
notification bell with an unread count, and the member's initials. A route change
scrolls to the top and rewrites `document.title`.

The sidebar is built from `src/dashboard/navItems.js`, which is the single source
of truth for the nav, the drawer and the active state (`NavLink` gives
`aria-current="page"` for free). `DashboardHome` shows six cards in a
`1 / 2 / 3`-column grid: active cycles, total contributed, next payout, ledger
entries, account status and Ajo-to-Goods.

### UI primitives and data hooks

`src/dashboard/ui/index.jsx` holds the shared, dependency-free primitives —
`Button`, `Card`/`CardHeader`, `Chip`/`BetaChip`/`VerifiedBadge`, `StatCard`,
`ProgressBar`, `Banner`/`ErrorBanner`, `Skeleton`/`CardSkeleton`, `EmptyState`,
`Field`/`Input`/`Select`/`TextArea`, `Modal` and `Money`. Square corners
throughout except chips and avatars.

`src/dashboard/hooks/useData.js` wraps the async API in tiny hooks
(`useUser`, `useCycles`, `useLedger`, `useNotifications`, `useGoodsTargets`, …).
Each subscribes to the store's change bus via `useStoreVersion`, so any write
re-renders every dependent view without a state library.

## Ajo-to-Goods

An **optional, secondary** way to save toward physical goods. It is deliberately
kept apart from Ajo cycle money:

- **Separate pool.** Goods savings never enter a cycle, and cycle money never pays
  a vendor. The goods ledger is its own set of entries.
- **No organizer.** There is no organizer-facing goods surface at all — organizers
  have no role here.
- **Catalog-only vendors.** Vendors come from an approved, verified catalog. No UI
  or API path accepts a free-text vendor or a member-typed payout account.
- **Member-only confirmation.** Only the member can confirm an order.

### The flag

```js
// src/config/features.js
export const FEATURES = { ajoToGoods: true };
```

Flip it to `false` and the sidebar item, the `/app/goods/*` routes and the
dashboard card all disappear — `navItems.js` drops the item, `DashboardRoutes.jsx`
swaps the routes for a redirect to `/app`, and `DashboardHome` omits the card.
There is no other code path that can show the feature.

### Vendor catalog (seeded)

Four verified vendors, each with 2–4 catalog items and integer-kobo prices:

| Vendor                      | City   | Example items                                 |
| --------------------------- | ------ | --------------------------------------------- |
| Mama Nkechi Foodstuff Hub   | Lagos  | 50kg rice, 25L groundnut oil, yam tubers      |
| Lagos Kitchen Depot         | Lagos  | gas cooker, blender, pressure cooker          |
| Homefront Appliances        | Abuja  | rechargeable lamp, standing fan, water dispenser |
| Naija Home Essentials       | Ibadan | storage drums, gas cylinder, cookware set     |

### Workflow

```
SAVING → TARGET_REACHED → MEMBER_CONFIRMED → VENDOR_NOTIFIED → VENDOR_ACCEPTED → FULFILLED
                                                                              ↘ CANCELLED → REFUNDED
```

Transitions are whitelisted in `GOODS_TRANSITIONS`; the service rejects anything
else with a clear error. `CANCELLED` and `MEMBER_CONFIRMED` are transient — the
API walks through `MEMBER_CONFIRMED → VENDOR_NOTIFIED` in one call, and a member
cannot park a target in either. `CANCELLABLE_STATES` is
`{ SAVING, PAUSED, TARGET_REACHED }`.

The vendor's acceptance is simulated: after the member confirms, the browser
schedules `acceptVendorOffer(id)` a couple of seconds later. It is exported so the
Node tests can drive it deterministically.

### Ledger types

Three goods entry types extend the ledger, all appended through the balanced
`writeTx` helper (`isBalanced`, integer kobo, append-only — corrections are new
entries, never edits):

| Type           | When                                  | Tag     |
| -------------- | ------------------------------------- | ------- |
| `GOODS_SAVING` | a contribution to a target            | `Goods` |
| `GOODS_PAYOUT` | the vendor is paid on fulfilment      | `Goods` |
| `GOODS_REFUND` | a cancelled target is compensated     | `Goods` |

Goods entries show in the main Ledger with a **Goods** tag; the filter is
All / Ajo / Goods.

### Copy rules

The feature is always named with a **BETA** chip — in the sidebar, on the goods
home, and on the dashboard card. Compliance wording stays neutral: cancellation
says *"Saved funds return to your payout account after review"* and never uses
"withdraw", "cash out" or "instant". The delivery note is free text capped at 200
characters; the payout destination is always read-only copy — *"Paid to {vendor}'s
verified account"*.

## Project structure

```
ajo-secure/
├── index.html               # Vite entry, font <link>s, title "Ajo Secure"
├── vite.config.js           # React + Tailwind plugins
├── eslint.config.js         # Flat ESLint config
├── package.json
├── scripts/
│   ├── optimize-images.mjs  # PNG → WebP (resize + cut-out + crop)
│   ├── verify-hero.mjs      # Landing SSR DOM-contract assertions (103)
│   └── verify-goods.mjs     # Ajo-to-Goods service-contract assertions (69)
└── src/
    ├── main.jsx             # React root + <BrowserRouter>
    ├── App.jsx              # Router: "/" landing, "/app/*" dashboard, /dashboard alias
    ├── config/
    │   └── features.js      # FEATURES.ajoToGoods flag
    ├── services/
    │   ├── mockDb.js        # Seeded store, ledger primitives, state tables
    │   └── api.js           # All reads/writes (JSDoc future endpoints)
    ├── pages/
    │   └── LandingPage.jsx  # <Hero/> + <SectionTwo/> + <SectionFour/> + <Footer/>
    ├── dashboard/
    │   ├── DashboardRoutes.jsx
    │   ├── navItems.js      # Sidebar source of truth (flag-aware)
    │   ├── layout/          # Sidebar.jsx, DashboardLayout.jsx
    │   ├── ui/index.jsx     # Shared primitives
    │   ├── hooks/useData.js # Store subscriptions
    │   ├── components/goods/# CreateTargetModal, WorkflowStepper, goodsMeta
    │   └── pages/           # DashboardHome, Cycles, Ledger, Notifications,
    │                        # Profile, goods/GoodsHome, goods/GoodsTargetDetail
    ├── assets/              # Optimized WebP (generated)
    ├── images/              # Original PNGs — gitignored, 24 MB
    ├── components/
    │   ├── Hero.jsx         # Section 1 + pinned Nav, FloatingMoney, GridLines
    │   ├── SectionTwo.jsx   # Section 2 (phone, header, vault, steps)
    │   ├── SectionFour.jsx  # Section 4 (light features band, six cards)
    │   ├── Footer.jsx       # Landing footer (brand, links, contact, legal)
    │   ├── HowItWorks.jsx   # ─┐ retained, not rendered
    │   ├── Sections.jsx     #  │
    │   └── Reveal.jsx       # ─┘
    ├── hooks/
    │   └── useReveal.js     # ── retained, not rendered
    └── styles/
        └── index.css        # Tailwind import + @theme + keyframes + reveal/float
```

The nav lives **inside `Hero.jsx`** rather than in its own component: it is part
of the hero's composition. It is `fixed`, so it outlives the hero's `overflow:
hidden` and stays visible down the page (an ancestor only clips a fixed
descendant if it establishes a containing block via `transform`/`filter` — the
hero has neither).

## Not currently rendered

`App.jsx` is a router. `/` renders `LandingPage` (`<Hero />`, `<SectionTwo />`,
`<SectionFour />`, `<Footer />`), `/dashboard` redirects to `/app`, and `/app/*`
renders the dashboard. The following files remain on
disk but are **not imported anywhere**:

- `src/components/HowItWorks.jsx`
- `src/components/Sections.jsx` (StatBand, Features, TrustSafety, Fees, CTA, Footer)
- `src/components/Reveal.jsx` + `src/hooks/useReveal.js`

They still build cleanly against the legacy token aliases in `@theme`, so they
can be re-mounted by importing them in `App.jsx`. Delete them if you don't want
them back.

## Notes on the setup

**Tailwind 4 has no `tailwind.config.js`.** Tokens are CSS custom properties in
an `@theme` block at the top of `src/styles/index.css`; the framework is wired up
through `@tailwindcss/vite` in `vite.config.js`. Custom `@keyframes` and the
`anim-*` / `money-float` / `reveal` / `float-y` / `pulse-dot` / `bar-fill` /
`.site-nav` rules
are written as plain CSS (no `@layer`) so they are never tree-shaken and never need
a safelist.

**Globals — and a cascade trap.** `* { margin:0; padding:0; box-sizing:border-box }`
is kept, and `body { background:#020817; overflow-x:hidden }`. Every spacing
value is explicit, so the layout does not depend on user-agent defaults.

That reset **must** live inside `@layer base`. Tailwind 4 emits its utilities
into `@layer utilities`, and *unlayered author CSS beats layered CSS regardless
of specificity*. An unlayered `* { padding: 0 }` therefore silently overrides
every `px-*` / `py-*` utility and every `margin: auto`, with no error and no
visual clue until you measure: the nav loses its 35px gutter, `justify-between`
stops pushing the button right, and the CTA loses its padding. `base` is ordered
before `utilities`, so the reset still applies globally while utilities win.
The `@theme` block and the custom animation classes are intentionally left
unlayered (they *should* outrank utilities), and `@keyframes` is unaffected by
layers.

**`prefers-reduced-motion`.** `.money-float`, `.float-y` and `.pulse-dot` get
`animation: none`; `.reveal` is forced to `opacity: 1` so content can never stay
hidden; `.bar-fill` snaps to its final width; every `anim-*` entrance drops to
a 0.01ms duration with 0 delay; and the nav bar keeps its scrolled state but
snaps instead of fading.

**No component state on the landing page.** The hero and the footer have none; the
nav's pinned-bar toggle and the section-two reveal are each a ref plus a
`classList` / `IntersectionObserver` toggle. The parallax uses refs +
`requestAnimationFrame`. (The dashboard, by contrast, is a normal React app with
hooks and local state.)

**Corner radii.** The landing page is square-cornered except the section-two
phone mockup (`rounded-[40px]` frame / `rounded-[30px]` screen / `rounded-full`
notch) and the pill glow behind it. The dashboard keeps the same square
language: action buttons take a `rounded-[2px]` token (filter chips / tabs stay
`rounded-full`), and buttons with a surface are **elevated** — a light top edge
plus a drop shadow, or a blue glow on the accent variant, because a plain black
shadow is invisible on `#020817`.

## Deploying

`npm run build` emits a static site to `dist/`. Drop it on any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3). No server runtime needed.
