import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  Plus,
} from "lucide-react";
import * as api from "../../../services/api.js";
import { formatNaira, koboToNaira, nairaToKobo } from "../../../services/mockDb.js";
import {
  Banner,
  Button,
  Card,
  CardHeader,
  CardSkeleton,
  Chip,
  ErrorBanner,
  Field,
  Input,
  Modal,
  ProgressBar,
  TextArea,
} from "../../ui/index.jsx";
import { useAudit, useGoodsTarget, useLedger } from "../../hooks/useData.js";
import WorkflowStepper from "../../components/goods/WorkflowStepper.jsx";
import {
  formatDate,
  formatDateTime,
  progressPct,
  projectedCompletion,
  statusMeta,
} from "../../components/goods/goodsMeta.js";

const ACTION_LABELS = {
  TARGET_CREATED: "Target created",
  SAVING_ADDED: "Savings added",
  TARGET_REACHED: "Target reached",
  ORDER_CONFIRMED: "Order confirmed",
  VENDOR_NOTIFIED: "Vendor notified",
  VENDOR_ACCEPTED: "Vendor accepted",
  FULFILLED: "Order fulfilled",
  TARGET_PAUSED: "Target paused",
  TARGET_RESUMED: "Target resumed",
  TARGET_CANCELLED: "Target cancelled",
  REFUND_ISSUED: "Refund issued",
  DELIVERY_NOTE_UPDATED: "Delivery note updated",
  SEEDED: "Seeded",
};

const LEDGER_LABELS = {
  GOODS_SAVING: "Goods saving",
  GOODS_PAYOUT: "Goods payout",
  GOODS_REFUND: "Goods refund",
};

