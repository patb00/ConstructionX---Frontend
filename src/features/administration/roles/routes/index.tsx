import { Outlet, type RouteObject } from "react-router-dom";
import RoleslListPage from "../components/RoleListPage";
import RoleCreatePage from "../components/RolesCreatePage";

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
  ],
};
