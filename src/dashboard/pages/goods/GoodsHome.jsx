import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Package, Plus } from "lucide-react";
import {
  Banner,
  BetaChip,
  Button,
  Card,
  CardSkeleton,
  Chip,
  EmptyState,
  ErrorBanner,
  ProgressBar,
  Skeleton,
  StatCard,
  VerifiedBadge,
} from "../../ui/index.jsx";
import { useGoodsSummary, useGoodsTargets, useGoodsVendors } from "../../hooks/useData.js";
import CreateTargetModal from "../../components/goods/CreateTargetModal.jsx";
import {
  TAB_FILTERS,
  formatDate,
  progressPct,
  projectedCompletion,
  statusMeta,
} from "../../components/goods/goodsMeta.js";
import { formatNaira } from "../../../services/mockDb.js";

function TargetCard({ target }) {
  const meta = statusMeta(target.status);
  const projection = projectedCompletion(target);

  return (
    <Link to={`/app/goods/${target.id}`} className="block">
      <Card className="h-full p-5 transition-colors hover:border-[#5AB0FF]/40">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 bg-white/[0.05] text-[#5AB0FF]">
            <Package size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-manrope text-[14.5px] font-bold text-white">
              {target.itemName}
            </p>
            <p className="mt-0.5 font-manrope text-[12px] text-white/45">
              {target.quantity} × ₦{formatNaira(target.itemPriceKobo)}
            </p>
          </div>
          <Chip tone={meta.tone}>{meta.label}</Chip>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Chip tone="neutral">{target.category}</Chip>
          <span className="inline-flex items-center gap-1 font-manrope text-[12px] text-white/50">
            <BadgeCheck size={13} className="text-[#5AB0FF]" />
            Verified vendor
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-end justify-between">
            <span className="font-manrope text-[13px] font-semibold text-white">
              ₦{formatNaira(target.savedKobo)}{" "}
              <span className="font-normal text-white/40">/ ₦{formatNaira(target.targetKobo)}</span>
            </span>
            <span className="font-manrope text-[12px] text-white/45">
              {Math.round(progressPct(target))}%
            </span>
          </div>
          <ProgressBar value={progressPct(target)} className="mt-2" />
        </div>

        <p className="mt-3 font-manrope text-[12px] text-white/45">
          {projection
            ? `Projected completion ${formatDate(projection.date)} · about ${projection.weeks} ${
                projection.weeks === 1 ? "week" : "weeks"
              } left`
            : meta.note}
        </p>
      </Card>
    </Link>
  );
}

function VendorCard({ vendor }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-manrope text-[13.5px] font-bold text-white">{vendor.name}</p>
          <p className="mt-0.5 font-manrope text-[12px] text-white/45">{vendor.city}</p>
        </div>
        <VerifiedBadge />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {vendor.categories.map((c) => (
          <Chip key={c} tone="neutral">
            {c}
          </Chip>
        ))}
      </div>
      <p className="mt-3 font-manrope text-[11.5px] text-white/35">
        {vendor.catalog.length} catalog items · {vendor.payoutAccountRef}
      </p>
    </Card>
  );
}

export default function GoodsHome({ autoOpen = false }) {
  const targets = useGoodsTargets();
  const vendors = useGoodsVendors();
  const summary = useGoodsSummary();
  const [tab, setTab] = useState("ALL");
  const [createOpen, setCreateOpen] = useState(autoOpen);

  const rows = useMemo(() => {
    const all = targets.data ?? [];
    const filter = TAB_FILTERS.find((t) => t.key === tab) ?? TAB_FILTERS[0];
    return all.filter(filter.match);
  }, [targets.data, tab]);

  const s = summary.data;

  return (
    <div className="space-y-7">
      {/* Header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <p className="font-manrope text-[11px] uppercase tracking-wide text-[#5AB0FF]">
              [ AJO_TO_GOODS ]
            </p>
            <BetaChip />
          </div>
          <h1 className="mt-2 font-graphik text-[26px] leading-tight text-white md:text-[34px]">
            Save toward what you need.
          </h1>
          <p className="mt-3 font-manrope text-[14px] leading-7 text-white/55">
            Set aside money for foodstuff, kitchen equipment or other approved goods.
            When you reach your target, a verified vendor is notified. This is
            separate from your Ajo contributions.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shrink-0">
          <Plus size={16} />
          Create target
        </Button>
      </header>

      <Banner>
        Goods savings are kept apart from your Ajo pool. Vendors are verified, and
        nobody can change where the money goes.
      </Banner>

      {targets.error ? <ErrorBanner>{targets.error.message}</ErrorBanner> : null}

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active targets" value={s ? s.activeCount : "—"} />
        <StatCard label="Total saved" value={s ? `₦${formatNaira(s.savedKobo)}` : "—"} />
        <StatCard label="Ready for order" value={s ? s.readyCount : "—"} />
        <StatCard label="Completed" value={s ? s.completedCount : "—"} />
      </section>

      {/* Targets */}
      <section>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {TAB_FILTERS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full border px-3.5 py-1.5 font-manrope text-[12.5px] font-semibold transition-colors ${
                tab === t.key
                  ? "border-[#5AB0FF] bg-[#5AB0FF]/15 text-[#5AB0FF]"
                  : "border-white/12 text-white/50 hover:border-white/25 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {targets.loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No goods targets yet"
            body="Create a target and start setting money aside. You will only ever pay an approved, verified vendor."
            action={
              <Button onClick={() => setCreateOpen(true)}>
                <Plus size={16} />
                Create target
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((t) => (
              <TargetCard key={t.id} target={t} />
            ))}
          </div>
        )}
      </section>

      {/* Approved vendors (read-only) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-manrope text-[16px] font-bold text-white">Approved vendors</h2>
            <p className="font-manrope text-[12.5px] text-white/45">
              Read-only. Vendors are verified before they join the catalog, and their
              payout account is set by us — never typed by a member.
            </p>
          </div>
        </div>

        {vendors.loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(vendors.data ?? []).map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </section>

      <p className="font-manrope text-[11.5px] leading-5 text-white/35">
        Ajo-to-Goods is a beta feature. Vendor availability, fees and refund terms are
        confirmed before launch.
      </p>

      <CreateTargetModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
