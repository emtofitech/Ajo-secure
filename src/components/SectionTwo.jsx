import { useEffect, useRef } from "react";
import {
  BookLock,
  CalendarCheck,
  CheckCircle2,
  Lock,
  Send,
  ShieldCheck,
} from "lucide-react";
import vault from "../assets/vault.webp";

/* Steps for the timeline. Copy is fixed by the brief. */
const STEPS = [
  {
    num: "01.",
    title: "CONTRIBUTE",
    desc: "Members pay on schedule through a regulated payment provider.",
    sub: "Reminders arrive by in-app, SMS and WhatsApp.",
    Icon: CalendarCheck,
  },
  {
    num: "02.",
    title: "LEDGER",
    desc: "Append-only, double-entry record of every contribution and fee.",
    sub: "Settled entries never change. Corrections are new, visible entries.",
    Icon: BookLock,
  },
  {
    num: "03.",
    title: "PAYOUT",
    desc: "Sent straight to the recipient's verified account, never via the organizer.",
    sub: "Releases only when the cycle is fully funded and the recipient is verified.",
    Icon: Send,
  },
];

const V_LINES = ["12.6%", "37.5%", "61.9%", "86.2%"];
const H_LINES = ["33%", "67%"];

/* Reveal stagger — 120ms per block. */
const D = (i) => `${i * 120}ms`;

/* ═══════════════════════════════════════════════════════════
   SECTION TWO — how it works
   One IntersectionObserver adds `.is-visible` to the root and
   kicks off the ₦ count-up; CSS plays the staggered rest.
   Ref-only, no state.
   ═══════════════════════════════════════════════════════════ */
