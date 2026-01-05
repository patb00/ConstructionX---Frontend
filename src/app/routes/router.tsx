import { createBrowserRouter } from "react-router-dom";
import LoginRoute from "../../features/auth/routes/LoginRoute";
import AppShell from "../layout/AppShell";
import DashboardRoute from "../../features/dashboard/routes/DashboardRoute";
import { companiesRoutes } from "../../features/administration/companies/routes";
import { tenantsRoutes } from "../../features/administration/tenants/routes";
import { rolesRoutes } from "../../features/administration/roles/routes";
import { usersRoles } from "../../features/administration/users/routes";
import { employeesRoutes } from "../../features/administration/employees/routes";
import { jobPostionRoutes } from "../../features/administration/job_positions/routes";
import { RequireAuth } from "./RequireAuth";
import ResetPasswordRoute from "../../features/auth/routes/ResetPasswordRoute";
import { constructionSitesRoutes } from "../../features/construction_site/routes";
import { toolsRoutes } from "../../features/tools/routes";
import { toolCategoriesRoutes } from "../../features/tools_category/routes";
import { vehiclesRoutes } from "../../features/vehicles/routes";
import { assignmentsRoutes } from "../../features/assignments/routes";
import { reportsRoutes } from "../../features/reports/routes";
import { medicalExaminationsRoutes } from "../../features/medical_examinations/routes";
import { examinationTypesRoutes } from "../../features/examination_types/routes";
import { certificationsRoutes } from "../../features/certifications/routes";
import { certificationTypesRoutes } from "../../features/certification_types/routes";
import { condosRoutes } from "../../features/condos/routes";
import { notificationsRoutes } from "../../features/notifications/routes";
import { vehicleRegistrationsRoutes } from "../../features/vehicle_registrations/routes";
import { vehicleInsurancesRoutes } from "../../features/vehicle_insurance/routes";
import { vehicleBusinessTripsRoutes } from "../../features/vehicle_business_trips/routes";

export const router = createBrowserRouter([
  { path: "/", element: <LoginRoute /> },
  { path: "/reset-password", element: <ResetPasswordRoute /> },
  {
    path: "/app",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { path: "dashboard", element: <DashboardRoute /> },

      tenantsRoutes,
      companiesRoutes,
      rolesRoutes,
      usersRoles,
      employeesRoutes,
      jobPostionRoutes,

      toolsRoutes,
      toolCategoriesRoutes,
      constructionSitesRoutes,
      vehiclesRoutes,
      vehicleRegistrationsRoutes,
      vehicleInsurancesRoutes,
      vehicleBusinessTripsRoutes,

      condosRoutes,
      assignmentsRoutes,

      reportsRoutes,
      medicalExaminationsRoutes,
      examinationTypesRoutes,
      certificationsRoutes,
      certificationTypesRoutes,

      notificationsRoutes,
    ],
  },
]);
