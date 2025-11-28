import { Outlet, type RouteObject } from "react-router-dom";

import ModuleReportsPage from "../components/ModuleReportsPage";
import ReportsModulesListPage from "../components/ReportsModuleListPage";

function ReportsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const reportsRoutes: RouteObject = {
  path: "izvjestaji",
  element: <ReportsLayout />,
  children: [
    {
      index: true,
      element: <ReportsModulesListPage />,
    },
    {
      path: ":moduleId",
      element: <ModuleReportsPage />,
    },
  ],
};
