import { Outlet, type RouteObject } from "react-router-dom";
import MyVehicleRegistrationTasksPage from "../components/MyVehicleRegistrationTasksPage";
import MyVehicleRegistrationTaskDetailsPage from "../components/MyVehicleRegistrationTaskDetailsPage";

function VehicleRegistrationTasksLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const vehicleRegistrationTasksRoutes: RouteObject = {
  path: "my-vehicle-registration-tasks",
  element: <VehicleRegistrationTasksLayout />,
  children: [
    { index: true, element: <MyVehicleRegistrationTasksPage /> },
    {
      path: ":taskId",
      element: <MyVehicleRegistrationTaskDetailsPage />,
    },
  ],
};
