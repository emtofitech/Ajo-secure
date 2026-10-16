import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
  ShoppingBasket,
  Users,
  Wallet,
} from "lucide-react";
import {
  BetaChip,
  Card,
  Chip,
  ErrorBanner,
  ProgressBar,
  StatCard,
} from "../ui/index.jsx";
import { useCycles, useGoodsSummary, useLedger, useUser } from "../hooks/useData.js";
import { formatNaira } from "../../services/mockDb.js";
import { formatDate } from "../components/goods/goodsMeta.js";
import { FEATURES } from "../../config/features.js";

/** The sixth card: matches the other five, adds the beta marker. */
function GoodsCard() {
  const summary = useGoodsSummary();
  const s = summary.data;

  return (
    <Card className="flex items-start justify-between gap-3 p-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-manrope text-[11px] uppercase tracking-wide text-white/40">
            Ajo-to-Goods
          </p>
          <BetaChip />
        </div>
        <p className="mt-2 font-graphik text-[26px] leading-none text-white">
          {summary.loading ? "—" : (s?.activeCount ?? 0)}
        </p>
        <p className="mt-2 font-manrope text-[12px] text-white/50">
          {summary.loading
            ? "Loading targets…"
            : s && s.activeCount > 0
              ? `₦${formatNaira(s.savedKobo)} saved across targets`
              : "Save toward goods you need."}
        </p>
        <Link
          to="/app/goods"
          className="mt-3 inline-flex items-center gap-1 font-manrope text-[12.5px] font-semibold text-[#5AB0FF] transition-opacity hover:opacity-80"
        >
          View
          <ArrowRight size={13} />
        </Link>
      </div>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#5AB0FF]/30 bg-[#5AB0FF]/10 text-[#5AB0FF]">
        <ShoppingBasket size={17} />
      </span>
    </Card>
  );
}

export default function DashboardHome() {
  const user = useUser();
  const cycles = useCycles();
  const ledger = useLedger("ALL");

  const list = cycles.data ?? [];
  const active = list.filter((c) => c.status === "FUNDING");
  const nextCycle = active[0];
  const entries = ledger.data ?? [];
  const contributed = entries
    .filter((e) => e.type === "CONTRIBUTION" && e.direction === "DEBIT")
    .reduce((sum, e) => sum + e.amountKobo, 0);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-graphik text-[22px] text-white md:text-[26px]">
          Welcome back, {user.data?.name?.split(" ")[0] ?? "there"}.
        </h2>
        <p className="mt-1 font-manrope text-[13.5px] text-white/50">
          Everything you contribute is on the ledger, permanently.
        </p>
      </header>

      {cycles.error || ledger.error ? (
        <ErrorBanner>{(cycles.error ?? ledger.error).message}</ErrorBanner>
      ) : null}

      {/* Six cards: 1 / 2 / 3 columns */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Active cycles"
          value={list.length ? active.length : "0"}
          sub={nextCycle ? `Next: ${nextCycle.name}` : "No active cycle"}
          icon={Users}
        />
        <StatCard
          label="Total contributed"
          value={ledger.loading ? "—" : `₦${formatNaira(contributed)}`}
          sub="Across all cycles"
          icon={Wallet}
        />
        <StatCard
          label="Next payout"
          value={nextCycle ? `₦${formatNaira(nextCycle.contributionKobo)}` : "—"}
          sub={nextCycle ? formatDate(nextCycle.nextPayoutAt) : "Nothing scheduled"}
          icon={CalendarCheck}
        />
        <StatCard
          label="Ledger entries"
          value={ledger.loading ? "—" : entries.length}
          sub="Append-only record"
          icon={BookOpen}
        />
        <StatCard
          label="Account status"
          value={user.loading ? "—" : user.data?.kycStatus === "VERIFIED" ? "Verified" : "Pending"}
          sub={user.data?.payoutAccountRef ?? ""}
          icon={ShieldCheck}
        />
        {FEATURES.ajoToGoods ? <GoodsCard /> : null}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cycles */}
        <Card>
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h3 className="font-manrope text-[15px] font-bold text-white">Your cycles</h3>
            <Link
              to="/app/cycles"
              className="font-manrope text-[12.5px] font-semibold text-[#5AB0FF]"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {cycles.loading ? (
              <div className="space-y-3 px-5 py-5">
                <div className="h-3 w-2/3 animate-pulse bg-white/[0.07]" />
                <div className="h-3 w-1/2 animate-pulse bg-white/[0.07]" />
              </div>
            ) : list.length === 0 ? (
              <p className="px-5 py-6 font-manrope text-[13px] text-white/45">
                You have not joined a cycle yet.
              </p>
            ) : (
              list.map((c) => {
                const pct = c.memberCount ? (c.paidCount / c.memberCount) * 100 : 0;
                return (
                  <div key={c.id} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-manrope text-[13.5px] font-semibold text-white">
                        {c.name}
                      </p>
                      <Chip tone={c.status === "FUNDING" ? "accent" : "neutral"}>
                        {c.status === "FUNDING" ? "Funding" : "Settled"}
                      </Chip>
                    </div>
                    <p className="mt-1 font-manrope text-[12px] text-white/45">
                      ₦{formatNaira(c.contributionKobo)} × {c.memberCount} members ·{" "}
                      {c.paidCount} paid
                    </p>
                    <ProgressBar value={pct} className="mt-2" />
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Recent ledger */}
        <Card>
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h3 className="font-manrope text-[15px] font-bold text-white">Recent activity</h3>
            <Link
              to="/app/ledger"
              className="font-manrope text-[12.5px] font-semibold text-[#5AB0FF]"
            >
              Open ledger
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {ledger.loading ? (
              <div className="space-y-3 px-5 py-5">
                <div className="h-3 w-1/2 animate-pulse bg-white/[0.07]" />
                <div className="h-3 w-2/3 animate-pulse bg-white/[0.07]" />
                <div className="h-3 w-1/3 animate-pulse bg-white/[0.07]" />
              </div>
            ) : (
              entries.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-manrope text-[13px] font-semibold text-white">
                      {e.memo}
                    </p>
                    <p className="font-manrope text-[11.5px] text-white/40">{formatDate(e.at)}</p>
                  </div>
                  <Chip tone={e.type.startsWith("GOODS_") ? "accent" : "neutral"}>
                    {e.type.startsWith("GOODS_") ? "Goods" : "Ajo"}
                  </Chip>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
