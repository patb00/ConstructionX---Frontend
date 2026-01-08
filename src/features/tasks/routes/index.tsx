import { Outlet, type RouteObject } from "react-router-dom";
import TasksListPage from "../components/TasksListPage";

function TasksLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const tasksRoutes: RouteObject = {
  path: "tasks",
  element: <TasksLayout />,
  children: [
    {
      index: true,
      element: <TasksListPage />,
    },
  ],
};
