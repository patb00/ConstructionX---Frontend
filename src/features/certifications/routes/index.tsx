import { Outlet, type RouteObject } from "react-router-dom";
import CertificationsListPage from "../components/CertificationsListPage";
import CertificationCreatePage from "../components/CertificationCreatePage";
import CertificationEditPage from "../components/CertificationEditPage";

function CertificationsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const certificationsRoutes: RouteObject = {
  path: "certifications",
  element: <CertificationsLayout />,
  children: [
    { index: true, element: <CertificationsListPage /> },
    { path: "create", element: <CertificationCreatePage /> },
    { path: ":id/edit", element: <CertificationEditPage /> },
  ],
};
