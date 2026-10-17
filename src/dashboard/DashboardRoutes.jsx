import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import CyclesPage from "./pages/CyclesPage.jsx";
import LedgerPage from "./pages/LedgerPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import GoodsHome from "./pages/goods/GoodsHome.jsx";
import GoodsTargetDetail from "./pages/goods/GoodsTargetDetail.jsx";
import { FEATURES } from "../config/features.js";

/**
 * Mounted at `/app/*`. When `FEATURES.ajoToGoods` is off, the goods routes are
 * replaced by a redirect, so there is no trace of the feature to navigate to.
 */
export default function DashboardRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="cycles" element={<CyclesPage />} />
        <Route path="ledger" element={<LedgerPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />

        {FEATURES.ajoToGoods ? (
          <>
            <Route path="goods" element={<GoodsHome />} />
            <Route path="goods/new" element={<GoodsHome autoOpen />} />
            <Route path="goods/:id" element={<GoodsTargetDetail />} />
          </>
        ) : (
          <Route path="goods/*" element={<Navigate to="/app" replace />} />
        )}

        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
    </Routes>
  );
}
