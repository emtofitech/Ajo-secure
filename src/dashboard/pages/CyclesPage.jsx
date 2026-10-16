import { Card, Chip, ErrorBanner, ProgressBar, Skeleton } from "../ui/index.jsx";
import { useCycles } from "../hooks/useData.js";
import { formatNaira } from "../../services/mockDb.js";
import { formatDate } from "../components/goods/goodsMeta.js";

export default function CyclesPage() {
  const cycles = useCycles();
  const rows = cycles.data ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-graphik text-[22px] text-white md:text-[26px]">Ajo cycles</h2>
        <p className="mt-1 font-manrope text-[13.5px] text-white/50">
          Each cycle pools contributions and pays out in turn. Payouts stay on the ledger.
        </p>
      </header>

      {cycles.error ? <ErrorBanner>{cycles.error.message}</ErrorBanner> : null}

      {cycles.loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rows.map((c) => {
            const pct = c.memberCount ? (c.paidCount / c.memberCount) * 100 : 0;
            return (
              <Card key={c.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-manrope text-[15px] font-bold text-white">{c.name}</p>
                    <p className="mt-1 font-manrope text-[12.5px] text-white/45">
                      ₦{formatNaira(c.contributionKobo)} per member · started{" "}
                      {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <Chip tone={c.status === "FUNDING" ? "accent" : "success"}>
                    {c.status === "FUNDING" ? "Funding" : "Settled"}
                  </Chip>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between font-manrope text-[12.5px] text-white/50">
                    <span>
                      {c.paidCount} of {c.memberCount} members paid
                    </span>
                    <span>{Math.round(pct)}%</span>
                  </div>
                  <ProgressBar value={pct} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-manrope text-[12px] text-white/40">
                    {c.status === "FUNDING" ? "Next payout" : "Last payout"}
                  </span>
                  <span className="font-manrope text-[12.5px] font-semibold text-white">
                    {formatDate(c.nextPayoutAt)} · {c.recipientName}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
