import { Link } from "react-router-dom";
import * as api from "../../services/api.js";
import { Card, Chip, ErrorBanner, Skeleton } from "../ui/index.jsx";
import { useNotifications } from "../hooks/useData.js";
import { formatDateTime } from "../components/goods/goodsMeta.js";

export default function NotificationsPage() {
  const notifications = useNotifications();
  const rows = notifications.data ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-graphik text-[22px] text-white md:text-[26px]">Notifications</h2>
        <p className="mt-1 font-manrope text-[13.5px] text-white/50">
          Records of what happened, written at the moment it happened.
        </p>
      </header>

      {notifications.error ? <ErrorBanner>{notifications.error.message}</ErrorBanner> : null}

      <Card className="divide-y divide-white/10">
        {notifications.loading ? (
          <div className="space-y-4 px-5 py-5">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        ) : rows.length === 0 ? (
          <p className="px-5 py-8 text-center font-manrope text-[13px] text-white/45">
            You have no notifications yet.
          </p>
        ) : (
          rows.map((n) => (
            <div key={n.id} className="flex items-start gap-4 px-5 py-4">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-white/20" : "bg-[#5AB0FF]"}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-manrope text-[13.5px] font-semibold text-white">{n.title}</p>
                  <Chip tone={n.kind === "GOODS" ? "accent" : "neutral"}>
                    {n.kind === "GOODS" ? "Goods" : "Ajo"}
                  </Chip>
                  {!n.read ? <Chip tone="muted">Unread</Chip> : null}
                </div>
                <p className="mt-1 font-manrope text-[12.5px] leading-5 text-white/55">{n.body}</p>
                <p className="mt-1 font-manrope text-[11px] text-white/35">{formatDateTime(n.at)}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {n.link ? (
                  <Link
                    to={n.link}
                    className="font-manrope text-[12px] font-semibold text-[#5AB0FF]"
                  >
                    Open
                  </Link>
                ) : null}
                {!n.read ? (
                  <button
                    type="button"
                    onClick={() => api.markNotificationRead(n.id)}
                    className="rounded-[2px] font-manrope text-[12px] text-white/45 transition-colors hover:text-white"
                  >
                    Mark read
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
