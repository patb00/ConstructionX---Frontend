import { Outlet, type RouteObject } from "react-router-dom";
import EmployeesListPage from "../components/EmployeeListPage";
import EmployeeCreatePage from "../components/EmployeeCreatePage";
import EmployeeEditPage from "../components/EmployeeEditPage";

function EmployeesLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const employeesRoutes: RouteObject = {
  path: "administration/employees",
  element: <EmployeesLayout />,
  children: [
    { index: true, element: <EmployeesListPage /> },
    { path: "create", element: <EmployeeCreatePage /> },
    { path: ":id/edit", element: <EmployeeEditPage /> },
  ],
};
