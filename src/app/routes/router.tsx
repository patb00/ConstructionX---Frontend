import { createBrowserRouter } from "react-router-dom";
import LoginRoute from "../../features/auth/routes/LoginRoute";
import AppShell from "../layout/AppShell";
import DashboardRoute from "../../features/dashboard/routes/DashboardRoute";
import RequireAuth from "./RequireAuth";
import { companiesRoutes } from "../../features/administration/companies/routes";
import { tenantsRoutes } from "../../features/administration/tenants/routes";
import { rolesRoutes } from "../../features/administration/roles/routes";
import { usersRoles } from "../../features/administration/users/routes";
import { employeesRoutes } from "../../features/administration/employees/routes";
import { jobPostionRoutes } from "../../features/administration/job_positions/routes";

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
      },
      companiesRoutes,
      {
        path: "administration/roles",
      },
      rolesRoutes,
      {
        path: "administration/users",
      },
      usersRoles,
      {
        path: "administration/employees",
      },
      employeesRoutes,
      {
        path: "administration/jobPositions",
      },
      jobPostionRoutes,
    ],
  },
]);
