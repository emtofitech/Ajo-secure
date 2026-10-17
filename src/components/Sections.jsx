import Reveal from "./Reveal.jsx";

/* ═══════════════════════════════
   STAT BAND
═══════════════════════════════ */
export function StatBand() {
  const stats = [
    { value: "₦0", label: "Admin access\nto pooled funds", ice: false },
    { value: "11", label: "Release conditions\nauto-checked", ice: true },
    { value: "MFA", label: "On every\nsensitive action", ice: false },
    { value: "0.6%", label: "Total fees,\ndisclosed upfront", ice: true },
  ];
  return (
    <div className="stat-band py-14 border-y border-white/10">
      <div className="gutter max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <p
                className={`font-serif text-3xl sm:text-4xl ${s.ice ? "text-ice" : "text-white"}`}
                style={{ fontWeight: 400, letterSpacing: "-0.02em" }}
              >
                {s.value}
              </p>
              <p className="text-white/50 text-[13px] mt-2 leading-snug whitespace-pre-line">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   FEATURES
═══════════════════════════════ */
const S = "#AFDDFF"; /* accent stroke */
const T = "rgba(255,255,255,0.8)"; /* neutral stroke */

const features = [
  {
    title: "Immutable ledger",
    body: "Every financial event creates a permanent ledger entry. Reversals add new entries — nothing is overwritten. The record is always complete.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="5" width="14" height="10" rx="2" stroke={T} strokeWidth="1.5" />
        <path d="M5 5V4C5 2.9 5.9 2 7 2H11C12.1 2 13 2.9 13 4V5" stroke={T} strokeWidth="1.5" />
        <path d="M6 9H12" stroke={S} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 12H10" stroke={S} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Automated payout engine",
    body: "When all release conditions pass — contributions received, identity verified, no holds — the engine instructs your regulated financial partner directly.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke={T} strokeWidth="1.5" />
        <path d="M9 6V9.5L11.5 11" stroke={S} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Ajo Reliability Score",
    body: "An internal trust score built purely from contribution behaviour — on time, late, missed, completed. Not a credit bureau score, but a transparent record.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 2L11.5 7H16L12.5 10L14 15L9 12L4 15L5.5 10L2 7H6.5L9 2Z"
          stroke={S}
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
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 5H15M3 9H15M3 13H10" stroke={T} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="13" r="2.5" stroke={S} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Transparent fee structure",
    body: "Gross payout, organizer fee, platform fee, and net payout shown before you join. Fees lock for the cycle — no surprises mid-way.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M3 14L7 10L10 13L14 8L16 10"
          stroke={S}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="2" y="3" width="14" height="12" rx="2" stroke={T} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "No admin withdrawal",
    body: "The organizer role is operational — not custodial. There is no endpoint, no button, no pathway for an admin to withdraw or redirect pooled member funds.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke={T} strokeWidth="1.5" />
        <path d="M9 6V10M9 12V12.5" stroke={S} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-ink">
      <div className="gutter max-w-6xl mx-auto">
        <Reveal className="max-w-xl mb-16">
          <h2
            className="font-serif text-white leading-tight mb-4"
            style={{ fontSize: "clamp(1.9rem,3.5vw,2.8rem)", fontWeight: 400, letterSpacing: "-0.02em" }}
          >
            Built so the platform does the job, not a person.
          </h2>
          <p className="text-white/50 leading-relaxed">
            Every feature exists to remove the single point of human failure from a traditional Ajo.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={(i % 3) * 80}
              className="feat-card bg-panel p-7"
            >
              <div className="w-10 h-10 border border-white/15 grid items-center mb-5">
                {f.icon}
              </div>
              <h3 className="text-white text-[15px] font-medium mb-2">{f.title}</h3>
              <p className="text-white/50 text-[13px] leading-relaxed">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════
   TRUST & SAFETY
═══════════════════════════════ */
const trustLevels = [
  {
    n: "01",
    title: "Private groups",
    body: "You join groups where the organizer personally knows and verifies every member.",
  },
  {
    n: "02",
    title: "Verified community groups",
    body: "After building a contribution history and completing enhanced verification, you can join broader community groups.",
  },
  {
    n: "03",
    title: "Wider national groups",
    body: "Subject to enhanced risk controls, members with strong reliability records can participate with people they do not physically know.",
  },
];

const securityItems = [
  "MFA on all sensitive operations",
  "Webhook signature verification",
  "Idempotency keys on every payment request",
  "Role-based access control — least privilege",
  "Encryption in transit and at rest",
  "Full audit trail for every financial action",
  "Customer funds separated from platform operating funds",
  "Fraud monitoring and rate limiting",
];

function GoldCheck() {
  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(175,221,255,.13)" }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path
          d="M2 5L4 7L8 3"
          stroke="#AFDDFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function TrustSafety() {
  return (
    <section id="trust" className="py-24 bg-panel">
      <div className="gutter max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2
              className="font-serif text-white leading-tight mb-5"
              style={{ fontSize: "clamp(1.9rem,3.5vw,2.8rem)", fontWeight: 400, letterSpacing: "-0.02em" }}
            >
              Trust is earned in layers, not assumed at the door.
            </h2>
            <p className="text-white/50 leading-relaxed mb-8">
              Ajo Secure uses a progressive trust model. New members start in private groups with
              people the organizer knows. As their contribution history builds, access to wider
              groups opens.
            </p>
            <div className="flex flex-col gap-4">
              {trustLevels.map((t) => (
                <div key={t.n} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] text-ice border border-ice/40 tabular-nums">
                    {t.n}
                  </div>
                  <div>
                    <p className="text-white text-[14px] font-medium mb-1">{t.title}</p>
                    <p className="text-white/50 text-[13px] leading-relaxed">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border border-white/10 p-7" style={{ background: "#05070a" }}>
              <p className="text-ice text-[11px] mb-5 uppercase tracking-[0.18em]">
                Security architecture
              </p>
              <div className="flex flex-col gap-4">
                {securityItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <GoldCheck />
                    <span className="text-white/80 text-[13px]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════
   FEES
═══════════════════════════════ */
const feeRows = [
  {
    label: "Gross payout",
    sub: "Total pool collected this cycle",
    amount: "₦500,000",
    muted: false,
  },
  {
    label: "Organizer fee",
    pct: "0.5%",
    sub: "Paid to the person who formed and manages the group",
    amount: "− ₦2,500",
    muted: true,
  },
  {
    label: "Platform fee",
    pct: "0.1%",
    sub: "Ajo Secure technology and service fee",
    amount: "− ₦500",
    muted: true,
  },
];

export function Fees() {
  return (
    <section id="fees" className="py-24 bg-ink">
      <div className="gutter max-w-6xl mx-auto">
        <Reveal className="max-w-xl mb-14">
          <h2
            className="font-serif text-white leading-tight mb-4"
            style={{ fontSize: "clamp(1.9rem,3.5vw,2.8rem)", fontWeight: 400, letterSpacing: "-0.02em" }}
          >
            Fees are visible before you commit — always.
          </h2>
          <p className="text-white/50 leading-relaxed">
            No hidden deductions inside a payout calculation. Every member sees gross, fees, and net
            before agreeing to any group.
          </p>
        </Reveal>

        <div className="max-w-2xl">
          <div className="border border-white/10">
            {/* Header */}
            <div
              className="px-7 py-5 flex flex-wrap gap-3 justify-between items-center border-b border-white/10"
              style={{ background: "#05070a" }}
            >
              <p className="text-white font-medium text-[15px]">
                Example: ₦500,000 cycle payout
              </p>
              <div className="text-[12px] text-ice bg-ice/10 px-3 py-1 tabular-nums">
                10 members × ₦50,000
              </div>
            </div>

            {/* Rows */}
            <div className="bg-panel">
              {feeRows.map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center gap-4 px-7 py-4 border-b border-white/10"
                >
                  <div>
                    <p className="text-white text-[14px]">
                      {row.label}{" "}
                      {row.pct && <span className="text-white/50">({row.pct})</span>}
                    </p>
                    <p className="text-white/50 text-[12px] mt-0.5">{row.sub}</p>
                  </div>
                  <p
                    className={`text-[15px] tabular-nums ${
                      row.muted ? "text-white/50" : "text-white font-medium"
                    }`}
                  >
                    {row.amount}
                  </p>
                </div>
              ))}

              {/* Net row */}
              <div className="flex justify-between items-center gap-4 px-7 py-5 bg-white/[0.03]">
                <div>
                  <p className="text-white font-medium text-[14px]">Net payout to recipient</p>
                  <p className="text-white/50 text-[12px] mt-0.5">
                    Paid directly to the scheduled member&rsquo;s verified account
                  </p>
                </div>
                <p className="font-serif text-ice text-xl tabular-nums">₦497,000</p>
              </div>
            </div>
          </div>

          <p className="text-white/40 text-[12px] mt-4 leading-relaxed">
            Exact fee treatment confirmed with regulated partner and legal counsel before launch.
            Fees lock at group creation and cannot be changed mid-cycle.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════
   CTA
═══════════════════════════════ */
export function CTA() {
  return (
    <section id="cta" className="cta-bg py-28 border-t border-white/10">
      <Reveal className="gutter max-w-2xl mx-auto text-center">
        <h2
          className="font-serif text-white leading-tight mb-5"
          style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, letterSpacing: "-0.03em" }}
        >
          The Ajo your group
          <br />
          actually deserves.
        </h2>
        <p className="text-white/50 leading-relaxed mb-10 max-w-lg mx-auto">
          Safe, transparent, automated. No one runs away with the money — because the rules make it
          impossible.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#"
            className="btn-ice inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full text-[14px] font-medium"
          >
            Start your group
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7H12M8 3L12 7L8 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="#how"
            className="btn-ghost inline-flex justify-center items-center px-8 py-4 rounded-full text-[14px] font-medium border border-white/20 hover:border-ice/60 transition-colors"
          >
            Read the documentation
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════
   FOOTER
═══════════════════════════════ */
export function Footer() {
  const cols = [
    {
      heading: "Product",
      links: [
        { href: "#how", label: "How it works" },
        { href: "#features", label: "Features" },
        { href: "#fees", label: "Fees" },
        { href: "#trust", label: "Trust & Safety" },
      ],
    },
    {
      heading: "Company",
      links: [
        { href: "#", label: "About" },
        { href: "#", label: "Blog" },
        { href: "#", label: "Compliance" },
        { href: "#", label: "Contact" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { href: "#", label: "Privacy policy" },
        { href: "#", label: "Terms of use" },
        { href: "#", label: "Fee disclosure" },
      ],
    },
  ];

  return (
    <footer style={{ background: "#05070a" }} className="border-t border-white/10">
      <div className="gutter max-w-6xl mx-auto py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-[18px] h-[18px] border border-ice/70 rotate-45 grid place-items-center">
                <span className="w-[6px] h-[6px] bg-ice" />
              </span>
              <span className="font-serif text-white text-[15px] tracking-[0.14em] uppercase">
                Ajo&nbsp;Secure
              </span>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed">
              Community savings, safeguarded. Built for Nigeria.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.heading}>
              <p className="text-white/60 text-[11px] uppercase tracking-[0.18em] mb-4">
                {col.heading}
              </p>
              <div className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="text-white/50 text-[13px] hover:text-ice transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-white/30 text-[12px]">© 2026 Ajo Secure. All rights reserved.</p>
          <p className="text-white/25 text-[12px] max-w-md leading-relaxed">
            This platform operates in partnership with a regulated financial institution. Member
            funds are safeguarded and separated from platform operating funds. Nigerian legal and
            compliance advice obtained before launch.
          </p>
        </div>
      </div>
    </footer>
  );
}
