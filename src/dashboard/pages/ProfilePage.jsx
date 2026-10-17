import { ShieldCheck } from "lucide-react";
import { Card, CardHeader, Chip, ErrorBanner, Skeleton } from "../ui/index.jsx";
import { useUser } from "../hooks/useData.js";
import { formatDate } from "../components/goods/goodsMeta.js";

function Row({ label, value, chip }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 last:border-b-0">
      <span className="font-manrope text-[12.5px] text-white/45">{label}</span>
      <span className="text-right font-manrope text-[13.5px] font-semibold text-white">
        {chip ?? value}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const user = useUser();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-graphik text-[22px] text-white md:text-[26px]">Profile</h2>
        <p className="mt-1 font-manrope text-[13.5px] text-white/50">
          Your identity and payout account. Payout accounts are verified, never typed.
        </p>
      </header>

      {user.error ? <ErrorBanner>{user.error.message}</ErrorBanner> : null}

      {user.loading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Your details" />
            <div>
              <Row label="Name" value={user.data.name} />
              <Row label="Email" value={user.data.email} />
              <Row label="Phone" value={user.data.phone} />
              <Row label="Member since" value={formatDate(user.data.createdAt)} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Account" />
            <div>
              <Row
                label="KYC status"
                chip={
                  <Chip tone={user.data.kycStatus === "VERIFIED" ? "success" : "warning"}>
                    <ShieldCheck size={12} />
                    {user.data.kycStatus === "VERIFIED" ? "Verified" : "Pending"}
                  </Chip>
                }
              />
              <Row label="Payout account" value={user.data.payoutAccountRef} />
              <Row
                label="Ledger"
                value="Append-only — entries are never edited"
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
