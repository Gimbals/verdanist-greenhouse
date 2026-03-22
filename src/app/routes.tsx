import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Layout } from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MonitoringPage } from "./pages/MonitoringPage";
import { ControlPage } from "./pages/ControlPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { HelpPage } from "./pages/HelpPage";
import { AuthWrapper } from "./components/AuthWrapper";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthWrapper,
    children: [
      {
        path: "/",
        Component: LandingPage,
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
      {
        path: "/auth/callback",
        Component: AuthCallbackPage,
      },
      {
        Component: Layout,
        children: [
          { path: "dashboard", Component: DashboardPage },
          { path: "monitoring", Component: MonitoringPage },
          { path: "control", Component: ControlPage },
          { path: "reports", Component: ReportsPage },
          { path: "settings", Component: SettingsPage },
          { path: "profile", Component: ProfilePage },
          { path: "help", Component: HelpPage },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ],
  },
]);