import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Package } from "lucide-react";
import * as api from "../../../services/api.js";
import {
  GOODS_CATEGORIES,
  GOODS_FREQUENCIES,
  MIN_GOODS_CONTRIBUTION_KOBO,
  formatNaira,
  nairaToKobo,
} from "../../../services/mockDb.js";
import {
  Banner,
  Button,
  Card,
  Chip,
  Field,
  Input,
  Modal,
  Select,
} from "../../ui/index.jsx";
import { useGoodsFees, useGoodsVendors } from "../../hooks/useData.js";

const STEPS = ["Category", "Vendor & item", "Savings plan", "Review"];

const frequencyWeeks = (value) => GOODS_FREQUENCIES.find((f) => f.value === value)?.weeks ?? 1;

export default function CreateTargetModal({ open, onClose, onCreated }) {
  const navigate = useNavigate();
  const vendors = useGoodsVendors();
  const fees = useGoodsFees();

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(500);
  const [frequency, setFrequency] = useState("WEEKLY");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setCategory("");
    setVendorId("");
    setItemId("");
    setQuantity(1);
    setAmount(500);
    setFrequency("WEEKLY");
    setStartDate(new Date().toISOString().slice(0, 10));
    setAcknowledged(false);
    setSubmitting(false);
    setError("");
  }, [open]);

  const vendorsInCategory = useMemo(
    () =>
      (vendors.data ?? []).filter(
        (v) => v.verified && v.catalog.some((i) => i.category === category),
      ),
    [vendors.data, category],
  );
  const activeVendor = vendorsInCategory.find((v) => v.id === vendorId) ?? null;
  const itemsInCategory = activeVendor
    ? activeVendor.catalog.filter((i) => i.category === category)
    : [];
  const item = itemsInCategory.find((i) => i.id === itemId) ?? null;

  const planAmountKobo = nairaToKobo(amount);
  const targetKobo = item ? item.priceKobo * Math.max(1, quantity) : 0;
  const weeks = Math.max(
    1,
    Math.ceil(targetKobo / Math.max(1, planAmountKobo)) * frequencyWeeks(frequency),
  );

  const canNext =
    (step === 0 && Boolean(category)) ||
    (step === 1 && Boolean(vendorId && itemId) && Number.isInteger(Number(quantity)) && Number(quantity) >= 1) ||
    (step === 2 && planAmountKobo >= MIN_GOODS_CONTRIBUTION_KOBO && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) ||
    (step === 3 && acknowledged);

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const created = await api.createGoodsTarget({
        vendorId,
        itemId,
        quantity: Number(quantity),
        planAmountKobo,
        frequency,
        startDate,
      });
      onCreated?.(created);
      onClose();
      navigate(`/app/goods/${created.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} title="Create a goods target" onClose={onClose} width="max-w-2xl">
      {/* Step rail */}
      <ol className="mb-6 flex flex-wrap gap-x-4 gap-y-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border font-manrope text-[10px] font-bold ${
                i < step
                  ? "border-[#5AB0FF] bg-[#5AB0FF] text-[#020817]"
                  : i === step
                    ? "border-[#5AB0FF] text-[#5AB0FF]"
                    : "border-white/25 text-white/35"
              }`}
            >
              {i < step ? <Check size={11} strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={`font-manrope text-[12px] ${i === step ? "font-semibold text-white" : "text-white/40"}`}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {/* 1 — category */}
      {step === 0 ? (
        <div>
          <p className="font-manrope text-[13px] text-white/55">
            What are you saving toward? Targets are grouped by category so the
            catalog can stay small and approved.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GOODS_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setVendorId("");
                  setItemId("");
                }}
                className={`rounded-[2px] border px-4 py-4 text-left transition-colors ${
                  category === c
                    ? "border-[#5AB0FF] bg-[#5AB0FF]/10"
                    : "border-white/12 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <span className="font-manrope text-[14px] font-semibold text-white">{c}</span>
                <span className="mt-1 block font-manrope text-[12px] text-white/45">
                  {c === "Foodstuff" && "Rice, oil, yam, beans and staples"}
                  {c === "Kitchen equipment" && "Cookers, blenders and prep tools"}
                  {c === "Household" && "Fans, lighting and storage"}
                  {c === "Other approved goods" && "Everything else on the catalog"}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* 2 — vendor + item */}
      {step === 1 ? (
        <div className="space-y-5">
          <Field label="Vendor" hint="Only approved, verified vendors appear here.">
            <Select
              id="vendor"
              value={vendorId}
              onChange={(e) => {
                setVendorId(e.target.value);
                setItemId("");
              }}
            >
              <option value="">Choose a vendor…</option>
              {vendorsInCategory.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.city}
                </option>
              ))}
            </Select>
          </Field>

          {activeVendor ? (
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="accent">
                <BadgeCheck size={12} />
                Verified vendor
              </Chip>
              <span className="font-manrope text-[12px] text-white/50">
                {activeVendor.name} · {activeVendor.city}
              </span>
              <span className="ml-auto font-manrope text-[11px] text-white/35">
                {activeVendor.payoutAccountRef}
              </span>
            </div>
          ) : null}

          <div>
            <p className="mb-2 font-manrope text-[12px] font-semibold text-white/60">Item</p>
            {itemsInCategory.length === 0 ? (
              <p className="font-manrope text-[13px] text-white/40">
                Choose a vendor to see its items.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {itemsInCategory.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => setItemId(i.id)}
                    className={`flex items-center gap-3 border px-3 py-3 text-left transition-colors ${
                      itemId === i.id
                        ? "border-[#5AB0FF] bg-[#5AB0FF]/10"
                        : "border-white/12 bg-white/[0.03] hover:border-white/25"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/12 bg-white/[0.05] text-white/45">
                      <Package size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-manrope text-[13.5px] font-semibold text-white">
                        {i.name}
                      </span>
                      <span className="block font-manrope text-[12px] text-white/45">
                        ₦{formatNaira(i.priceKobo)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Quantity"
              hint={item ? `₦${formatNaira(item.priceKobo)} each` : "Pick an item first"}
            >
              <Input
                id="qty"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </Field>
            <Field label="Target" hint="Price × quantity — read-only">
              <Input
                id="target-amount"
                readOnly
                value={targetKobo ? `₦${formatNaira(targetKobo)}` : "—"}
                className="text-white/70"
              />
            </Field>
          </div>
        </div>
      ) : null}

      {/* 3 — savings plan */}
      {step === 2 ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Contribution amount"
              hint={`Minimum ₦${formatNaira(MIN_GOODS_CONTRIBUTION_KOBO)} per payment`}
            >
              <Input
                id="plan-amount"
                type="number"
                min={500}
                step={100}
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </Field>
            <Field label="Frequency">
              <Select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                {GOODS_FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Start date">
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>

          {targetKobo > 0 && planAmountKobo >= MIN_GOODS_CONTRIBUTION_KOBO ? (
            <Banner>
              You'll reach ₦{formatNaira(targetKobo)} in about {weeks} {weeks === 1 ? "week" : "weeks"}
              .
            </Banner>
          ) : null}
        </div>
      ) : null}

      {/* 4 — review */}
      {step === 3 ? (
        <div className="space-y-4">
          <Card className="divide-y divide-white/10">
            {[
              ["Category", category],
              ["Vendor", activeVendor?.name ?? "—"],
              ["Item", item ? `${item.name} × ${quantity}` : "—"],
              ["Target", item ? `₦${formatNaira(targetKobo)}` : "—"],
              ["Savings plan", `₦${formatNaira(planAmountKobo)} · ${GOODS_FREQUENCIES.find((f) => f.value === frequency)?.label} · from ${startDate}`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 px-4 py-3">
                <span className="font-manrope text-[12.5px] text-white/45">{label}</span>
                <span className="text-right font-manrope text-[13px] font-semibold text-white">
                  {value}
                </span>
              </div>
            ))}
          </Card>

          <div className="border border-white/12 bg-white/[0.03] px-4 py-4">
            <p className="font-manrope text-[13px] leading-6 text-white/70">
              Vendor is paid only when the target is reached and you confirm the
              order. Any platform or vendor fees are shown below before you
              commit.
            </p>

            <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-manrope text-[12.5px] text-white/50">Platform fee</span>
                <span className="font-manrope text-[13px] text-white">
                  {fees.data ? `${fees.data.platformFeePercent}%` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-manrope text-[12.5px] text-white/50">Vendor fee</span>
                <span className="font-manrope text-[13px] text-white">
                  {fees.data ? `${fees.data.vendorFeePercent}%` : "—"}
                </span>
              </div>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#5AB0FF]"
            />
            <span className="font-manrope text-[13px] text-white/70">
              I understand how this works
            </span>
          </label>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 border border-red-400/30 bg-red-400/10 px-3 py-2.5">
          <p className="font-manrope text-[12.5px] text-red-200">{error}</p>
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <Button
          variant="ghost"
          onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
          disabled={submitting}
        >
          <ArrowLeft size={15} />
          {step === 0 ? "Cancel" : "Back"}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Continue
            <ArrowRight size={15} />
          </Button>
        ) : (
          <Button onClick={submit} disabled={!canNext || submitting}>
            {submitting ? "Creating…" : "Create target"}
          </Button>
        )}
      </div>
    </Modal>
  );
}
