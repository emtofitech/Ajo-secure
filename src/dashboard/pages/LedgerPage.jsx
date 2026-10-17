import { useState } from "react";
import { LEDGER_TYPES } from "../../services/mockDb.js";
import { formatNaira } from "../../services/mockDb.js";
import { Card, Chip, ErrorBanner, Skeleton } from "../ui/index.jsx";
import { useLedger } from "../hooks/useData.js";
import { formatDateTime } from "../components/goods/goodsMeta.js";

/* The Ajo filter gains a "Goods" option. */
const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "AJO", label: "Ajo" },
  { key: "GOODS", label: "Goods" },
];

export default function LedgerPage() {
  const [scope, setScope] = useState("ALL");
  const ledger = useLedger(scope);
  const rows = ledger.data ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-graphik text-[22px] text-white md:text-[26px]">Ledger</h2>
        <p className="mt-1 font-manrope text-[13.5px] text-white/50">
          Every entry is append-only. Nothing here is ever edited or deleted.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setScope(f.key)}
            className={`rounded-full border px-3.5 py-1.5 font-manrope text-[12.5px] font-semibold transition-colors ${
              scope === f.key
                ? "border-[#5AB0FF] bg-[#5AB0FF]/15 text-[#5AB0FF]"
                : "border-white/12 text-white/50 hover:border-white/25 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {ledger.error ? <ErrorBanner>{ledger.error.message}</ErrorBanner> : null}

      <Card>
        {/* header row */}
        <div className="hidden grid-cols-[1.6fr_1fr_1fr_auto] gap-4 border-b border-white/10 px-5 py-3 md:grid">
          {["Entry", "Type", "When", "Amount"].map((h) => (
            <span
              key={h}
              className="font-manrope text-[11px] uppercase tracking-wide text-white/35"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="divide-y divide-white/10">
          {ledger.loading ? (
            <div className="space-y-3 px-5 py-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <p className="px-5 py-8 text-center font-manrope text-[13px] text-white/45">
              No entries for this filter yet.
            </p>
          ) : (
            rows.map((e) => {
              const meta = LEDGER_TYPES[e.type] ?? { label: e.type, tag: "Ajo" };
              return (
                <div
                  key={e.id}
                  className="grid grid-cols-1 gap-2 px-5 py-3.5 md:grid-cols-[1.6fr_1fr_1fr_auto] md:items-center md:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-manrope text-[13.5px] font-semibold text-white">
                      {e.memo}
                    </p>
                    <p className="font-manrope text-[11px] text-white/35">#{e.txId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip tone={meta.tag === "Goods" ? "accent" : "neutral"}>{meta.label}</Chip>
                    <Chip tone="muted">{meta.tag}</Chip>
                  </div>
                  <p className="font-manrope text-[12.5px] text-white/50">
                    {formatDateTime(e.at)}
                  </p>
                  <p className="font-manrope text-[13.5px] font-semibold text-white md:text-right">
                    {e.direction === "CREDIT" ? "+" : "−"}₦{formatNaira(e.amountKobo)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
