import { Outlet, type RouteObject } from "react-router-dom";
import VehicleBusinessTripsListPage from "../components/VehicleBusinessTripsListPage";
import VehicleBusinessTripCreatePage from "../components/VehicleBusinessTripCreatePage";
import VehicleBusinessTripEditPage from "../components/VehicleBusinessTripEditPage";
import VehicleBusinessTripDetail from "../components/VehicleBusinessTripDetailPage";

function VehicleBusinessTripsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const vehicleBusinessTripsRoutes: RouteObject = {
  path: "vehicle-business-trips",
  element: <VehicleBusinessTripsLayout />,
  children: [
    { index: true, element: <VehicleBusinessTripsListPage /> },
    { path: "create", element: <VehicleBusinessTripCreatePage /> },
    { path: ":id/edit", element: <VehicleBusinessTripEditPage /> },
    { path: ":id/details", element: <VehicleBusinessTripDetail /> },
  ],
};
