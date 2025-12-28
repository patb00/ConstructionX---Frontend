import { Outlet, type RouteObject } from "react-router-dom";
import VehicleInsurancesListPage from "../components/VehicleInsurancesListPage";
import VehicleInsuranceCreatePage from "../components/VehicleInsuranceCreatePage";
import VehicleInsuranceEditPage from "../components/VehicleInsuranceEditPage";

function VehicleInsurancesLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const vehicleInsurancesRoutes: RouteObject = {
  path: "vehicle-insurances",
  element: <VehicleInsurancesLayout />,
  children: [
    { index: true, element: <VehicleInsurancesListPage /> },
    { path: "create", element: <VehicleInsuranceCreatePage /> },
    { path: ":id/edit", element: <VehicleInsuranceEditPage /> },
  ],
};
