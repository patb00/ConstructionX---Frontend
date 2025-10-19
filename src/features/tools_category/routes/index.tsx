import { Outlet, type RouteObject } from "react-router-dom";
import ToolCategoriesListPage from "../components/ToolCategoriesListPage";
import ToolCategoryCreatePage from "../components/ToolCategoryCreatePage";
import ToolCategoryEditPage from "../components/ToolCategoryEditPage";

function ToolCategoriesLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const toolCategoriesRoutes: RouteObject = {
  path: "tool-categories",
  element: <ToolCategoriesLayout />,
  children: [
    { index: true, element: <ToolCategoriesListPage /> },
    { path: "create", element: <ToolCategoryCreatePage /> },
    { path: ":id/edit", element: <ToolCategoryEditPage /> },
  ],
};