export default function SectionTwo() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fmt = (n) => "₦" + n.toLocaleString("en-NG");

    const runCountUp = () => {
      el.querySelectorAll("[data-countup]").forEach((node) => {
        const target = Number(node.dataset.countup) || 0;
        if (reduce) {
          node.textContent = fmt(target);
          return;
        }
        const start = performance.now();
        const duration = 1200;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          node.textContent = fmt(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };

    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      runCountUp();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add("is-visible");
          runCountUp();
          io.unobserve(el);
          return;
        }
      },
      { threshold: 0.2 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#020817] overflow-hidden border-t border-white/10"
    >
      {/* Glow layer — one behind the phone, one behind the vault */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 25% 50%, rgba(37,99,235,0.22), transparent 55%), " +
            "radial-gradient(circle at 75% 45%, rgba(90,176,255,0.12), transparent 55%)",
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

      {/* pt-0: no padding after the hero (border-t is the seam) */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-[35px] pt-10 pb-[80px] md:pb-[120px] grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-[56px] lg:gap-[72px] items-start">
        {/* ── LEFT: phone product demo ── */}
        <div className="reveal relative mx-auto w-fit" style={{ animationDelay: D(0) }}>
          {/* soft blue glow behind the phone */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[520px] rounded-full blur-[100px] bg-[#2563EB]/35 pointer-events-none"
            aria-hidden="true"
          />

          <div
            role="img"
            aria-label="Ajo Secure app preview: a savings group cycle with 17 of 20 members paid"
            className="float-y relative mx-auto w-[280px] sm:w-[300px] h-[600px] rounded-[40px] border border-white/25 bg-[#050f24] shadow-[0_30px_80px_rgba(37,99,235,0.35)]"
          >
            {/* notch */}
            <div
              className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[90px] h-[22px] rounded-full bg-black"
              aria-hidden="true"
            />

            {/* screen */}
            <div className="absolute inset-[12px] rounded-[30px] bg-linear-to-b from-[#0b2a66] via-[#0a1d4a] to-[#020817] px-[20px] pt-[44px] pb-[20px] flex flex-col gap-[12px] overflow-hidden">
              <p className="font-graphik text-white text-[22px] leading-[1.1]">
                <span className="block whitespace-nowrap">Save Together.</span>
                <span className="block whitespace-nowrap">
                  Get Paid <span className="text-[#5AB0FF]">Securely.</span>
                </span>
              </p>

              {/* group card */}
              <div className="rounded-[16px] bg-white/[0.06] border border-white/10 p-[14px]">
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-white text-[13px]">Lagos Traders</span>
                  <span className="bg-[#5AB0FF]/15 text-[#5AB0FF] text-[10px] px-[8px] py-[2px] rounded-full">
                    CYCLE 4 / 20
                  </span>
                </div>
                <div className="font-graphik text-white text-[26px] mt-[8px]" data-countup="1000000">
                  ₦1,000,000
                </div>
                <div className="font-manrope text-white/50 text-[11px] mt-[2px]">
                  17 of 20 members paid
                </div>
                <div className="mt-[10px] h-[6px] w-full rounded-full bg-white/10">
                  <div
                    className="h-[6px] rounded-full bg-[#5AB0FF] bar-fill"
                    style={{ "--fill": 0.85 }}
                  />
                </div>
              </div>

              {/* recipient row */}
              <div className="rounded-[16px] bg-white/[0.06] border border-white/10 p-[14px] flex items-center gap-[10px]">
                <span className="w-[32px] h-[32px] rounded-full bg-[#5AB0FF] text-black flex items-center justify-center text-[11px] font-medium shrink-0">
                  AO
                </span>
                <div className="flex flex-col">
                  <span className="font-manrope text-white text-[13px] leading-[16px]">
                    Adaeze O.
                  </span>
                  <span className="font-manrope text-white/50 text-[11px] leading-[14px]">
                    Next payout
                  </span>
                </div>
                <div className="ml-auto flex items-center gap-[4px] text-[#5AB0FF]">
                  <ShieldCheck size={14} />
                  <span className="font-manrope text-[10px]">KYC verified</span>
                </div>
              </div>

              {/* fee lines */}
              <div className="font-manrope flex flex-col gap-[4px] text-[11px]">
                <div className="flex justify-between">
                  <span className="text-white/60">Organizer fee 0.5%</span>
                  <span className="text-white">−₦5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Platform fee 0.1%</span>
                  <span className="text-white">−₦1,000</span>
                </div>
                <div className="h-px bg-white/10 my-[4px]" />
                <div className="flex justify-between">
                  <span className="text-white/60">Recipient receives</span>
                  <span className="text-[#5AB0FF] font-medium">₦994,000</span>
                </div>
              </div>

              {/* status pill */}
              <div className="mt-auto rounded-[12px] border border-[#5AB0FF]/40 bg-[#5AB0FF]/10 px-[12px] py-[10px] flex items-center gap-[8px] text-[11px]">
                <span
                  className="w-[6px] h-[6px] rounded-full bg-[#5AB0FF] pulse-dot shrink-0"
                  aria-hidden="true"
                />
                <span className="font-manrope text-white/80">
                  FUNDING · 3 pending · Payout releases automatically
                </span>
              </div>
            </div>
          </div>

          {/* floating toasts */}
          <div
            aria-hidden="true"
            className="hidden sm:flex float-y absolute -right-[40px] top-[96px] items-center gap-[8px] rounded-[12px] border border-[#5AB0FF]/30 bg-[#0a1d4a]/80 backdrop-blur px-[12px] py-[8px] text-[11px] text-white whitespace-nowrap"
            style={{ animationDelay: "-2s" }}
          >
            <CheckCircle2 size={14} className="text-[#5AB0FF] shrink-0" />
            Ada paid ₦50,000 · just now
          </div>

          <div
            aria-hidden="true"
            className="hidden sm:flex float-y absolute -left-[40px] bottom-[96px] items-center gap-[8px] rounded-[12px] border border-[#5AB0FF]/30 bg-[#0a1d4a]/80 backdrop-blur px-[12px] py-[8px] text-[11px] text-white whitespace-nowrap"
            style={{ animationDelay: "-4s" }}
          >
            <Lock size={14} className="text-[#5AB0FF] shrink-0" />
            Payout locked to verified account
          </div>
        </div>

        {/* ── RIGHT: header, vault, steps ── */}
        <div className="flex flex-col gap-[32px]">
          {/* header */}
          <div className="reveal" style={{ animationDelay: D(1) }}>
            <p className="font-manrope text-[#5AB0FF] text-[13px] leading-[15.6px] mb-[16px]">
              HOW_IT_WORKS
            </p>
            <h2 className="font-graphik text-white text-[32px] md:text-[44px] leading-[1.05] max-w-[440px]">
              Ajo that runs on rules,<span className="text-white/50"> not on trust.</span>
            </h2>
            <p className="font-manrope text-white/60 text-[14px] md:text-[15px] leading-[22px] mt-[16px] max-w-[440px]">
              Members contribute on schedule, every naira is recorded, and the payout goes
              straight to the verified recipient. Organizers coordinate the group. They never
              touch the money.
            </p>
          </div>

          {/* vault — directly under the copy */}
          <div className="reveal relative w-fit" style={{ animationDelay: D(2) }}>
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-[70%] h-[14px] bg-[#2563EB]/40 blur-[12px] rounded-full"
              aria-hidden="true"
            />
            <img
              src={vault}
              alt="Blue steel vault"
              className="relative w-[140px] sm:w-[180px] md:w-[220px] h-auto float-y drop-shadow-[0_20px_50px_rgba(37,99,235,0.5)]"
              /* no-op safety net: the shipped cut-out already ends above this */
              style={{ clipPath: "inset(0 0 6% 0)" }}
            />
          </div>

          {/* steps timeline */}
          <div className="reveal flex flex-col" style={{ animationDelay: D(3) }}>
            {STEPS.map((step, i) => {
              const Icon = step.Icon;
              return (
                <div
                  key={step.num}
                  className="group relative grid grid-cols-[44px_1fr] gap-[16px] transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] hover:translate-x-[4px]"
                >
                  <div className="w-[44px] h-[44px] border border-[#5AB0FF]/60 flex items-center justify-center transition-colors duration-300 group-hover:border-[#5AB0FF] group-hover:bg-[#5AB0FF]/10">
                    <Icon size={18} className="text-[#5AB0FF]" />
                  </div>

                  <div className="pb-[28px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="font-manrope text-[#5AB0FF]/80 text-[13px]">
                        {step.num}
                      </span>
                      <span className="font-manrope text-white text-[13px] leading-[15.6px]">
                        {step.title}
                      </span>
                    </div>
                    <p className="font-manrope text-white/70 text-[14px] leading-[20px] mt-[4px]">
                      {step.desc}
                    </p>
                    <p className="text-white/40 text-[12px] leading-[18px] mt-[4px]">
                      {step.sub}
                    </p>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div
                      className="absolute left-[21px] top-[44px] w-px h-[calc(100%-44px)] bg-linear-to-b from-[#5AB0FF]/60 to-transparent anim-grid-v"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
