import { Outlet, type RouteObject } from "react-router-dom";
import ExaminationTypesListPage from "../components/ExaminationTypesListPage";
import ExaminationTypeCreatePage from "../components/ExaminationTypeCreatePage";
import ExaminationTypeEditPage from "../components/ExaminationTypeEditPage";

function ExaminationTypesLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const examinationTypesRoutes: RouteObject = {
  path: "examinationTypes",
  element: <ExaminationTypesLayout />,
  children: [
    { index: true, element: <ExaminationTypesListPage /> },
    { path: "create", element: <ExaminationTypeCreatePage /> },
    { path: ":id/edit", element: <ExaminationTypeEditPage /> },
  ],
};
