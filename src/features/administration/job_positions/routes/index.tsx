import { Outlet, type RouteObject } from "react-router-dom";
import JobPositionsListPage from "../components/JobPositionsListPage";
import JobPositionCreatePage from "../components/JobPositionCreatePage";
import JobPositionEditPage from "../components/JobPositionEditPage";

function JobPositionLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const jobPostionRoutes: RouteObject = {
  path: "administration/jobPositions",
  element: <JobPositionLayout />,
  children: [
    { index: true, element: <JobPositionsListPage /> },
    { path: "create", element: <JobPositionCreatePage /> },
    { path: ":id/edit", element: <JobPositionEditPage /> },
  ],
};
