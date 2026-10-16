import { useEffect } from "react";
import { BadgeCheck, X } from "lucide-react";

/* ── buttons ───────────────────────────────────────────────── */

/* Every app button sits on the near-black canvas, where a plain black
   drop shadow is invisible. Elevation is therefore two parts: a thin
   light top edge (the "raised" cue) plus a deep drop shadow underneath.
   The accent button gets a blue ambient glow instead of a grey one so
   it reads as floating above the card. */
const ELEVATED =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_18px_-8px_rgba(0,0,0,0.85)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_12px_24px_-8px_rgba(0,0,0,0.95)]";
const ELEVATED_ACCENT =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(90,176,255,0.45)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_12px_28px_-6px_rgba(90,176,255,0.6)]";

const BUTTON_VARIANTS = {
  /* 2px radius on every variant — square-corner, but not razor sharp. */
  primary: `bg-[#5AB0FF] text-[#020817] hover:bg-[#3E9BEB] disabled:bg-[#5AB0FF]/40 ${ELEVATED_ACCENT}`,
  secondary: `border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] ${ELEVATED}`,
  /* Text button: no surface to raise, so it takes the radius only. */
  ghost: "text-white/60 hover:text-white hover:bg-white/[0.06]",
  danger: `border border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/20 ${ELEVATED}`,
};

export function Button({ variant = "primary", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[2px] px-4 py-2.5 text-sm font-semibold transition-[background-color,border-color,color,box-shadow] disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

/* ── surfaces ──────────────────────────────────────────────── */

export function Card({ className = "", ...props }) {
  return (
    <div
      className={`border border-white/10 bg-white/[0.04] backdrop-blur-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ title, hint, action }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
      <div className="min-w-0">
        <h2 className="font-manrope text-[15px] font-bold text-white">{title}</h2>
        {hint ? <p className="font-manrope text-[12px] text-white/45">{hint}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, chip }) {
  return (
    <Card className="flex items-start justify-between gap-3 p-5">
      <div className="min-w-0">
        <p className="font-manrope text-[11px] uppercase tracking-wide text-white/40">{label}</p>
        <p className="mt-2 font-graphik text-[26px] leading-none text-white">{value}</p>
        {sub ? <p className="mt-2 font-manrope text-[12px] text-white/50">{sub}</p> : null}
        {chip ? <div className="mt-3">{chip}</div> : null}
      </div>
      {Icon ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#5AB0FF]/30 bg-[#5AB0FF]/10 text-[#5AB0FF]">
          <Icon size={17} />
        </span>
      ) : null}
    </Card>
  );
}

/* ── chips ─────────────────────────────────────────────────── */

const CHIP_TONES = {
  neutral: "bg-white/10 text-white/70",
  accent: "bg-[#5AB0FF]/15 text-[#5AB0FF]",
  success: "bg-emerald-400/15 text-emerald-300",
  warning: "bg-amber-400/15 text-amber-300",
  danger: "bg-red-400/15 text-red-300",
  muted: "bg-white/[0.06] text-white/45",
};

export function Chip({ tone = "neutral", className = "", children, ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-manrope text-[11px] font-semibold ${CHIP_TONES[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function BetaChip({ className = "" }) {
  return (
    <Chip tone="accent" className={`px-[6px] py-[1px] text-[10px] ${className}`}>
      BETA
    </Chip>
  );
}

/** The BETA marker used wherever the feature is named. */
export function FeatureLabel({ className = "", ...props }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} {...props}>
      <span className="font-graphik text-[15px] text-white">Ajo-to-Goods</span>
      <BetaChip />
    </span>
  );
}

export function VerifiedBadge({ className = "" }) {
  return (
    <Chip tone="accent" className={className}>
      <BadgeCheck size={12} />
      Verified vendor
    </Chip>
  );
}

/* ── progress ──────────────────────────────────────────────── */

export function ProgressBar({ value = 0, className = "" }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full overflow-hidden bg-white/10 ${className}`}
    >
      <div
        className="h-full bg-[#5AB0FF] transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ── feedback ──────────────────────────────────────────────── */

export function Banner({ children, className = "" }) {
  return (
    <div className={`border border-[#5AB0FF]/30 bg-[#5AB0FF]/10 px-4 py-3 ${className}`}>
      <p className="font-manrope text-[13px] leading-6 text-[#C9E4FF]">{children}</p>
    </div>
  );
}

export function ErrorBanner({ children, className = "" }) {
  return (
    <div className={`border border-red-400/30 bg-red-400/10 px-4 py-3 ${className}`}>
      <p className="font-manrope text-[13px] leading-6 text-red-200">{children}</p>
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-white/[0.07] ${className}`} />;
}

export function CardSkeleton({ rows = 3 }) {
  return (
    <Card className="p-5">
      <Skeleton className="h-4 w-40" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </Card>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <Card className="flex flex-col items-center px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center border border-white/15 bg-white/[0.05]">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/35" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 7h18M3 12h18M3 17h10" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mt-4 font-manrope text-[15px] font-bold text-white">{title}</p>
      {body ? <p className="mt-1 max-w-sm font-manrope text-[13px] text-white/50">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

/* ── form fields ───────────────────────────────────────────── */

const FIELD_BASE =
  "w-full border border-white/15 bg-white/[0.04] px-3 py-2.5 font-manrope text-sm text-white placeholder:text-white/30 focus:border-[#5AB0FF] focus:outline-none disabled:opacity-60";

export function Field({ label, hint, error, children, id }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="font-manrope text-[12px] font-semibold text-white/60">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <span className="mt-1 block font-manrope text-[12px] text-red-300">{error}</span>
      ) : hint ? (
        <span className="mt-1 block font-manrope text-[12px] text-white/40">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ id, className = "", ...props }) {
  return <input id={id} className={`${FIELD_BASE} ${className}`} {...props} />;
}

export function Select({ id, className = "", children, ...props }) {
  return (
    <select id={id} className={`${FIELD_BASE} appearance-none ${className}`} {...props}>
      {children}
    </select>
  );
}

export function TextArea({ id, className = "", maxLength, value, ...props }) {
  return (
    <div>
      <textarea
        id={id}
        className={`${FIELD_BASE} min-h-[84px] resize-y ${className}`}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      {maxLength ? (
        <span className="mt-1 block text-right font-manrope text-[11px] text-white/35">
          {String(value ?? "").length}/{maxLength}
        </span>
      ) : null}
    </div>
  );
}

/* ── modal ─────────────────────────────────────────────────── */

export function Modal({ open, title, onClose, children, width = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`my-8 w-full ${width} border border-white/15 bg-[#050f24] shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-manrope text-[15px] font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-[2px] text-white/50 transition-colors hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ── misc ──────────────────────────────────────────────────── */

export function Spinner({ className = "" }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}

/** Integer kobo in → "₦85,000" out. Never renders a fractional naira. */
export function Money({ kobo, className = "" }) {
  const naira = Math.round(Number(kobo) / 100);
  return (
    <span className={`tabular-nums ${className}`}>
      ₦{naira.toLocaleString("en-NG", { maximumFractionDigits: 0 })}
    </span>
  );
}
