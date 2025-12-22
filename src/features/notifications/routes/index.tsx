import { Outlet, type RouteObject } from "react-router-dom";
import NotificationsListPage from "../components/NotificatonsListPage";

function NotificationsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const notificationsRoutes: RouteObject = {
  path: "notifications",
  element: <NotificationsLayout />,
  children: [{ index: true, element: <NotificationsListPage /> }],
};
