import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

export function RequireAuth({
  children,
  fallbackPath = "/",
}: {
  children: ReactNode;
  fallbackPath?: string;
}) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
