import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import { useNotifications, useUser } from "../hooks/useData.js";

/** Titles derived from the path so the drawer, tab and topbar agree. */
function titleFor(pathname) {
  if (/^\/app\/goods\/[^/]+$/.test(pathname)) return "Goods target";
  if (pathname.startsWith("/app/goods")) return "Ajo-to-Goods";
  if (pathname.startsWith("/app/cycles")) return "Ajo cycles";
  if (pathname.startsWith("/app/ledger")) return "Ledger";
  if (pathname.startsWith("/app/notifications")) return "Notifications";
  if (pathname.startsWith("/app/profile")) return "Profile";
  return "Dashboard";
}

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useUser();
  const notifications = useNotifications();

  const title = titleFor(pathname);
  const unread = (notifications.data ?? []).filter((n) => !n.read).length;

  /* A new page starts at the top, and the tab title follows the page. */
  useEffect(() => {
    setDrawerOpen(false);
    window.scrollTo(0, 0);
    document.title = `${title} · Ajo Secure`;
  }, [pathname, title]);

  /* Close the drawer when focus lands outside it. */
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      {/* Fixed sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-white/10 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDrawerOpen(false);
          }}
        >
          <aside className="h-full w-[268px] border-r border-white/10">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-[248px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-[#020817]/85 px-4 backdrop-blur-md md:px-7">
          <button
            type="button"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen((o) => !o)}
            className="rounded-[2px] text-white/60 transition-colors hover:text-white lg:hidden"
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <h1 className="font-graphik text-[17px] text-white md:text-[19px]">{title}</h1>

          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/app/notifications"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              className="relative flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:text-white"
            >
              <Bell size={17} />
              {unread > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5AB0FF] px-1 font-manrope text-[10px] font-bold text-[#020817]">
                  {unread}
                </span>
              ) : null}
            </Link>

            <Link
              to="/app/profile"
              className="flex items-center gap-2.5"
              aria-label="Your profile"
            >
              <span className="hidden font-manrope text-[13px] text-white/60 sm:block">
                {user.data?.name ?? "…"}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5AB0FF]/20 font-manrope text-[12px] font-bold text-[#5AB0FF]">
                {initials(user.data?.name ?? "")}
              </span>
            </Link>
          </div>
        </header>

        <main className="px-4 py-6 md:px-7 md:py-8">
          <div className="mx-auto w-full max-w-[1180px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
