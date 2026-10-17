import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.webp";
import { BetaChip } from "../ui/index.jsx";
import { MORE_GROUP, NAV_GROUPS } from "../navItems.js";

/* One active style, used by every item including Ajo-to-Goods. */
function itemClasses({ isActive }) {
  return [
    "flex items-center gap-3 px-3 py-2.5 border-l-2 font-manrope text-[13.5px] transition-colors",
    isActive
      ? "border-[#5AB0FF] bg-[#5AB0FF]/10 text-white"
      : "border-transparent text-white/55 hover:border-white/25 hover:bg-white/[0.05] hover:text-white",
  ].join(" ");
}

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={itemClasses}
      onClick={onNavigate}
    >
      <item.icon size={17} className="shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.beta ? <BetaChip className="ml-auto" /> : null}
    </NavLink>
  );
}

export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-[#040b1d]">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-5">
        <img src={logo} alt="Ajo Secure logo" className="h-6 w-auto" />
        <span className="font-graphik text-[17px] text-white">AjoSecure</span>
        <span className="ml-auto rounded-full bg-white/10 px-1.5 py-px font-manrope text-[10px] font-semibold text-white/50">
          APP
        </span>
      </div>

      {/* Primary groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Dashboard">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-3 font-manrope text-[11px] uppercase tracking-wide text-white/40">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavItem key={item.to} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}

        {/* "More" section — only rendered when the feature flag is on. */}
        {MORE_GROUP.items.length > 0 ? (
          <div className="mb-6">
            <div className="mb-3 h-px w-full bg-white/10" />
            <p className="mb-2 px-3 font-manrope text-[11px] uppercase tracking-wide text-white/40">
              {MORE_GROUP.label}
            </p>
            <div className="space-y-1">
              {MORE_GROUP.items.map((item) => (
                <NavItem key={item.to} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ) : null}
      </nav>

      {/* Footer note */}
      <div className="shrink-0 border-t border-white/10 px-5 py-4">
        <p className="font-manrope text-[11px] leading-5 text-white/35">
          Contributions and payouts are recorded on an append-only ledger.
        </p>
      </div>
    </div>
  );
}
