# Ajo Secure — Landing Page

A landing page for the Ajo Secure platform: community savings, safeguarded.
Built with **React 18 + Vite 6 + Tailwind CSS 4**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

| Script           | What it does                                        |
| ---------------- | --------------------------------------------------- |
| `npm run dev`    | Dev server with hot module replacement               |
| `npm start`      | Alias for `dev`                                      |
| `npm run build`  | Production build into `dist/`                        |
| `npm run preview`| Serve the production build locally                   |
| `npm run lint`   | ESLint (includes the React Hooks rules)              |

Requires Node 18+ (developed on Node 22).

## Project structure

```
ajo-secure/
├── index.html               # Vite entry point (HTML lives at the root, not in public/)
├── vite.config.js           # React + Tailwind plugins, dev server + build options
├── eslint.config.js         # Flat ESLint config
├── package.json
└── src/
    ├── main.jsx             # React root
    ├── App.jsx              # Page composition
    ├── components/
    │   ├── Navbar.jsx       # Fixed nav with mobile menu + scroll-hide
    │   ├── Hero.jsx         # Hero with phone mockup
    │   ├── HowItWorks.jsx   # 4-step process + payout engine log
    │   ├── Sections.jsx     # StatBand, Features, TrustSafety, Fees, CTA, Footer
    │   └── Reveal.jsx       # Scroll-reveal wrapper (see note below)
    ├── hooks/
    │   └── useReveal.js     # IntersectionObserver scroll reveal hook
    └── styles/
        └── index.css        # Tailwind import + @theme tokens + component classes
```

## Notes on the setup

**Tailwind 4 has no `tailwind.config.js`.** Design tokens are declared as CSS
custom properties inside an `@theme` block at the top of `src/styles/index.css`,
and the framework is wired in through the `@tailwindcss/vite` plugin in
`vite.config.js`. Adding or changing a color means editing `@theme` — not a JS
config file.

**`Reveal` exists because of the Rules of Hooks.** `useReveal` must be called
unconditionally at the top level of a component. The earlier version of this page
called it inside `.map()` callbacks, which ESLint correctly rejects:

> React Hook "useReveal" cannot be called inside a callback.

`Reveal` wraps the hook in a component so each list item gets its own observer.
It accepts `as` (element type), `delay` (ms, for staggering), plus normal
`className` / `style` passthrough:

```jsx
{items.map((item, i) => (
  <Reveal key={item.id} delay={i * 80} className="card">
    {item.label}
  </Reveal>
))}
```

## Sections

1. **Navbar** — fixed, blur backdrop, hides on scroll-down, mobile menu
2. **Hero** — headline, CTAs, phone mockup with live group dashboard
3. **How It Works** — 4-step process with payout engine log panel
4. **Stat Band** — 4 trust metrics
5. **Features** — 6 cards (immutable ledger, auto payout, reliability score, …)
6. **Trust & Safety** — progressive trust levels + security checklist
7. **Fees** — transparent fee breakdown
8. **CTA** — final call to action
9. **Footer** — links + legal notice

## Design tokens

Defined in the `@theme` block of `src/styles/index.css`.

| Token     | Value     | Use                   |
| --------- | --------- | --------------------- |
| `forest`  | `#0D2B1F` | Primary dark green    |
| `fdeep`   | `#08180F` | Deepest green         |
| `fmid`    | `#2A5C3F` | Mid green             |
| `flight`  | `#3D7A56` | Light green           |
| `gold`    | `#C9912A` | Accent / CTAs         |
| `goldlt`  | `#E8B860` | Light gold highlight  |
| `stone`   | `#8C7B6B` | Body / secondary text |
| `cream`   | `#F7F4EE` | Light backgrounds     |
| `offwhite`| `#FDFCF9` | Page background       |

Fonts are loaded in `index.html`: **Fraunces** (serif display) and **Inter** (body).

## Deploying

`npm run build` emits a static site to `dist/`. Drop it on any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3). No server runtime needed.
