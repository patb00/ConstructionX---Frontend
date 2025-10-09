import { Outlet, type RouteObject } from "react-router-dom";
import RoleslListPage from "../components/RoleListPage";
import RoleCreatePage from "../components/RolesCreatePage";
import RolePermissionsPage from "../components/RolePermissionsPage";
import RoleEditPage from "../components/RoleEditPage";

function RolesLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const rolesRoutes: RouteObject = {
  path: "administration/roles",
  element: <RolesLayout />,
  children: [
    { index: true, element: <RoleslListPage /> },
    { path: "create", element: <RoleCreatePage /> },
    { path: ":roleId/permissions", element: <RolePermissionsPage /> },
    { path: ":roleId/edit", element: <RoleEditPage /> },
  ],
};
