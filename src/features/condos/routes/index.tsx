import { Outlet, type RouteObject } from "react-router-dom";

import CondoCreatePage from "../components/CondoCreatePage";
import CondoDetailPage from "../components/CondoDetailPage";
import CondoEditPage from "../components/CondoEditPage";
import CondosListPage from "../components/CondosListPage";

function CondosLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const condosRoutes: RouteObject = {
  path: "condos",
  element: <CondosLayout />,
  children: [
    { index: true, element: <CondosListPage /> },
    { path: "create", element: <CondoCreatePage /> },
    { path: ":id/details", element: <CondoDetailPage /> },
    { path: ":id/edit", element: <CondoEditPage /> },
  ],
};
