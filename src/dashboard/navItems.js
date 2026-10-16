import {
  Bell,
  BookOpen,
  LayoutDashboard,
  ShoppingBasket,
  User,
  Users,
} from "lucide-react";
import { FEATURES } from "../config/features.js";

/**
 * One source of truth for the sidebar, the mobile drawer and the route guard —
 * if the flag is off the item never enters this list, so it cannot appear in
 * the nav or be routed to.
 */
export const NAV_GROUPS = [
  {
    label: "Menu",
    items: [
      { label: "Dashboard", to: "/app", icon: LayoutDashboard, end: true },
      { label: "Ajo cycles", to: "/app/cycles", icon: Users },
      { label: "Ledger", to: "/app/ledger", icon: BookOpen },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Notifications", to: "/app/notifications", icon: Bell },
      { label: "Profile", to: "/app/profile", icon: User },
    ],
  },
];

/** A separate "More" section, sitting below the Profile group. */
export const MORE_GROUP = {
  label: "More",
  items: FEATURES.ajoToGoods
    ? [{ label: "Ajo-to-Goods", to: "/app/goods", icon: ShoppingBasket, beta: true }]
    : [],
};

export const ALL_NAV_ITEMS = [
  ...NAV_GROUPS.flatMap((g) => g.items),
  ...MORE_GROUP.items,
];
