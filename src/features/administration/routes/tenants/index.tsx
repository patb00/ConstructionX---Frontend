import { Outlet, type RouteObject } from "react-router-dom";
import TenantsListPage from "../../components/tenants/TenantsListPage";
import TenantCreatePage from "../../components/tenants/TenantCreatePage";
import TenantDetailsPage from "../../components/tenants/TenantDetailsPage";

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
