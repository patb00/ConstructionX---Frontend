import { Outlet, type RouteObject } from "react-router-dom";
import ToolRepairsListPage from "../components/ToolRepairsListPage";

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
  children: [{ index: true, element: <ToolRepairsListPage /> }],
};
