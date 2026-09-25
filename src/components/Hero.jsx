const members = [
  { initial: "A", name: "Adaeze O.", status: "Paid",    paid: true },
  { initial: "C", name: "Chidi N.",  status: "Paid",    paid: true },
  { initial: "F", name: "Fatima B.", status: "Pending", paid: false },
  { initial: "T", name: "Tunde A.",  status: "Paid",    paid: true },
];

export default function Hero() {
  return (
    <section className="hero-bg hero-grain relative overflow-hidden pt-16 min-h-screen flex items-center">
      {/* Background glows */}
      <div
        className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle,#C9912A,transparent)", filter: "blur(60px)" }}
      />
      <div
        className="absolute bottom-10 left-10 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle,#3D7A56,transparent)", filter: "blur(50px)" }}
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Copy ── */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8 text-xs font-medium text-gold"
              style={{ background: "rgba(201,145,42,.12)", border: "1px solid rgba(201,145,42,.25)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Now live in Nigeria
            </div>

            <h1
              className="font-serif text-cream leading-tight mb-6"
              style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.08 }}
            >
              Your community's<br />
              savings,{" "}
              <em style={{ fontStyle: "italic", color: "#E8B860" }}>finally</em>
              <br />
              safeguarded.
            </h1>

            <p
              className="text-cream/65 leading-relaxed mb-10 max-w-md"
              style={{ fontSize: "clamp(.95rem,1.8vw,1.1rem)" }}
            >
              Ajo Secure brings the Ajo tradition into a structured, automated platform. Verified
              members contribute, the rules enforce themselves, and payouts happen automatically —
              no admin ever touches the pooled funds.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#"
                className="btn-gold inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-white text-sm"
              >
                Start a group
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7H12M8 3L12 7L8 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-cream/80 text-sm border border-cream/20 hover:border-cream/40 transition-colors"
              >
                See how it works
              </a>
            </div>

            {/* Micro-stats */}
            <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-cream/10">
              {[
                { value: "₦0",   label: "admin access to your funds" },
                { value: "100%", label: "automated payout engine" },
                { value: "KYC",  label: "verified members only" },
              ].map((s, i) => (
                <div key={i}>
                  {i > 0 && <div className="hidden sm:block w-px bg-cream/10 absolute" />}
                  <p className="font-serif text-cream text-2xl font-semibold">{s.value}</p>
                  <p className="text-cream/50 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Phone mockup ── */}
          <div className="flex justify-center lg:justify-end">
            <div className="phone-shell w-64 sm:w-72 relative" style={{ padding: 10 }}>
              {/* Notch */}
              <div
                className="absolute top-3.5 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full z-10"
                style={{ background: "#0a1a10" }}
              />
              {/* Screen */}
              <div className="screen-bg rounded-[36px] overflow-hidden" style={{ minHeight: 560, paddingTop: 32 }}>
                {/* Status bar */}
                <div className="flex justify-between px-5 mb-5">
                  <span className="text-cream/50 text-xs">9:41</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-2 bg-cream/50 rounded-sm" />
                      <div className="w-1 h-3 bg-cream/50 rounded-sm" />
                      <div className="w-1 h-4 bg-cream/70 rounded-sm" />
                    </div>
                    <div className="w-4 h-2.5 rounded-sm border border-cream/50 relative">
                      <div className="absolute inset-px bg-cream/70 rounded-sm w-2/3" />
                    </div>
                  </div>
                </div>

                {/* App header */}
                <div className="px-5 mb-6">
                  <p className="text-cream/50 text-xs mb-1">Welcome back</p>
                  <p className="text-cream font-serif font-semibold text-lg">Adaeze's Group</p>
                </div>

                {/* Cycle card */}
                <div
                  className="mx-4 rounded-2xl p-4 mb-4"
                  style={{ background: "linear-gradient(135deg,#C9912A,#a8741a)" }}
                >
                  <p className="text-white/75 text-xs mb-1">Cycle 3 of 10 — Active</p>
                  <p className="text-white font-serif text-2xl font-semibold mb-3">₦500,000</p>
                  <div className="bg-white/20 rounded-full h-1.5 mb-2">
                    <div className="bg-white rounded-full h-1.5" style={{ width: "70%" }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/75 text-xs">₦350,000 collected</span>
                    <span className="text-white text-xs font-medium">7 / 10</span>
                  </div>
                </div>

                {/* Members list */}
                <div className="px-4 mb-4">
                  <p className="text-cream/50 text-xs mb-3">This cycle</p>
                  <div className="flex flex-col gap-2">
                    {members.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2"
                        style={{ borderBottom: i < members.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none" }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white"
                            style={{ background: m.paid ? "#2A5C3F" : "#1a3525" }}
                          >
                            {m.initial}
                          </div>
                          <span className="text-cream/80 text-xs">{m.name}</span>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={
                            m.paid
                              ? { background: "rgba(52,211,153,.12)", color: "#6ee7b7" }
                              : { background: "rgba(251,191,36,.1)", color: "#fcd34d" }
                          }
                        >
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next payout */}
                <div
                  className="mx-4 rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)" }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-cream/50 text-xs">Next payout to</p>
                      <p className="text-cream text-sm font-medium mt-0.5">Blessing O.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cream/50 text-xs">Expected</p>
                      <p className="text-gold text-sm font-medium mt-0.5">₦497,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
