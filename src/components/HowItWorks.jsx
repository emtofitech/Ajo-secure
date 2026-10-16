import Reveal from "./Reveal.jsx";

const steps = [
  {
    n: "01.",
    title: "Create your group",
    body: "Set the contribution amount, frequency, member limit, payout order, and grace period. Rules lock once contributions begin — no silent changes.",
  },
  {
    n: "02.",
    title: "Verify your members",
    body: "Identity checks, KYC, and verified payout accounts before anyone joins. Members see only what trust and safety require — sensitive details stay protected.",
  },
  {
    n: "03.",
    title: "Contributions are tracked live",
    body: "Every payment is verified by webhook, written to an immutable ledger, and reflected on the group dashboard in real time. No manual entries, no guesswork.",
  },
  {
    n: "04.",
    title: "Payout happens automatically",
    body: "When release conditions are met — all contributions received, no reversals, identity confirmed — the engine instructs the regulated financial partner to pay the scheduled recipient directly.",
  },
];

const logItems = [
  { label: "All 10 contributions received", sub: "₦500,000 of ₦500,000" },
  { label: "No unresolved reversals", sub: "Ledger reconciled" },
  { label: "Recipient identity verified", sub: "KYC confirmed · Account active" },
  { label: "No fraud or compliance hold", sub: "Group status: clear" },
  { label: "Fee calculation complete", sub: "Gross ₦500,000 → Net ₦497,000" },
];

function CheckIcon() {
  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
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

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-panel">
      <div className="gutter max-w-6xl mx-auto">
        <Reveal className="max-w-xl mb-16">
          <h2
            className="font-serif text-white leading-tight mb-4"
            style={{ fontSize: "clamp(1.9rem,3.5vw,2.8rem)", fontWeight: 400, letterSpacing: "-0.02em" }}
          >
            The money moves by rules, not by trust in any one person.
          </h2>
          <p className="text-white/50 leading-relaxed">
            Every contribution, every payout, every escalation — defined upfront and enforced
            automatically by the platform.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-x-20">
          {/* Steps */}
          <div className="flex flex-col">
            {steps.map((s, i) => (
              <Reveal key={i} className="flex gap-5 relative pb-12" delay={i * 80}>
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-[23px] top-12 bottom-0 w-px"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(175,221,255,.35), rgba(175,221,255,0))",
                    }}
                  />
                )}
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-ice border border-ice/40 bg-ink text-[12px] tabular-nums tracking-[0.08em]">
                  {s.n}
                </div>
                <div className="pt-2">
                  <h3 className="text-white text-[15px] font-medium mb-2">{s.title}</h3>
                  <p className="text-white/50 text-[13px] leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Payout engine log */}
          <div className="hidden md:flex items-center justify-center">
            <div
              className="w-full max-w-sm rounded-none overflow-hidden border border-white/10"
              style={{ background: "#05070a" }}
            >
              <div className="px-6 py-5 border-b border-white/10">
                <p className="text-ice text-[11px] tracking-[0.16em] uppercase mb-1">
                  Payout Engine Log
                </p>
                <p className="text-white text-[15px] font-medium">Cycle 3 — Release check</p>
              </div>
              <div className="px-6 py-5 flex flex-col gap-3">
                {logItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckIcon />
                    <div>
                      <p className="text-white/80 text-[12.5px]">{item.label}</p>
                      <p className="text-white/40 text-[12px]">{item.sub}</p>
                    </div>
                  </div>
                ))}
                <div
                  className="mt-3 px-4 py-3.5 border border-ice/30"
                  style={{ background: "rgba(175,221,255,.07)" }}
                >
                  <p className="text-ice text-[11px] tracking-[0.12em] uppercase mb-1">
                    All conditions met
                  </p>
                  <p className="text-white text-[14px]">Payout instruction sent</p>
                  <p className="text-white/40 text-[12px] mt-1 tabular-nums">
                    → Blessing O. · ₦497,000 · Ref: AJO-C3-004
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