export default function GoodsTargetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const target = useGoodsTarget(id);
  const audit = useAudit();
  const ledger = useLedger("GOODS");

  const [modal, setModal] = useState(null); // "add" | "confirm" | "cancel"
  const [amount, setAmount] = useState(5000);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState(null); // null = untouched, string = editing
  const [noteSaved, setNoteSaved] = useState(false);

  const t = target.data;

  const timeline = useMemo(
    () => (audit.data ?? []).filter((a) => a.entityId === id),
    [audit.data, id],
  );
  const entries = useMemo(
    () => (ledger.data ?? []).filter((e) => e.meta?.targetId === id),
    [ledger.data, id],
  );
  const timelineSorted = useMemo(
    () => [...timeline].sort((a, b) => (a.at < b.at ? 1 : -1)),
    [timeline],
  );

  async function run(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
      setModal(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (target.loading && !t) {
    return (
      <div className="space-y-4">
        <CardSkeleton rows={2} />
        <CardSkeleton rows={4} />
      </div>
    );
  }

  if (target.error || !t) {
    return (
      <div className="space-y-4">
        <ErrorBanner>{target.error?.message ?? "That goods target could not be found."}</ErrorBanner>
        <Button variant="secondary" onClick={() => navigate("/app/goods")}>
          <ArrowLeft size={15} />
          Back to Ajo-to-Goods
        </Button>
      </div>
    );
  }

  const meta = statusMeta(t.status);
  const percent = progressPct(t);
  const projection = projectedCompletion(t);
  const paused = t.status === "PAUSED";
  const canSave = ["SAVING", "PAUSED"].includes(t.status);
  const remaining = Math.max(0, t.targetKobo - t.savedKobo);

  return (
    <div className="space-y-6">
      <Link
        to="/app/goods"
        className="inline-flex items-center gap-1.5 font-manrope text-[12.5px] text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={14} />
        All goods targets
      </Link>

      {/* Header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={meta.tone}>{meta.label}</Chip>
            <Chip tone="neutral">{t.category}</Chip>
          </div>
          <h1 className="mt-3 font-graphik text-[24px] leading-tight text-white md:text-[30px]">
            {t.itemName}
          </h1>
          <p className="mt-2 inline-flex items-center gap-1.5 font-manrope text-[13px] text-white/55">
            <BadgeCheck size={14} className="text-[#5AB0FF]" />
            {t.vendor.name} · {t.vendor.city}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canSave ? (
            <>
              <Button onClick={() => setModal("add")}>
                <Plus size={16} />
                Add savings
              </Button>
              <Button variant="secondary" onClick={() => run(() => api.pauseGoodsTarget(t.id))} disabled={busy}>
                {paused ? <Play size={15} /> : <Pause size={15} />}
                {paused ? "Resume" : "Pause"}
              </Button>
            </>
          ) : null}
          {["SAVING", "PAUSED", "TARGET_REACHED"].includes(t.status) ? (
            <Button variant="danger" onClick={() => setModal("cancel")}>
              Cancel target
            </Button>
          ) : null}
        </div>
      </header>

      {error && !modal ? <ErrorBanner>{error}</ErrorBanner> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Progress */}
          <Card className="p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-manrope text-[11px] uppercase tracking-wide text-white/40">
                  Saved so far
                </p>
                <p className="mt-1 font-graphik text-[28px] leading-none text-white">
                  ₦{formatNaira(t.savedKobo)}
                </p>
                <p className="mt-1 font-manrope text-[12.5px] text-white/45">
                  of ₦{formatNaira(t.targetKobo)} · {t.quantity} × ₦{formatNaira(t.itemPriceKobo)}
                </p>
              </div>
              <p className="font-graphik text-[22px] text-[#5AB0FF]">{Math.round(percent)}%</p>
            </div>
            <ProgressBar value={percent} className="mt-4" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <p className="font-manrope text-[11px] uppercase tracking-wide text-white/35">
                  Remaining
                </p>
                <p className="mt-1 font-manrope text-[13.5px] font-semibold text-white">
                  ₦{formatNaira(remaining)}
                </p>
              </div>
              <div className="border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <p className="font-manrope text-[11px] uppercase tracking-wide text-white/35">
                  Next contribution
                </p>
                <p className="mt-1 font-manrope text-[13.5px] font-semibold text-white">
                  {canSave ? formatDate(t.nextContributionAt) : "—"}
                </p>
              </div>
              <div className="border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <p className="font-manrope text-[11px] uppercase tracking-wide text-white/35">
                  Plan
                </p>
                <p className="mt-1 font-manrope text-[13.5px] font-semibold text-white">
                  ₦{formatNaira(t.plan.amountKobo)} · {t.plan.frequency.toLowerCase()}
                </p>
              </div>
            </div>
            {projection ? (
              <p className="mt-4 inline-flex items-center gap-1.5 font-manrope text-[12.5px] text-white/50">
                <Clock size={13} />
                On this plan you reach the target around {formatDate(projection.date)}.
              </p>
            ) : null}
          </Card>

          {/* Action prompt */}
          {t.status === "TARGET_REACHED" ? (
            <Banner>
              <span className="font-semibold text-white">
                Target reached 🎉 Confirm your order to notify {t.vendor.name}.
              </span>
              <span className="mt-3 block">
                <Button onClick={() => setModal("confirm")}>
                  <CheckCircle2 size={16} />
                  Confirm order
                </Button>
              </span>
            </Banner>
          ) : null}
          {t.status === "VENDOR_NOTIFIED" ? (
            <Banner>
              {t.vendor.name} has been notified. Waiting for them to accept the order…
            </Banner>
          ) : null}
          {t.status === "VENDOR_ACCEPTED" ? (
            <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-manrope text-[13.5px] text-white/70">
                {t.vendor.name} accepted the order. When it arrives, mark it as received.
              </p>
              <Button onClick={() => run(() => api.markGoodsReceived(t.id))} disabled={busy}>
                <CheckCircle2 size={16} />
                Mark as received
              </Button>
            </Card>
          ) : null}
          {t.status === "FULFILLED" ? (
            <Banner>This order is fulfilled. Your savings paid the vendor's verified account.</Banner>
          ) : null}
          {t.status === "REFUNDED" ? (
            <Banner>
              Saved funds return to your payout account after review. The refund is
              recorded on the ledger below.
            </Banner>
          ) : null}

          {/* Workflow */}
          <Card>
            <CardHeader
              title="How this order moves"
              hint="Only you can confirm an order. A vendor is paid only from your goods savings."
            />
            <div className="px-5 py-5">
              <WorkflowStepper reached={t.workflow.map((w) => w.status)} status={t.status} />
            </div>
          </Card>

          {/* Order details */}
          <Card>
            <CardHeader title="Order details" />
            <div className="space-y-4 px-5 py-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="font-manrope text-[11px] uppercase tracking-wide text-white/35">Item</p>
                  <p className="mt-1 font-manrope text-[13.5px] font-semibold text-white">
                    {t.itemName}
                  </p>
                </div>
                <div>
                  <p className="font-manrope text-[11px] uppercase tracking-wide text-white/35">
                    Quantity
                  </p>
                  <p className="mt-1 font-manrope text-[13.5px] font-semibold text-white">
                    {t.quantity} × ₦{formatNaira(t.itemPriceKobo)}
                  </p>
                </div>
                <div>
                  <p className="font-manrope text-[11px] uppercase tracking-wide text-white/35">
                    Vendor
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 font-manrope text-[13.5px] font-semibold text-white">
                    <BadgeCheck size={14} className="text-[#5AB0FF]" />
                    {t.vendor.name}
                  </p>
                </div>
                <div>
                  <p className="font-manrope text-[11px] uppercase tracking-wide text-white/35">
                    Payout destination
                  </p>
                  <p className="mt-1 font-manrope text-[13.5px] text-white/70">
                    Paid to {t.vendor.name}'s verified account
                  </p>
                </div>
              </div>

              <Field
                label="Delivery or pickup note"
                hint="Shared with the vendor when the order is confirmed. Up to 200 characters."
              >
                <TextArea
                  id="delivery-note"
                  maxLength={200}
                  value={note ?? t.deliveryNote}
                  onChange={(e) => {
                    setNote(e.target.value);
                    setNoteSaved(false);
                  }}
                  placeholder="e.g. Deliver to 14 Adeniran Street, Ikate — call on arrival."
                />
              </Field>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    run(async () => {
                      await api.updateGoodsDeliveryNote(t.id, note ?? t.deliveryNote);
                      setNoteSaved(true);
                    })
                  }
                  disabled={busy || note === null}
                >
                  Save note
                </Button>
                {noteSaved ? (
                  <span className="font-manrope text-[12.5px] text-emerald-300">Saved</span>
                ) : null}
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Goods ledger entries */}
          <Card>
            <CardHeader
              title="Goods ledger"
              hint="Append-only. Corrections are new entries, never edits."
            />
            <div className="px-5 py-5">
              {entries.length === 0 ? (
                <p className="font-manrope text-[13px] text-white/40">
                  No ledger entries for this target yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {entries.map((e) => (
                    <li key={e.id} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-manrope text-[13px] font-semibold text-white">
                          {LEDGER_LABELS[e.type] ?? e.type}
                        </p>
                        <p className="font-manrope text-[11.5px] text-white/40">
                          {formatDateTime(e.at)} · {e.direction === "CREDIT" ? "credit" : "debit"}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 font-manrope text-[13px] font-semibold ${
                          e.type === "GOODS_REFUND" ? "text-amber-300" : "text-white"
                        }`}
                      >
                        {e.direction === "CREDIT" ? "+" : "−"}₦{formatNaira(e.amountKobo)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {/* Activity timeline */}
          <Card>
            <CardHeader title="Activity" hint="Who did what, and when." />
            <div className="px-5 py-5">
              {timelineSorted.length === 0 ? (
                <p className="font-manrope text-[13px] text-white/40">Nothing recorded yet.</p>
              ) : (
                <ol className="space-y-4">
                  {timelineSorted.map((a) => (
                    <li key={a.id} className="relative border-l border-white/12 pl-4">
                      <span className="absolute -left-[3px] top-1.5 h-1.5 w-1.5 rounded-full bg-[#5AB0FF]" />
                      <p className="font-manrope text-[12.5px] font-semibold text-white">
                        {ACTION_LABELS[a.action] ?? a.action}
                      </p>
                      <p className="mt-0.5 font-manrope text-[12px] leading-5 text-white/50">
                        {a.summary}
                      </p>
                      <p className="mt-1 font-manrope text-[11px] text-white/35">
                        {a.actorName} · {formatDateTime(a.at)}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Add savings */}
      <Modal
        open={modal === "add"}
        title="Add savings"
        onClose={() => !busy && setModal(null)}
      >
        <div className="space-y-4">
          <p className="font-manrope text-[13px] leading-6 text-white/60">
            This adds to your goods savings only. It is kept apart from your Ajo pool.
          </p>
          <div className="flex flex-wrap gap-2">
            {[t.plan.amountKobo, nairaToKobo(5000), nairaToKobo(10000), remaining].map((k, i) => (
              <button
                key={`${k}-${i}`}
                type="button"
                onClick={() => setAmount(Math.round(koboToNaira(k)))}
                disabled={k <= 0}
                className="rounded-full border border-white/12 px-3 py-1.5 font-manrope text-[12px] font-semibold text-white/60 transition-colors hover:border-[#5AB0FF] hover:text-white disabled:opacity-40"
              >
                ₦{formatNaira(k)}
              </button>
            ))}
          </div>
          <Field label="Amount (₦)">
            <Input
              id="amount"
              type="number"
              min={500}
              step={100}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>
          <p className="font-manrope text-[11.5px] text-white/40">
            Simulated payment — a regulated provider will handle this in production.
          </p>
          {error ? <ErrorBanner>{error}</ErrorBanner> : null}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModal(null)} disabled={busy}>
              Cancel
            </Button>
            <Button
              onClick={() => run(() => api.contributeToGoodsTarget(t.id, nairaToKobo(amount)))}
              disabled={busy || !(Number(amount) > 0)}
            >
              {busy ? "Processing…" : `Pay ₦${formatNaira(nairaToKobo(amount))}`}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm order */}
      <Modal
        open={modal === "confirm"}
        title="Confirm your order"
        onClose={() => !busy && setModal(null)}
      >
        <div className="space-y-4">
          <p className="font-manrope text-[13px] leading-6 text-white/70">
            Confirming tells <span className="font-semibold text-white">{t.vendor.name}</span> to
            prepare {t.quantity} × {t.itemName}. You are the only person who can confirm this
            order.
          </p>
          <div className="border border-white/12 bg-white/[0.03] px-4 py-3">
            <p className="font-manrope text-[12.5px] text-white/55">
              Payout destination: <span className="text-white/80">Paid to {t.vendor.name}'s verified account</span>
            </p>
          </div>
          {error ? <ErrorBanner>{error}</ErrorBanner> : null}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModal(null)} disabled={busy}>
              Not now
            </Button>
            <Button onClick={() => run(() => api.confirmGoodsOrder(t.id))} disabled={busy}>
              {busy ? "Confirming…" : "Confirm order"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel target */}
      <Modal
        open={modal === "cancel"}
        title="Cancel this target?"
        onClose={() => !busy && setModal(null)}
      >
        <div className="space-y-4">
          <p className="font-manrope text-[13px] leading-6 text-white/70">
            Saved funds return to your payout account after review. This records a
            refund against your goods savings and cannot be undone.
          </p>
          <div className="border border-white/12 bg-white/[0.03] px-4 py-3">
            <p className="font-manrope text-[12.5px] text-white/55">
              Amount to be returned:{" "}
              <span className="font-semibold text-white">₦{formatNaira(t.savedKobo)}</span>
            </p>
          </div>
          {error ? <ErrorBanner>{error}</ErrorBanner> : null}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModal(null)} disabled={busy}>
              Keep target
            </Button>
            <Button variant="danger" onClick={() => run(() => api.cancelGoodsTarget(t.id))} disabled={busy}>
              {busy ? "Cancelling…" : "Cancel target"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
