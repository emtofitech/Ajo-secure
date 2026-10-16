# Ajo Secure — landing

A two-section landing page for the Ajo Secure platform: community rotating
savings (Ajo/Esusu) where the organizer coordinates the group but never holds or
redirects the pooled money.

Built with **React 18 + Vite 6 + Tailwind CSS 4**.

> The page is **two `<section>`s**: the full-viewport hero (`h-screen`,
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
| Muted text       | `text-white/50`            | Feature descriptions                    |
| Grid line        | `bg-white/[0.05]`          | Hero + section-two grid motif           |
| Plus mark        | `bg-white/70`              | Hero intersections                      |
| Feature border   | `border-[#5AB0FF]/40`      | Left rule on each feature block         |
| Phone frame      | `border-white/30` on `#050f24` | Section-two phone mockup            |

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
| Section 2  | `px-5 md:px-[35px]` (inner `max-w-[1280px]`)   |

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
from the hero. The info card, the three feature blocks and the CTA now live in
section two.

The hero keeps: the navbar, the `<h1>` `Save Together. Get Paid Securely.`, the
blue glow background, the grid lines and plus marks, and the floating money.

### Navbar

`absolute top-0 left-0 w-full z-20 flex items-center justify-between px-5
md:px-[35px] py-5 md:py-[27px]`.

- **Left** — a link to `#` holding the logo mark (`h-[28px] md:h-[32px] w-auto`)
  and the wordmark **`AjoSecure`** (`font-graphik text-white text-[18px]
  md:text-[21px] leading-[21px] whitespace-nowrap`). Both use `anim-fade-up`
  at 200ms.
- **Right** — a **Get Started** button (`bg-[#5AB0FF] hover:bg-[#8CC8FF]
  text-black`, square corners, `anim-slide-right` at 500ms) linking to
  `#get-started`. Shown at **every** breakpoint.

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
overflow-hidden">`, with a faint blue radial glow and the same
`bg-white/[0.05]` grid-line motif as the hero. Inner wrapper:
`max-w-[1280px] mx-auto px-5 md:px-[35px] py-[80px] md:py-[120px] grid
grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[64px] items-center`.

### Left column — CSS-only phone

A pure-CSS phone frame (no image): `w-[260px] sm:w-[300px] h-[520px]
sm:h-[600px] rounded-[40px] border border-white/30 bg-[#050f24]` with a
`shadow-[0_30px_80px_rgba(37,99,235,0.35)]`, a centred black notch
(`w-[90px] h-[22px] rounded-full`), and an inset screen
(`inset-[12px] rounded-[30px] p-[24px]`) over a blue gradient
(`#0b2a66 → #0a1d4a → #020817`). The screen repeats the headline with
"Securely." in accent blue. A soft blue glow sits behind the phone, and the
whole frame drifts ±10px on a 7s loop (`.phone-float`). On mobile it stacks
first, centred; at `lg` it sits on the left.

### Right column — vault, features, CTA, card

A `flex flex-col gap-[28px]` stack:

1. **Vault image** — `w-full max-w-[420px] h-auto` with a blue drop-shadow and a
   slow float (`.float-slow`).
2. **Three feature blocks** — `[ CONTRIBUTE ]`, `[ LEDGER ]`, `[ PAYOUT ]`, each
   with `border-l border-[#5AB0FF]/40 pl-[16px]`, a white 13px title and a
   `text-white/50` description.
3. **CTA** — `id="get-started"`, `bg-[#5AB0FF] hover:bg-[#8CC8FF] px-[20px]
   py-[12px] inline-flex items-center gap-[10px]`, square corners, `✦` + `START
   AN AJO GROUP`. This is the target of the nav's Get Started button.
4. **Info card** — the `NOT A WALLET — A SECURE LEDGER` badge over the chamfered
   SVG-border card (viewBox `0 0 280 168`, `preserveAspectRatio="none"`,
   `max-w-[360px]`), the pooled-funds paragraph, and the `VIEW_FEE_BREAKDOWN` link.

### Scroll reveal

One `IntersectionObserver` on the section root adds `.is-visible`; the CSS then
plays the same `fadeUp` keyframes on every `.reveal` descendant, staggered via
`--reveal-delay` (0 → 600ms in 100ms steps: phone, vault, three features, CTA,
card). **No component state is involved** — a ref plus a class toggle. If
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
| `vault`      | 1254×1254 · 1.3 MB | 900×900 · 20 KB    | white background cut out       |
| `logo`       | 1254×1254 · 1.0 MB | 253×256 · 13 KB    | white cut out, cropped to crest |

> `logo.png` is a **stacked lockup** (crest over a wordmark). At the nav's 32px
> height the baked-in wordmark would be an illegible smudge next to the separate
> `AjoSecure` text, so the optimizer crops to the largest connected shape — the
> crest. `logo.png` and `vault.png` have **no alpha**; the optimizer flood-fills
> their near-white background to transparent from the borders inward (interior
> whites are kept).

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
| `npm run verify`          | SSR-render both sections and assert the DOM contract |
| `npm run optimize:images` | PNG → WebP (resize, white cut-out, logo crop)       |

Requires Node 18+ (developed on Node 22).

### `npm run verify`

`scripts/verify-hero.mjs` renders `Hero.jsx`, `SectionTwo.jsx` and `App.jsx`
through Vite's SSR pipeline and asserts the DOM contract — element counts, the 8
money instances and their CSS variables, the 8 plus marks, the removed
hero elements staying removed, the nav's logo/wordmark/Get Started, the section
two phone/features/CTA/card, the 7 reveal targets and their stagger, the
`@layer base` cascade fix, and the reduced-motion coverage (**66 assertions**).

```bash
npm run verify    # exits non-zero on any failure
```

It catches structure and regression bugs, **not** visual ones — text
overlapping artwork and image cropping still need an eye on the page.

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
| Section two reveals all fire (7/7) | pass |
| Phone is on the left at `lg`+ | pass |
| Page scrolls vertically (hero → section two) | pass |
| Console / page errors | 0 |

This is what caught the nav grazing money instance 6 at 1024/1280 (the navbar is
~94px tall, so a percentage position that clears it at 720px height sits too low
at 1024px — hence the fixed `top-[108px]`).

The harness is a scratch tool, not committed — the browser path is machine
specific. `npm run verify` is the committed, portable regression gate.

## Project structure

```
ajo-secure/
├── index.html               # Vite entry, font <link>s, title "Ajo Secure"
├── vite.config.js           # React + Tailwind plugins
├── eslint.config.js         # Flat ESLint config
├── package.json
├── scripts/
│   ├── optimize-images.mjs  # PNG → WebP (resize + cut-out + crop)
│   └── verify-hero.mjs      # SSR DOM-contract assertions
└── src/
    ├── main.jsx             # React root
    ├── App.jsx              # Renders <Hero /> then <SectionTwo />
    ├── assets/              # Optimized WebP (generated)
    ├── images/              # Original PNGs — gitignored, 24 MB
    ├── components/
    │   ├── Hero.jsx         # Section 1 + Nav, FloatingMoney, GridLines
    │   ├── SectionTwo.jsx   # Section 2 (phone, vault, features, CTA, card)
    │   ├── HowItWorks.jsx   # ─┐ retained, not rendered
    │   ├── Sections.jsx     #  │
    │   └── Reveal.jsx       # ─┘
    ├── hooks/
    │   └── useReveal.js     # ── retained, not rendered
    └── styles/
        └── index.css        # Tailwind import + @theme + keyframes + reveal/float
```

The nav lives **inside `Hero.jsx`** rather than in its own component: it is part
of the hero's composition and needs the hero's backdrop.

## Not currently rendered

`App.jsx` renders `<Hero />` then `<SectionTwo />`. The following files remain
on disk but are **not imported anywhere**:

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
`anim-*` / `money-float` / `reveal` / `float-slow` / `phone-float` classes are
written as plain CSS (no `@layer`) so they are never tree-shaken and never need a
safelist.

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

**`prefers-reduced-motion`.** `.money-float`, `.float-slow` and `.phone-float`
get `animation: none`; `.reveal` is forced to `opacity: 1` so content can never
stay hidden; and every `anim-*` entrance drops to a 0.01ms duration with 0 delay.

**No component state.** The hero has none; the section-two reveal is a ref plus
an `IntersectionObserver` class toggle. The parallax uses refs + `requestAnimationFrame`.

**Corner radii.** Everything is square-cornered except the section-two phone
mockup (`rounded-[40px]` frame / `rounded-[30px]` screen / `rounded-full` notch)
and the pill glow behind it.

## Deploying

`npm run build` emits a static site to `dist/`. Drop it on any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3). No server runtime needed.
