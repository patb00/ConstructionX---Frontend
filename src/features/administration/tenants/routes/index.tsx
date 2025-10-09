import TenantsListPage from "../components/TenantsListPage";
import TenantDetailsPage from "../components/TenantDetailsPage";
import TenantCreatePage from "../components/TenantCreatePage";
import TenantEditPage from "../components/TenantEditPage";
import { Outlet, type RouteObject } from "react-router-dom";

function TenantsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const tenantsRoutes: RouteObject = {
  path: "administration/tenants",
  element: <TenantsLayout />,
  children: [
    { index: true, element: <TenantsListPage /> },
    { path: "create", element: <TenantCreatePage /> },
    { path: ":tenantId", element: <TenantDetailsPage /> },
    { path: ":tenantId/edit", element: <TenantEditPage /> },
  ],
};
