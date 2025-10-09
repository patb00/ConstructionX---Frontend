import { Outlet, type RouteObject } from "react-router-dom";
import UsersListPage from "../components/UsersListPage";
import RegisterUserPage from "../components/RegisterUserPage";
import UserEditPage from "../components/UserEditPage";

function UsersLayout() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Outlet />
    </div>
  );
}

export const usersRoles: RouteObject = {
  path: "administration/users",
  element: <UsersLayout />,
  children: [
    { index: true, element: <UsersListPage /> },
    { path: "create", element: <RegisterUserPage /> },
    { path: ":id/edit", element: <UserEditPage /> },
  ],
};
