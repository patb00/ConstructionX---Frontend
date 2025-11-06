import { Outlet, type RouteObject } from "react-router-dom";
import AssignmentsListPage from "../components/AssignmentsListPage";

function AssignmentsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const assignmentsRoutes: RouteObject = {
  path: "assignments",
  element: <AssignmentsLayout />,
  children: [{ index: true, element: <AssignmentsListPage /> }],
};
