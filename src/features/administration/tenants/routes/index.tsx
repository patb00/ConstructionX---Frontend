import TenantsListPage from "../components/TenantsListPage";
import TenantDetailsPage from "../components/TenantDetailsPage";
import { Outlet, type RouteObject } from "react-router-dom";
import TenantCreatePage from "../components/TenantCreatePage";

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
  ],
};
