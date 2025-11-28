import { Outlet, type RouteObject } from "react-router-dom";
import MedicalExaminationsListPage from "../components/MedicalExaminationsListPage";
import MedicalExaminationCreatePage from "../components/MedicalExaminationCreatePage";
import MedicalExaminationEditPage from "../components/MedicalExaminationEditPage";

function MedicalExaminationsLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const medicalExaminationsRoutes: RouteObject = {
  path: "medicalExaminations",
  element: <MedicalExaminationsLayout />,
  children: [
    { index: true, element: <MedicalExaminationsListPage /> },
    { path: "create", element: <MedicalExaminationCreatePage /> },
    { path: ":id/edit", element: <MedicalExaminationEditPage /> },
    /* { path: ":id/details", element: <MedicalExaminationDetailsPage /> }, */
  ],
};
