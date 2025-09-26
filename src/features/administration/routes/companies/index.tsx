import { Outlet, type RouteObject } from "react-router-dom";
import CompaniesListPage from "../../components/companies/CompaniesListPage";

function CompaniesLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const companiesRoutes: RouteObject = {
  path: "administration/companies",
  element: <CompaniesLayout />,
  children: [{ index: true, element: <CompaniesListPage /> }],
};
