import { Outlet, type RouteObject } from "react-router-dom";
import MyVehicleRegistrationTasksPage from "../components/VehicleRegistrationTasksPage";

function VehicleRegistrationTasksLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const vehicleRegistrationTasksRoutes: RouteObject = {
  path: "tasks",
  element: <VehicleRegistrationTasksLayout />,
  children: [{ index: true, element: <MyVehicleRegistrationTasksPage /> }],
};
