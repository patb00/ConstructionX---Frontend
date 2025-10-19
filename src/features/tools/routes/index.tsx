import { Outlet, type RouteObject } from "react-router-dom";
import ToolsListPage from "../components/ToolsListPage";
import ToolCreatePage from "../components/ToolCreatePage";
import ToolEditPage from "../components/ToolEditPage";

function ToolsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const toolsRoutes: RouteObject = {
  path: "tools",
  element: <ToolsLayout />,
  children: [
    { index: true, element: <ToolsListPage /> },
    { path: "create", element: <ToolCreatePage /> },
    { path: ":id/edit", element: <ToolEditPage /> },
  ],
};
