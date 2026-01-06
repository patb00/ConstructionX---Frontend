import { Outlet, type RouteObject } from "react-router-dom";
import VehicleRepairsListPage from "../components/VehicleRepairsListPage";

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
  children: [{ index: true, element: <VehicleRepairsListPage /> }],
};
