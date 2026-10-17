import "./styles/index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardRoutes from "./dashboard/DashboardRoutes.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/*" element={<DashboardRoutes />} />
      {/* Friendly alias: the dashboard is also reachable at /dashboard. */}
      <Route path="/dashboard/*" element={<Navigate to="/app" replace />} />
      {/* Unknown paths fall back to the landing page. */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
