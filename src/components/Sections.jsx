import Reveal from "./Reveal.jsx";

/* ═══════════════════════════════
   STAT BAND
═══════════════════════════════ */
export function StatBand() {
  const stats = [
    { value: "₦0",   label: "Admin access\nto pooled funds",    gold: false },
    { value: "11",   label: "Release conditions\nauto-checked", gold: true  },
    { value: "MFA",  label: "On every\nsensitive action",       gold: false },
    { value: "0.6%", label: "Total fees,\ndisclosed upfront",   gold: true  },
  ];
  return (
    <div className="stat-band py-14">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className={`font-serif text-3xl sm:text-4xl font-semibold ${s.gold ? "text-gold" : "text-cream"}`}>
                {s.value}
              </p>
              <p className="text-cream/50 text-sm mt-2 leading-snug whitespace-pre-line">{s.label}</p>
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
const features = [
  {
    title: "Immutable ledger",
    body: "Every financial event creates a permanent ledger entry. Reversals add new entries — nothing is overwritten. The record is always complete.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="5" width="14" height="10" rx="2" stroke="#0D2B1F" strokeWidth="1.5"/>
        <path d="M5 5V4C5 2.9 5.9 2 7 2H11C12.1 2 13 2.9 13 4V5" stroke="#0D2B1F" strokeWidth="1.5"/>
        <path d="M6 9H12" stroke="#C9912A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 12H10" stroke="#C9912A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Automated payout engine",
    body: "When all release conditions pass — contributions received, identity verified, no holds — the engine instructs your regulated financial partner directly.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="#0D2B1F" strokeWidth="1.5"/>
        <path d="M9 6V9.5L11.5 11" stroke="#C9912A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Ajo Reliability Score",
    body: "An internal trust score built purely from contribution behaviour — on time, late, missed, completed. Not a credit bureau score, but a transparent record.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L11.5 7H16L12.5 10L14 15L9 12L4 15L5.5 10L2 7H6.5L9 2Z" stroke="#0D2B1F" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Live contribution dashboard",
    body: "Cycle progress, who has paid, who is pending, the next recipient, expected payout, applicable fees — visible to every member in real time.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 5H15M3 9H15M3 13H10" stroke="#0D2B1F" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="13" r="2.5" stroke="#C9912A" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    title: "Transparent fee structure",
    body: "Gross payout, organizer fee, platform fee, and net payout shown before you join. Fees lock for the cycle — no surprises mid-way.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 14L7 10L10 13L14 8L16 10" stroke="#C9912A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2" y="3" width="14" height="12" rx="2" stroke="#0D2B1F" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    title: "No admin withdrawal",
    body: "The organizer role is operational — not custodial. There is no endpoint, no button, no pathway for an admin to withdraw or redirect pooled member funds.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="#0D2B1F" strokeWidth="1.5"/>
        <path d="M9 6V10M9 12V12.5" stroke="#C9912A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-offwhite">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl mb-16">
          <h2 className="font-serif font-semibold text-forest leading-tight mb-4"
            style={{ fontSize: "clamp(1.9rem,3.5vw,2.8rem)" }}>
            Built so the platform does the job, not a person.
          </h2>
          <p className="text-stone leading-relaxed">
            Every feature exists to remove the single point of human failure from a traditional Ajo.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={(i % 3) * 80}
              className="feat-card rounded-2xl p-6"
              style={{ background: "#fff", border: "1px solid #e8e2d8" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(13,43,31,.07)" }}
              >
                {f.icon}
              </div>
              <h3 className="font-serif font-semibold text-forest text-lg mb-2">{f.title}</h3>
              <p className="text-stone text-sm leading-relaxed">{f.body}</p>
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
  { n: "1", title: "Private groups", body: "You join groups where the organizer personally knows and verifies every member." },
  { n: "2", title: "Verified community groups", body: "After building a contribution history and completing enhanced verification, you can join broader community groups." },
  { n: "3", title: "Wider national groups", body: "Subject to enhanced risk controls, members with strong reliability records can participate with people they do not physically know." },
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
    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(201,145,42,.15)" }}>
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M2 5L4 7L8 3" stroke="#C9912A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

export function TrustSafety() {
  return (
    <section id="trust" className="py-24" style={{ background: "#F2EEE7" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <Reveal>
            <h2 className="font-serif font-semibold text-forest leading-tight mb-5"
              style={{ fontSize: "clamp(1.9rem,3.5vw,2.8rem)" }}>
              Trust is earned in layers, not assumed at the door.
            </h2>
            <p className="text-stone leading-relaxed mb-8">
              Ajo Secure uses a progressive trust model. New members start in private groups with people
              the organizer knows. As their contribution history builds, access to wider groups opens.
            </p>
            <div className="flex flex-col gap-4">
              {trustLevels.map((t) => (
                <div key={t.n} className="flex gap-4 items-start">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-serif font-semibold text-sm text-forest"
                    style={{ background: "rgba(201,145,42,.2)", border: "1px solid rgba(201,145,42,.4)" }}
                  >
                    {t.n}
                  </div>
                  <div>
                    <p className="font-medium text-forest text-sm mb-1">{t.title}</p>
                    <p className="text-stone text-sm leading-relaxed">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div
              className="rounded-2xl p-7"
              style={{ background: "#0D2B1F", border: "1px solid rgba(255,255,255,.06)" }}
            >
              <p className="text-cream/50 text-xs mb-5 uppercase tracking-widest">Security architecture</p>
              <div className="flex flex-col gap-4">
                {securityItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <GoldCheck />
                    <span className="text-cream/80 text-sm">{item}</span>
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
  { label: "Gross payout", sub: "Total pool collected this cycle", amount: "₦500,000", muted: false },
  { label: "Organizer fee", pct: "0.5%", sub: "Paid to the person who formed and manages the group", amount: "− ₦2,500", muted: true },
  { label: "Platform fee",  pct: "0.1%", sub: "Ajo Secure technology and service fee", amount: "− ₦500",   muted: true },
];

export function Fees() {
  return (
    <section id="fees" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl mb-14">
          <h2 className="font-serif font-semibold text-forest leading-tight mb-4"
            style={{ fontSize: "clamp(1.9rem,3.5vw,2.8rem)" }}>
            Fees are visible before you commit — always.
          </h2>
          <p className="text-stone leading-relaxed">
            No hidden deductions inside a payout calculation. Every member sees gross, fees, and net before agreeing to any group.
          </p>
        </Reveal>

        <div className="max-w-2xl">
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e0d9ce" }}>
            {/* Header */}
            <div className="px-7 py-5 flex justify-between items-center" style={{ background: "#0D2B1F" }}>
              <p className="text-cream font-serif font-semibold">Example: ₦500,000 cycle payout</p>
              <div className="text-xs text-cream/50 bg-cream/10 px-3 py-1 rounded-full">
                10 members × ₦50,000
              </div>
            </div>
            {/* Rows */}
            <div className="bg-white">
              {feeRows.map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-7 py-4"
                  style={{ borderBottom: "1px solid rgba(140,123,107,.1)" }}
                >
                  <div>
                    <p className="text-forest font-medium text-sm">
                      {row.label}{" "}
                      {row.pct && <span className="text-stone font-normal">({row.pct})</span>}
                    </p>
                    <p className="text-stone text-xs mt-0.5">{row.sub}</p>
                  </div>
                  <p className={`font-serif ${row.muted ? "text-stone" : "font-semibold text-forest"}`}>
                    {row.amount}
                  </p>
                </div>
              ))}
              {/* Net row */}
              <div className="flex justify-between items-center px-7 py-5" style={{ background: "#faf8f4" }}>
                <div>
                  <p className="text-forest font-semibold text-sm">Net payout to recipient</p>
                  <p className="text-stone text-xs mt-0.5">Paid directly to the scheduled member's verified account</p>
                </div>
                <p className="font-serif font-bold text-forest text-xl">₦497,000</p>
              </div>
            </div>
          </div>
          <p className="text-stone text-xs mt-4 leading-relaxed">
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
    <section className="cta-bg py-28">
      <Reveal className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
        <h2 className="font-serif font-semibold text-cream leading-tight mb-5"
          style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
          The Ajo your group<br />actually deserves.
        </h2>
        <p className="text-cream/60 leading-relaxed mb-10 max-w-lg mx-auto">
          Safe, transparent, automated. No one runs away with the money — because the rules make it impossible.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#"
            className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-white"
          >
            Start your group
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M8 3L12 7L8 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#how"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-cream/70 border border-cream/20 hover:border-cream/40 transition-colors"
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
        { href: "#how",      label: "How it works" },
        { href: "#features", label: "Features" },
        { href: "#fees",     label: "Fees" },
        { href: "#trust",    label: "Trust & Safety" },
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
    <footer style={{ background: "#08180F" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#C9912A,#E8B860)" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L13 5.5V10.5L8 14L3 10.5V5.5L8 2Z" fill="#0D2B1F" />
                  <circle cx="8" cy="8" r="2.5" fill="#C9912A" />
                </svg>
              </div>
              <span className="font-serif font-semibold text-cream">Ajo Secure</span>
            </div>
            <p className="text-cream/40 text-sm leading-relaxed">
              Community savings, safeguarded. Built for Nigeria.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.heading}>
              <p className="text-cream/60 text-xs uppercase tracking-widest mb-4">{col.heading}</p>
              <div className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <a key={l.label} href={l.href}
                    className="text-cream/50 text-sm hover:text-cream/80 transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-cream/30 text-xs">© 2026 Ajo Secure. All rights reserved.</p>
          <p className="text-cream/25 text-xs max-w-md leading-relaxed">
            This platform operates in partnership with a regulated financial institution.
            Member funds are safeguarded and separated from platform operating funds.
            Nigerian legal and compliance advice obtained before launch.
          </p>
        </div>
      </div>
    </footer>
  );
}
