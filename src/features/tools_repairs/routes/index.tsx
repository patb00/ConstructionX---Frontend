import { Outlet, type RouteObject } from "react-router-dom";
import ToolRepairsListPage from "../components/ToolRepairsListPage";
import ToolRepairCreatePage from "../components/ToolRepairCreatePage";
import ToolRepairEditPage from "../components/ToolRepairEditPage";

function ToolRepairsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const toolRepairsRoutes: RouteObject = {
  path: "tool-repairs",
  element: <ToolRepairsLayout />,
  children: [
    { index: true, element: <ToolRepairsListPage /> },
    { path: "create", element: <ToolRepairCreatePage /> },
    { path: ":id/edit", element: <ToolRepairEditPage /> },
  ],
};
