import { useEffect } from "react";
import { useMyPermissions } from "../../administration/users/hooks/useMyPermissions";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthBootstrap() {
  const { isAuthenticated, hasHydrated, setPermissions, clear } =
    useAuthStore();
  const { data, error, isFetching } = useMyPermissions();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      setPermissions([]);
      return;
    }

    if (Array.isArray(data)) {
      setPermissions(data);
    }
  }, [hasHydrated, isAuthenticated, data, setPermissions]);

  useEffect(() => {
    if (error && isAuthenticated) {
      console.error("[AUTH] Permission bootstrap failed:", error);
      clear();
    }
  }, [error, isAuthenticated, clear]);

  return {
    permissionsLoading: isFetching,
  };
}
