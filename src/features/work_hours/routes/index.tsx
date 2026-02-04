import { Outlet, type RouteObject } from "react-router-dom";
import WorkHoursListPage from "../components/WorkHoursListPage";

function WorkHoursLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const workHoursRoutes: RouteObject = {
  path: "work-hours",
  element: <WorkHoursLayout />,
  children: [{ index: true, element: <WorkHoursListPage /> }],
};
