import { useEffect, useRef } from "react";
import vault from "../assets/vault.webp";

/* Reveal delays step by 100ms so the column unwinds top-to-bottom. */
const FEATURES = [
  {
    title: "[ CONTRIBUTE ]",
    desc: "Members pay on schedule through a regulated payment provider.",
    delay: 200,
  },
  {
    title: "[ LEDGER ]",
    desc: "Append-only, double-entry record of every contribution and fee.",
    delay: 300,
  },
  {
    title: "[ PAYOUT ]",
    desc: "Sent straight to the recipient's verified account, never via the organizer.",
    delay: 400,
  },
];

const V_LINES = ["12.6%", "37.5%", "61.9%", "86.2%"];
const H_LINES = ["33%", "67%"];

/* ═══════════════════════════════════════════════════════════
   SECTION TWO — how it works
   Scroll-triggered fade-ups: one IntersectionObserver toggles a
   class on the root, CSS does the staggered rest (no useState).
   ═══════════════════════════════════════════════════════════ */
export default function SectionTwo() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add("is-visible");
          io.disconnect();
          return;
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={rootRef}
      className="relative w-full min-h-screen bg-[#020817] overflow-hidden"
    >
      {/* Faint blue radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 20% 28%, rgba(37,99,235,0.22), transparent 55%), " +
            "radial-gradient(circle at 88% 78%, rgba(90,176,255,0.12), transparent 55%)",
        }}
      />

      {/* Same grid-line motif as the hero */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {V_LINES.map((left, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 h-full w-px bg-white/[0.05]"
            style={{ left }}
          />
        ))}
        {H_LINES.map((top, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 w-full h-px bg-white/[0.05]"
            style={{ top }}
          />
        ))}
      </div>

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-[35px] py-[80px] md:py-[120px] grid grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[64px] items-center">
        {/* ── LEFT: phone mockup ── */}
        <div className="reveal relative" style={{ "--reveal-delay": "0ms" }}>
          {/* soft blue glow behind the phone */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[480px] rounded-full blur-[90px] bg-[#2563EB]/35 pointer-events-none"
            aria-hidden="true"
          />

          <div className="phone-float relative mx-auto w-[260px] sm:w-[300px] h-[520px] sm:h-[600px] rounded-[40px] border border-white/30 bg-[#050f24] shadow-[0_30px_80px_rgba(37,99,235,0.35)]">
            {/* notch */}
            <div
              className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[90px] h-[22px] rounded-full bg-black"
              aria-hidden="true"
            />

            {/* screen */}
            <div
              className="absolute inset-[12px] rounded-[30px] p-[24px] flex flex-col justify-center"
              style={{
                background:
                  "linear-gradient(150deg, #0b2a66 0%, #0a1d4a 55%, #020817 100%)",
              }}
            >
              <p className="font-graphik text-white text-[30px] sm:text-[36px] leading-[1.05]">
                Save Together. Get Paid <span className="text-[#5AB0FF]">Securely.</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: vault, features, CTA, card ── */}
        <div className="flex flex-col gap-[28px]">
          <img
            src={vault}
            alt="A vault securing pooled group contributions"
            className="reveal float-slow w-full max-w-[420px] h-auto drop-shadow-[0_20px_50px_rgba(37,99,235,0.45)]"
            style={{
              "--reveal-delay": "100ms",
              "--dur": "9s",
              "--dx": "0px",
              "--dy": "-14px",
              "--r0": "0deg",
              "--r1": "0deg",
            }}
          />

          <div className="flex flex-col gap-[20px]">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="reveal border-l border-[#5AB0FF]/40 pl-[16px]"
                style={{ "--reveal-delay": `${f.delay}ms` }}
              >
                <h3 className="font-manrope text-white text-[13px] leading-[15.6px]">
                  {f.title}
                </h3>
                <p className="font-manrope text-white/50 text-[13px] md:text-[14px] leading-[20px] mt-[4px]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <a
            id="get-started"
            href="#"
            className="reveal bg-[#5AB0FF] hover:bg-[#8CC8FF] px-[20px] py-[12px] inline-flex items-center gap-[10px] transition-colors w-fit"
            style={{ "--reveal-delay": "500ms" }}
          >
            <span className="text-black text-[16px] leading-none" aria-hidden="true">
              &#10022;
            </span>
            <span className="font-manrope text-black text-[13px] leading-[15.6px] uppercase tracking-wide">
              START AN AJO GROUP
            </span>
          </a>

          <div className="reveal" style={{ "--reveal-delay": "600ms" }}>
            <span className="inline-block mb-[10px] bg-[#5AB0FF] text-black font-manrope text-[13px] leading-[15.6px] px-[6px] py-[2px]">
              NOT A WALLET — A SECURE LEDGER
            </span>

            <div className="relative p-[20px] max-w-[360px]">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 280 168"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon
                  points="0.5,0.5 279.5,0.5 279.5,167.5 30,167.5 0.5,137.5"
                  fill="none"
                  stroke="#5AB0FF"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              <p className="relative font-manrope text-white text-[13px] leading-[18px] mb-[18px]">
                Organizers coordinate the group but never touch the pooled funds. 20 members ×
                ₦50,000 pays out ₦994,000 after a transparent 0.6% in fees.
              </p>

              <a
                href="#"
                className="relative font-manrope text-[#5AB0FF] text-[13px] leading-[15.6px] cursor-pointer hover:underline"
              >
                VIEW_FEE_BREAKDOWN
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
