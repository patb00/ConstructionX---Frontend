import { Outlet, type RouteObject } from "react-router-dom";
import VehiclesListPage from "../components/VehiclesListPage";
import VehicleCreatePage from "../components/VehicleCreatePage";
import VehicleEditPage from "../components/VehicleEditPage";

function VehiclesLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const vehiclesRoutes: RouteObject = {
  path: "vehicles",
  element: <VehiclesLayout />,
  children: [
    { index: true, element: <VehiclesListPage /> },
    { path: "create", element: <VehicleCreatePage /> },
    { path: ":id/edit", element: <VehicleEditPage /> },
  ],
};
