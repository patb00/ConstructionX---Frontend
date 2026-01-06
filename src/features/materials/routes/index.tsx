import { Outlet, type RouteObject } from "react-router-dom";
import MaterialsListPage from "../components/MaterialsListPage";
import MaterialCreatePage from "../components/MaterialCreatePage";
import MaterialEditPage from "../components/MaterialEditPage";

function MaterialsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const materialsRoutes: RouteObject = {
  path: "materials",
  element: <MaterialsLayout />,
  children: [
    { index: true, element: <MaterialsListPage /> },
    { path: "create", element: <MaterialCreatePage /> },
    { path: ":id/edit", element: <MaterialEditPage /> },
  ],
};
