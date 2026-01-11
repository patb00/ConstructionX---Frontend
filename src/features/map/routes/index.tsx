import { Outlet, type RouteObject } from "react-router-dom";
import MapPage from "../components/MapPage";

function MapLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const mapRoutes: RouteObject = {
  path: "map",
  element: <MapLayout />,
  children: [{ index: true, element: <MapPage /> }],
};
