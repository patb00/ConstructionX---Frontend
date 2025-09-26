import { createBrowserRouter } from "react-router-dom";
import LoginRoute from "../../features/auth/routes/LoginRoute";
import AppShell from "../layout/AppShell";
import DashboardRoute from "../../features/dashboard/routes/DashboardRoute";
import CompaniesListPage from "../../features/administration/components/companies/CompaniesListPage";
import { tenantsRoutes } from "../../features/administration/routes/tenants";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
  { path: "/", element: <LoginRoute /> },
  {
    path: "/app",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { path: "dashboard", element: <DashboardRoute /> },
      tenantsRoutes,
      {
        path: "administration/companies",
        children: [{ index: true, element: <CompaniesListPage /> }],
      },
    ],
  },
]);
