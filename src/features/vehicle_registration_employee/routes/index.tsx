import { Outlet, type RouteObject } from "react-router-dom";
import VehicleRegistrationTasksPage from "../components/VehicleRegistrationTasksPage";

function VehicleRegistrationTasksLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const tasksRoutes: RouteObject = {
  path: "requests1",
  element: <VehicleRegistrationTasksLayout />,
  children: [
    {
      index: true,
      element: <VehicleRegistrationTasksPage />,
    },
  ],
};
