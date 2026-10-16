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
  const appMod = await server.ssrLoadModule("/src/App.jsx");

  const hero = renderToStaticMarkup(React.createElement(heroMod.default));
  const two = renderToStaticMarkup(React.createElement(twoMod.default));
  const app = renderToStaticMarkup(React.createElement(appMod.default));

  const count = (html, re) => (html.match(re) || []).length;

  /* ── HERO: structure ── */
  console.log("\n=== hero: structure ===");
  check("hero has one <section>", count(hero, /<section\b/g) === 1);
  check("hero is h-screen + overflow-hidden", /class="[^"]*h-screen[^"]*"/.test(hero) && hero.includes("overflow-hidden"));
  check("hero bg-[#020817]", hero.includes("bg-[#020817]"));
  check("hero has exactly one <h1>", count(hero, /<h1\b/g) === 1);
  check("hero h1 copy", hero.includes("Save Together. Get Paid <span") && hero.includes("Securely."));
  check("hero has no <video>", count(hero, /<video\b/g) === 0);
  check("hero has no <svg> (connectors removed)", count(hero, /<svg\b/g) === 0);

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
  check("nav has no numbered links", !hero.includes("01.") && !hero.includes("xl:gap-[40px]"));

  /* ── HERO: money ── */
  console.log("\n=== hero: floating money ===");
  check("8 money images", count(hero, /money-float/g) === 8);
  check("all 8 money imgs alt=\"\"", count(hero, /<img[^>]*alt=""/g) === 8);
  check("all 8 money imgs aria-hidden", count(hero, /aria-hidden="true"[^>]*money-float/g) + count(hero, /money-float[^>]*aria-hidden="true"/g) === 8);
  check("all 8 draggable=false", count(hero, /draggable="false"/g) === 8);
  check("both loop classes", hero.includes("money-float a") && hero.includes("money-float b"));
  check("money layer is pointer-events-none", /class="[^"]*pointer-events-none overflow-hidden"[^>]*aria-hidden="true"/.test(hero));
  check("4 money visible on mobile (hideSm 5-8 only)", count(hero, /hidden sm:block/g) === 4);
  check("big money pushed right/centre", hero.includes("sm:top-[19%]") && hero.includes("right-[18%]") && hero.includes("bottom-[18%] left-[40%]"));
  check("no money above the nav band", !/top-\[(?:[0-9]|1[0-1])%\]/.test(hero));

  /* ── HERO: grid ── */
  console.log("\n=== hero: grid ===");
  check("4 vertical grid lines", count(hero, /anim-grid-v/g) === 4);
  check("2 horizontal grid lines", count(hero, /anim-grid-h/g) === 2);
  check("plus marks (16 strokes)", count(hero, /bg-white\/70/g) === 16);

  /* ── SECTION TWO ── */
  console.log("\n=== section two ===");
  check("section id=how-it-works", /<section[^>]*id="how-it-works"/.test(two));
  check("min-h-screen + overflow-hidden", two.includes("min-h-screen") && two.includes("overflow-hidden"));
  check("inner grid max-w-[1280px]", two.includes("max-w-[1280px]") && two.includes("grid-cols-1 lg:grid-cols-2"));
  check("gutter px-5 md:px-[35px]", two.includes("px-5 md:px-[35px] py-[80px] md:py-[120px]"));
  check("grid-line motif present", count(two, /bg-white\/\[0\.05\]/g) === 6);
  check("phone frame", two.includes("w-[260px] sm:w-[300px]") && two.includes("h-[520px] sm:h-[600px]") && two.includes("rounded-[40px]") && two.includes("bg-[#050f24]"));
  check("phone notch", two.includes("w-[90px] h-[22px] rounded-full bg-black"));
  check("phone screen gradient", two.includes("inset-[12px] rounded-[30px]") && two.includes("linear-gradient(150deg, #0b2a66"));
  check("phone copy", two.includes("Save Together. Get Paid <span") && two.includes("Securely."));
  check("phone float loop class", two.includes("phone-float"));
  check("vault image w/ alt", /<img[^>]*alt="A vault[^"]*"/.test(two) && /src="[^"]*vault[^"]*"/.test(two) && two.includes("max-w-[420px]"));
  check("vault float + drop-shadow", two.includes("float-slow") && two.includes("drop-shadow-[0_20px_50px_rgba(37,99,235,0.45)]"));
  check("three feature titles", two.includes("[ CONTRIBUTE ]") && two.includes("[ LEDGER ]") && two.includes("[ PAYOUT ]"));
  check("feature left border x3", count(two, /border-l border-\[#5AB0FF\]\/40 pl-\[16px\]/g) === 3);
  check("CTA id + copy", /id="get-started"/.test(two) && two.includes("START AN AJO GROUP"));
  check("CTA square + padding", two.includes("px-[20px] py-[12px] inline-flex items-center gap-[10px]"));
  check("CTA glyph", two.includes("&#10022;") || two.includes("\u2726"));
  check("badge copy", two.includes("NOT A WALLET — A SECURE LEDGER"));
  check("chamfer svg polygon", two.includes('points="0.5,0.5 279.5,0.5 279.5,167.5 30,167.5 0.5,137.5"') && two.includes('stroke="#5AB0FF"'));
  check("card paragraph copy", two.includes("Organizers coordinate the group") && two.includes("0.6% in fees"));
  check("fee link", two.includes(">VIEW_FEE_BREAKDOWN</a>"));

  console.log("\n=== section two: reveal ===");
  check("7 reveal targets", count(two, /class="reveal/g) === 7);
  check("staggered --reveal-delay", count(two, /--reveal-delay/g) === 7);
  check("delays step by 100ms", ["0ms", "100ms", "200ms", "300ms", "400ms", "500ms", "600ms"].every((d) => two.includes(`--reveal-delay:${d}`)));

  /* ── APP ── */
  console.log("\n=== app ===");
  check("app renders two sections", count(app, /<section\b/g) === 2);
  check("app renders hero + section two", app.includes("Save Together") && app.includes('id="how-it-works"'));

  /* ── CSS cascade guard ── */
  console.log("\n=== css cascade ===");
  const css = fs.readFileSync("src/styles/index.css", "utf8");
  const baseAt = css.indexOf("@layer base");
  const resetAt = css.indexOf("* {\n    margin: 0");
  check("reset lives inside @layer base", baseAt !== -1 && resetAt !== -1 && baseAt < resetAt);
  check("body keeps overflow-x hidden", css.includes("overflow-x: hidden"));
  check("body does NOT set overflow: hidden", !/body\s*{[^}]*[^-]overflow:\s*hidden/.test(css));
  check("float-slow reuses floatA", /\.float-slow\s*{[^}]*floatA/.test(css));
  check("reveal hidden until is-visible", /\.reveal\s*{\s*opacity:\s*0/.test(css) && /\.is-visible \.reveal\s*{/.test(css));
  const rm = css.slice(css.indexOf("@media (prefers-reduced-motion"));
  check(
    "reduced-motion covers reveal + floaters",
    rm.includes(".money-float") && rm.includes(".reveal") && rm.includes(".float-slow") && rm.includes(".phone-float"),
  );
} finally {
  await server.close();
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
