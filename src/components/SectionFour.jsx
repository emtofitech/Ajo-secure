import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   SECTION FOUR — the platform, not a person
   A light editorial band that breaks from the navy hero/two.
   Palette is fixed by the brief:
     page  #FDFCF9   cards #FFFFFF
     heads #2563EB   body  #8C7B6B
   ═══════════════════════════════════════════════════════════ */

const BLUE = "#2563EB"; /* headings + accent strokes */
const BROWN = "#8C7B6B"; /* body copy + neutral strokes */

const FEATURES = [
  {
    title: "Immutable ledger",
    body: "Every financial event creates a permanent ledger entry. Reversals add new entries — nothing is overwritten. The record is always complete.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="5" width="14" height="10" rx="2" stroke={BROWN} strokeWidth="1.5" />
        <path d="M5 5V4C5 2.9 5.9 2 7 2H11C12.1 2 13 2.9 13 4V5" stroke={BROWN} strokeWidth="1.5" />
        <path d="M6 9H12" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 12H10" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Automated payout engine",
    body: "When all release conditions pass — contributions received, identity verified, no holds — the engine instructs your regulated financial partner directly.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke={BROWN} strokeWidth="1.5" />
        <path d="M9 6V9.5L11.5 11" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Ajo Reliability Score",
    body: "An internal trust score built purely from contribution behaviour — on time, late, missed, completed. Not a credit bureau score, but a transparent record.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 2L11.5 7H16L12.5 10L14 15L9 12L4 15L5.5 10L2 7H6.5L9 2Z"
          stroke={BLUE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Live contribution dashboard",
    body: "Cycle progress, who has paid, who is pending, the next recipient, expected payout, applicable fees — visible to every member in real time.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path d="M3 5H15M3 9H15M3 13H10" stroke={BROWN} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="13" r="2.5" stroke={BLUE} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Transparent fee structure",
    body: "Gross payout, organizer fee, platform fee, and net payout shown before you join. Fees lock for the cycle — no surprises mid-way.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path
          d="M3 14L7 10L10 13L14 8L16 10"
          stroke={BLUE}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="2" y="3" width="14" height="12" rx="2" stroke={BROWN} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "No admin withdrawal",
    body: "The organizer role is operational — not custodial. There is no endpoint, no button, no pathway for an admin to withdraw or redirect pooled member funds.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke={BROWN} strokeWidth="1.5" />
        <path d="M9 6V10M9 12V12.5" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function SectionFour() {
  const sectionRef = useRef(null);

  /* CSS `.is-visible .reveal` plays the stagger; the observer just
     flips the switch on the section root, then stops. */
  useEffect(() => {
    const el = sectionRef.current;
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
          io.unobserve(el);
          return;
        }
      },
      { threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative w-full bg-[#FDFCF9] px-5 md:px-[35px] py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="reveal max-w-[640px]" style={{ animationDelay: "0ms" }}>
          <h2
            className="font-graphik text-[30px] md:text-[42px] leading-[1.12]"
            style={{ color: BLUE, letterSpacing: "-0.01em" }}
          >
            Built so the platform does the job, not a person.
          </h2>
          <p
            className="mt-4 font-manrope text-[15px] md:text-[16px] leading-[1.6]"
            style={{ color: BROWN }}
          >
            Every feature exists to remove the single point of human failure from a traditional Ajo.
          </p>
        </div>

        <div className="mt-12 md:mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="reveal bg-white border p-6 md:p-7"
              style={{
                animationDelay: `${120 + (i % 3) * 100}ms`,
                borderColor: "rgba(140,123,107,0.18)",
                boxShadow: "0 1px 2px rgba(140,123,107,0.05)",
              }}
            >
              <div
                className="mb-5 grid h-11 w-11 place-items-center border"
                style={{ borderColor: "rgba(140,123,107,0.28)" }}
              >
                {f.icon}
              </div>
              <h3 className="font-manrope text-[16px] font-bold" style={{ color: BLUE }}>
                {f.title}
              </h3>
              <p
                className="mt-2 font-manrope text-[13.5px] leading-[1.7]"
                style={{ color: BROWN }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
