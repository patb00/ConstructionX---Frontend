import { useAuthStore } from "../features/auth/store/useAuthStore";

export type Guard = { tenant?: "root" | "any"; permission?: string };

export function useCan() {
  const tenant = useAuthStore((s) => s.tenant);
  const permissions = useAuthStore((s) => s.permissions || []);
  return (guard?: Guard) => {
    if (!guard) return true;
    if (guard.tenant === "root" && tenant !== "root") return false;
    if (guard.permission && !permissions.includes(guard.permission))
      return false;
    return true;
  };
}

export function PermissionGate({
  guard,
  fallback = null,
  children,
}: React.PropsWithChildren<{ guard?: Guard; fallback?: React.ReactNode }>) {
  const can = useCan();
  return can(guard) ? <>{children}</> : <>{fallback}</>;
}
