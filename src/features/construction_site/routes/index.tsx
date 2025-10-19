import { Outlet, type RouteObject } from "react-router-dom";
import ConstructionSitesListPage from "../components/ConstructionSiteListPage";
import ConstructionSiteCreatePage from "../components/ConstructionSiteCreatePage";
import ConstructionSiteEditPage from "../components/ConstructionSiteEditPage";
import ConstructionSiteDetailsPage from "../components/ConstructionSiteDetailsPage";

function ConstructionSitesLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const constructionSitesRoutes: RouteObject = {
  path: "constructionSites",
  element: <ConstructionSitesLayout />,
  children: [
    { index: true, element: <ConstructionSitesListPage /> },
    { path: "create", element: <ConstructionSiteCreatePage /> },
    { path: ":id/edit", element: <ConstructionSiteEditPage /> },
    { path: ":id/details", element: <ConstructionSiteDetailsPage /> },
  ],
};
