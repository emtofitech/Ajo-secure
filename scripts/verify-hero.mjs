import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import fs from "node:fs";

const server = await createServer({
  root: process.cwd(),
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

let pass = 0;
let fail = 0;
const check = (label, cond) => {
  if (cond) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}`);
  }
};

try {
  const heroMod = await server.ssrLoadModule("/src/components/Hero.jsx");
  const twoMod = await server.ssrLoadModule("/src/components/SectionTwo.jsx");
  const fourMod = await server.ssrLoadModule("/src/components/SectionFour.jsx");
  const appMod = await server.ssrLoadModule("/src/pages/LandingPage.jsx");

  const hero = renderToStaticMarkup(React.createElement(heroMod.default));
  const two = renderToStaticMarkup(React.createElement(twoMod.default));
  const four = renderToStaticMarkup(React.createElement(fourMod.default));
  /* The landing composition — exactly what the `/` route renders. Rendering it
     directly keeps this gate free of the router's SSR interop concerns. */
  const app = renderToStaticMarkup(React.createElement(appMod.default));

  const count = (html, re) => (html.match(re) || []).length;

  /* ── HERO: structure ── */
  console.log("\n=== hero: structure ===");
  check("hero has one <section>", count(hero, /<section\b/g) === 1);
  check("hero is h-screen + overflow-hidden", /class="[^"]*h-screen[^"]*"/.test(hero) && hero.includes("overflow-hidden"));
  check("hero bg-[#020817]", hero.includes("bg-[#020817]"));
  check("hero has exactly one <h1>", count(hero, /<h1\b/g) === 1);
  check(
    "hero h1 copy on two lines w/ deep-blue accent word",
    hero.includes(">Save Together.</span>") &&
      hero.includes('class="block">Get Paid <span class="text-[#2563EB]">Securely.</span>'),
  );
  check("hero has no <video>", count(hero, /<video\b/g) === 0);
  check("hero has no <svg> (connectors removed)", count(hero, /<svg\b/g) === 0);

  /* ── HERO: sub-copy + actions ── */
  console.log("\n=== hero: sub-copy + actions ===");
  check(
    "sub-copy sits under the H1",
    hero.includes("Ajo Secure brings the Ajo tradition into a structured, automated platform.") &&
      hero.indexOf("Save Together.") < hero.indexOf("Ajo Secure brings the Ajo tradition"),
  );
  check(
    "sub-copy is smaller than the H1 (13/14.5px vs 30/42/56px)",
    /class="[^"]*text-\[13px\][^"]*sm:text-\[14\.5px\]/.test(hero) && hero.includes("text-[30px] sm:text-[42px] md:text-[56px]"),
  );
  check("H1 + sub-copy share one positioned block", hero.includes("data-hero-copy"));
  check(
    "Start a group + Join a group actions",
    hero.includes(">Start a group</a>") && hero.includes(">Join a group</a>"),
  );
  check(
    "hero actions are in-page anchors (landing page)",
    count(hero, /href="#how-it-works"/g) === 2,
  );
  check(
    "nav Get Started enters the dashboard",
    /<a\s+href="\/app"/.test(hero) && hero.includes(">Get Started</a>"),
  );

  /* ── HERO: removals ── */
  console.log("\n=== hero: removed elements ===");
  check("no node labels", !/CONTRIBUTE|LEDGER|PAYOUT/.test(hero));
  check("no connector <line>", count(hero, /<line\b/g) === 0);
  check("no bottom-row CTA", !hero.includes("START AN AJO GROUP"));
  check("no info card / badge", !hero.includes("NOT A WALLET") && !hero.includes("VIEW_FEE_BREAKDOWN"));
  check("no wallet strip", !/LAGOS_TRADERS|\[ VERIFIED \]|AJO_STAR|STATUS:/.test(hero));
  check("no numbered nav links", !/HOW_IT_WORKS|AJO_STAR|>FEES<|>SECURITY</.test(hero));
  check("no hamburger / button", count(hero, /<button\b/g) === 0 && !hero.includes("Toggle menu"));
  check("no mobile menu overlay", !hero.includes("backdrop-blur-md"));

  /* ── HERO: nav ── */
  console.log("\n=== hero: nav ===");
  check("nav uses justify-between gutter", hero.includes("justify-between px-5 md:px-[35px] py-5 md:py-[27px]"));
  check("logo image present w/ alt", /<img[^>]*alt="Ajo Secure logo"/.test(hero) && /src="[^"]*logo[^"]*"/.test(hero));
  check("logo sized h-[28px] md:h-[32px]", hero.includes("h-[28px] md:h-[32px] w-auto"));
  check("wordmark AjoSecure", hero.includes(">AjoSecure</span>"));
  check("Get Started button", hero.includes(">Get Started</a>"));
  check("Get Started square + accent", /bg-\[#5AB0FF\][^"]*px-\[16px\] md:px-\[20px\] py-\[10px\]/.test(hero));
  check("nav pinned to viewport on scroll", hero.includes("site-nav fixed top-0 left-0 w-full z-50") && hero.includes('href="/app"'));
  check("nav has no numbered links", !hero.includes("01.") && !hero.includes("xl:gap-[40px]"));

  /* ── HERO: money ── */
  console.log("\n=== hero: floating money ===");
  check("8 money images", count(hero, /money-float/g) === 8);
  check("all 8 money imgs alt=\"\"", count(hero, /<img[^>]*alt=""/g) === 8);
  check("all 8 money imgs aria-hidden", count(hero, /aria-hidden="true"[^>]*money-float/g) + count(hero, /money-float[^>]*aria-hidden="true"/g) === 8);
  check("all 8 draggable=false", count(hero, /draggable="false"/g) === 8);
  check("both loop classes", hero.includes("money-float a") && hero.includes("money-float b"));
  check("money layer is pointer-events-none", /class="[^"]*pointer-events-none overflow-hidden"[^>]*aria-hidden="true"/.test(hero));
  check("3 money visible on mobile (5 sit behind sm:)", count(hero, /hidden sm:block/g) === 5);
  check(
    "big money pushed right/centre",
    hero.includes("sm:top-[19%]") &&
      hero.includes("sm:top-[46%] sm:right-[6%]") &&
      hero.includes("bottom-[6%] right-[3%]"),
  );
  check(
    "money keeps clear of the copy band (mobile bottom band + sm: right edge)",
    count(hero, /sm:bottom-auto/g) === 2 && count(hero, /sm:left-auto/g) === 1,
  );
  check("no money above the nav band", !/top-\[(?:[0-9]|1[0-1])%\]/.test(hero));

  /* ── HERO: grid ── */
  console.log("\n=== hero: grid ===");
  check("4 vertical grid lines", count(hero, /anim-grid-v/g) === 4);
  check("2 horizontal grid lines", count(hero, /anim-grid-h/g) === 2);
  check("plus marks (16 strokes)", count(hero, /bg-white\/70/g) === 16);

  /* ── SECTION TWO ── */
  console.log("\n=== section two ===");
  check("section id=how-it-works", /<section[^>]*id="how-it-works"/.test(two));
  check("min-h-screen + overflow-hidden + seam", two.includes("min-h-screen") && two.includes("overflow-hidden") && two.includes("border-t border-white/10"));
  check("inner grid 5fr/6fr, max-w-[1280px]", two.includes("max-w-[1280px]") && two.includes("lg:grid-cols-[5fr_6fr]"));
  check("top padding after hero (pt-10)", two.includes("px-5 md:px-[35px] pt-10 pb-[80px] md:pb-[120px]"));
  check("grid-line motif present", count(two, /bg-white\/\[0\.05\]/g) === 6);
  check("phone frame", two.includes("w-[280px] sm:w-[300px] h-[600px]") && two.includes("rounded-[40px]") && two.includes("border-white/25") && two.includes("bg-[#050f24]"));
  check("phone is role=img w/ aria-label", /role="img"[^>]*aria-label="Ajo Secure app preview/.test(two));
  check("phone notch", two.includes("w-[90px] h-[22px] rounded-full bg-black"));
  check("phone screen gradient + padding", two.includes("inset-[12px] rounded-[30px]") && two.includes("from-[#0b2a66] via-[#0a1d4a] to-[#020817]") && two.includes("pt-[44px] pb-[20px]"));
  check("phone headline forced onto 2 lines", count(two, /block whitespace-nowrap/g) === 2 && two.includes("Save Together.") && two.includes("Get Paid "));
  check("group card", two.includes("Lagos Traders") && two.includes("CYCLE 4 / 20") && two.includes("17 of 20 members paid"));
  check("count-up target + initial value", /data-countup="1000000"/.test(two) && two.includes("₦1,000,000"));
  check("progress bar fill", two.includes("bar-fill") && two.includes("--fill:0.85"));
  check("recipient row", two.includes("Adaeze O.") && two.includes("KYC verified") && two.includes(">AO<"));
  check("phone fee lines", two.includes("Organizer fee 0.5%") && two.includes("−₦5,000") && two.includes("Platform fee 0.1%") && two.includes("Recipient receives") && two.includes("₦994,000"));
  check("status pill + pulsing dot", two.includes("pulse-dot") && two.includes("FUNDING · 3 pending"));
  check("two floating toasts", count(two, /hidden sm:flex float-y/g) === 2 && two.includes("Ada paid ₦50,000") && two.includes("Payout locked to verified account"));
  check("eyebrow + h2", two.includes("HOW_IT_WORKS") && !two.includes("[ HOW_IT_WORKS ]") && two.includes("Ajo that runs on rules,") && two.includes("not on trust."));
  check("h2 subcopy", two.includes("Members contribute on schedule"));
  check("vault alt + float + shadow", /<img[^>]*alt="Blue steel vault"/.test(two) && two.includes("float-y drop-shadow-[0_20px_50px_rgba(37,99,235,0.5)]"));
  check("vault clip fallback", two.includes("inset(0 0 6% 0)"));
  check("vault floor glow", two.includes("bottom-[-6px] w-[70%] h-[14px] bg-[#2563EB]/40"));
  check("three step squares", count(two, /border border-\[#5AB0FF\]\/60/g) === 3);
  check("step numbers + titles", two.includes(">01.<") && two.includes(">02.<") && two.includes(">03.<") && two.includes(">CONTRIBUTE<") && two.includes(">LEDGER<") && two.includes(">PAYOUT<"));
  check("step titles are unbracketed", !/\[ (CONTRIBUTE|LEDGER|PAYOUT) \]/.test(two));
  check("vault sits after the subcopy, before the steps", two.indexOf("Members contribute on schedule") < two.indexOf('alt="Blue steel vault"') && two.indexOf('alt="Blue steel vault"') < two.indexOf(">01.<"));
  check("columns are top-aligned with the phone", two.includes("lg:grid-cols-[5fr_6fr] gap-[56px] lg:gap-[72px] items-start"));
  check("no CTA row / trust items / fee card", ["START AN AJO GROUP", "Regulated payments", "Verified payouts", "Full audit trail", "NOT A WALLET", "VIEW_FEE_BREAKDOWN", "20 members × ₦50,000", "Organizer fee (0.5%)", "0.6% in fees", "Example for illustration."].every((s) => !two.includes(s)));
  check("step secondary lines", ["Reminders arrive by in-app, SMS and WhatsApp.", "Settled entries never change. Corrections are new, visible entries.", "Releases only when the cycle is fully funded and the recipient is verified."].every((s) => two.includes(s)));
  check("step connector lines", count(two, /anim-grid-v/g) === 2);
  check("step row hover", count(two, /hover:translate-x-\[4px\]/g) === 3);
  check("no chamfered fee card (polygon)", !two.includes("polygon(0 0,100% 0,100% 100%,30px 100%,0 calc(100% - 30px))"));

  console.log("\n=== section two: reveal ===");
  check("4 reveal blocks", count(two, /class="reveal/g) === 4);
  check("stagger is inline animation-delay, 120ms steps", ["0ms", "120ms", "240ms", "360ms"].every((d) => two.includes(`animation-delay:${d}`)));
  check("reveal unchanged to --reveal-delay removal", count(two, /--reveal-delay/g) === 0);

  /* ── SECTION FOUR (light features band) ── */
  console.log("\n=== section four ===");
  check("section id=features", /<section[^>]*id="features"/.test(four));
  check("section four bg #FDFCF9", four.includes("bg-[#FDFCF9]"));
  check("headings blue #2563EB", four.includes("2563EB"));
  check("body copy brown #8C7B6B", four.includes("8C7B6B"));
  check(
    "section four heading copy",
    four.includes("Built so the platform does the job, not a person.") &&
      four.includes("Every feature exists to remove the single point of human failure from a traditional Ajo."),
  );
  check("six white cards", count(four, /reveal bg-white border/g) === 6);
  check(
    "six feature titles",
    [
      "Immutable ledger",
      "Automated payout engine",
      "Ajo Reliability Score",
      "Live contribution dashboard",
      "Transparent fee structure",
      "No admin withdrawal",
    ].every((t) => four.includes(t)),
  );
  check(
    "six feature bodies",
    [
      "Every financial event creates a permanent ledger entry.",
      "the engine instructs your regulated financial partner directly.",
      "Not a credit bureau score, but a transparent record.",
      "visible to every member in real time.",
      "Fees lock for the cycle — no surprises mid-way.",
      "no pathway for an admin to withdraw or redirect pooled member funds.",
    ].every((s) => four.includes(s)),
  );
  check("cards stagger via reveal + inline delay", count(four, /class="reveal bg-white border/g) === 6 && count(four, /animation-delay:/g) === 7);

  /* ── APP ── */
  console.log("\n=== app ===");
  check("app renders three sections", count(app, /<section\b/g) === 3);
  check("app renders hero + section two + section four", app.includes("Save Together") && app.includes('id="how-it-works"') && app.includes('id="features"'));
  check(
    "landing order hero → how-it-works → features → footer",
    app.indexOf("Save Together") < app.indexOf('id="how-it-works"') &&
      app.indexOf('id="how-it-works"') < app.indexOf('id="features"') &&
      app.indexOf('id="features"') < app.indexOf("<footer"),
  );
  check("app renders the footer", /<footer\b/.test(app) && app.includes("All rights reserved") && app.includes(">How it works</a>"));
  check("footer carries contact details", app.includes("emtofitechnologies@gmail.com") && app.includes("tel:+2347046483800") && app.includes("09012130382") && app.includes("08146587069"));

  /* The router shell itself: landing at `/`, dashboard under `/app`. */
  const appSource = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  check("app routes / to the landing page", appSource.includes('path="/"') && appSource.includes("LandingPage"));
  check("app mounts the dashboard under /app", appSource.includes('path="/app/*"') && appSource.includes("DashboardRoutes"));
  check("app aliases /dashboard onto the dashboard", appSource.includes('path="/dashboard/*"') && appSource.includes('to="/app"'));

  /* ── CSS cascade guard ── */
  console.log("\n=== css cascade ===");
  const css = fs.readFileSync("src/styles/index.css", "utf8");
  const baseAt = css.indexOf("@layer base");
  const resetAt = css.indexOf("* {\n    margin: 0");
  check("reset lives inside @layer base", baseAt !== -1 && resetAt !== -1 && baseAt < resetAt);
  check("body keeps overflow-x hidden", css.includes("overflow-x: hidden"));
  check("body does NOT set overflow: hidden", !/body\s*{[^}]*[^-]overflow:\s*hidden/.test(css));
  check("float-y keyframes + class", /@keyframes floatY/.test(css) && /\.float-y\s*{[^}]*floatY/.test(css));
  check("pulse-dot + bar-fill defined", /\.pulse-dot\s*{/.test(css) && /\.bar-fill\s*{/.test(css) && /\.is-visible \.bar-fill\s*{/.test(css));
  check("reveal hidden until is-visible", /\.reveal\s*{\s*opacity:\s*0/.test(css) && /\.is-visible \.reveal\s*{/.test(css));
  check("old phone-float / float-slow removed", !css.includes("phone-float") && !css.includes("float-slow"));
  check("site-nav pinned + scrolled bar", /\.site-nav\s*{[^}]*border-bottom/.test(css) && /\.site-nav\.is-scrolled\s*{[^}]*rgba\(2, 8, 23, 0\.85\)/.test(css));
  const rm = css.slice(css.indexOf("@media (prefers-reduced-motion"));
  check(
    "reduced-motion covers reveal + floaters + bar + nav",
    rm.includes(".money-float") && rm.includes(".reveal") && rm.includes(".float-y") && rm.includes(".pulse-dot") && rm.includes(".bar-fill") && rm.includes(".site-nav"),
  );
} finally {
  await server.close();
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
