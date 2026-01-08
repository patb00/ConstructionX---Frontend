import { Outlet, type RouteObject } from "react-router-dom";
import RequestsListPage from "../components/RequestListPage";

function RequestsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const tasksRoutes: RouteObject = {
  path: "tasks",
  element: <RequestsLayout />,
  children: [
    {
      index: true,
      element: <RequestsListPage />,
    },
  ],
};
