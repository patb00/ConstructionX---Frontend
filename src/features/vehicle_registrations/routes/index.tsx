import { Outlet, type RouteObject } from "react-router-dom";
import VehicleRegistrationsListPage from "../components/VehicleRegistrationsListPage";
import VehicleRegistrationCreatePage from "../components/VehicleRegistrationCreatePage";
import VehicleRegistrationEditPage from "../components/VehicleRegistrationEditPage";
import VehicleRegistrationDetailPage from "../components/VehicleRegistrationDetailPage";

function VehicleRegistrationsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const vehicleRegistrationsRoutes: RouteObject = {
  path: "vehicle-registrations",
  element: <VehicleRegistrationsLayout />,
  children: [
    { index: true, element: <VehicleRegistrationsListPage /> },
    { path: "create", element: <VehicleRegistrationCreatePage /> },
    { path: ":id/edit", element: <VehicleRegistrationEditPage /> },
    { path: ":id/details", element: <VehicleRegistrationDetailPage /> },
  ],
};
