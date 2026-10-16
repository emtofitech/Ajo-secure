import { GOODS_FREQUENCIES } from "../../../services/mockDb.js";

/** Status → label + chip tone + a plain-English line. */
export const STATUS_META = {
  SAVING: { label: "Saving", tone: "accent", note: "Contributions in progress." },
  PAUSED: { label: "Paused", tone: "muted", note: "Savings are paused. Resume any time." },
  TARGET_REACHED: { label: "Ready for order", tone: "warning", note: "Fully funded and waiting for your confirmation." },
  MEMBER_CONFIRMED: { label: "Order confirmed", tone: "accent", note: "You confirmed the order." },
  VENDOR_NOTIFIED: { label: "Vendor notified", tone: "accent", note: "The vendor has the order." },
  VENDOR_ACCEPTED: { label: "Vendor accepted", tone: "success", note: "The vendor is preparing your order." },
  FULFILLED: { label: "Fulfilled", tone: "success", note: "Delivered and marked as received." },
  CANCELLED: { label: "Cancelled", tone: "danger", note: "This target was cancelled." },
  REFUNDED: { label: "Refunded", tone: "danger", note: "Saved funds are being returned after review." },
};

export const statusMeta = (status) =>
  STATUS_META[status] ?? { label: status, tone: "neutral", note: "" };

export const progressPct = (target) =>
  target.targetKobo > 0 ? Math.min(100, (target.savedKobo / target.targetKobo) * 100) : 0;

const frequencyWeeks = (value) => GOODS_FREQUENCIES.find((f) => f.value === value)?.weeks ?? 1;

/**
 * When the current plan finishes. Returns null once there is nothing left to
 * save (or the target is no longer saving).
 */
export function projectedCompletion(target) {
  const remaining = target.targetKobo - target.savedKobo;
  if (remaining <= 0) return null;
  if (!["SAVING", "PAUSED"].includes(target.status)) return null;
  const amount = target.plan?.amountKobo || 0;
  if (amount <= 0) return null;
  const periods = Math.ceil(remaining / amount);
  const weeks = periods * frequencyWeeks(target.plan.frequency);
  const date = new Date(Date.now() + weeks * 7 * 86_400_000);
  return { date, weeks };
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const TAB_FILTERS = [
  { key: "ALL", label: "All", match: () => true },
  { key: "SAVING", label: "Saving", match: (t) => ["SAVING", "PAUSED"].includes(t.status) },
  { key: "READY", label: "Ready", match: (t) => t.status === "TARGET_REACHED" },
  {
    key: "ORDERED",
    label: "Ordered",
    match: (t) => ["MEMBER_CONFIRMED", "VENDOR_NOTIFIED", "VENDOR_ACCEPTED"].includes(t.status),
  },
  { key: "FULFILLED", label: "Fulfilled", match: (t) => t.status === "FULFILLED" },
];
