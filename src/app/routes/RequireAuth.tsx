import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/model/auth.store";
import { getTokens } from "../../lib/auth";

type RequireAuthProps = {
  children?: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const location = useLocation();

  const hasTokens = !!getTokens();
  if (!isAuthed && !hasTokens) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
}
