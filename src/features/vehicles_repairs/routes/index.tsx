import { Outlet, type RouteObject } from "react-router-dom";
import VehicleRepairsListPage from "../components/VehicleRepairsListPage";
import VehicleRepairCreatePage from "../components/VehicleRepairCreatePage";
import VehicleRepairEditPage from "../components/VehicleRepairEditPage";

function VehicleRepairsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const vehicleRepairsRoutes: RouteObject = {
  path: "vehicle-repairs",
  element: <VehicleRepairsLayout />,
  children: [
    { index: true, element: <VehicleRepairsListPage /> },
    { path: "create", element: <VehicleRepairCreatePage /> },
    { path: ":id/edit", element: <VehicleRepairEditPage /> },
  ],
};
