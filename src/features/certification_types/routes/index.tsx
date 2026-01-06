import { Outlet, type RouteObject } from "react-router-dom";
import CertificationTypesListPage from "../components/CertificationTypesListPage";
import CertificationTypeCreatePage from "../components/CertificationTypeCreatePage";
import CertificationTypeEditPage from "../components/CertificationTypeEditPage";

function CertificationTypesLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const certificationTypesRoutes: RouteObject = {
  path: "certificationTypes",
  element: <CertificationTypesLayout />,
  children: [
    { index: true, element: <CertificationTypesListPage /> },
    { path: "create", element: <CertificationTypeCreatePage /> },
    { path: ":id/edit", element: <CertificationTypeEditPage /> },
  ],
};
