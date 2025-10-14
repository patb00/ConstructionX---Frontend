// app/router/RequireAuth.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { getCookie } from "../../lib/cookie";
import { isExpired } from "../../lib/jwt";
import { refreshTokens } from "../../lib/authFetch";

const ACCESS_COOKIE = "auth_jwt";
const REFRESH_COOKIE = "auth_rtok";

export function RequireAuth({
  children,
  fallbackPath = "/",
}: {
  children: React.ReactNode;
  fallbackPath?: string;
}) {
  const location = useLocation();
  const { jwt, setTokens, isAuthenticated, hasHydrated } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function go() {
      if (!hasHydrated) return; // wait for cookie load

      // Already authenticated with a valid token
      if (jwt && !isExpired(jwt)) {
        setChecking(false);
        return;
      }

      // Try cookie JWT
      const cookieJwt = getCookie(ACCESS_COOKIE);
      if (cookieJwt && !isExpired(cookieJwt)) {
        setTokens(
          cookieJwt,
          getCookie(REFRESH_COOKIE) || "",
          getCookie("auth_rtok_exp") || ""
        );
        setChecking(false);
        return;
      }

      // Silent refresh if we have a refresh token
      const cookieRt = getCookie(REFRESH_COOKIE);
      if (cookieRt) {
        const newJwt = await refreshTokens(cookieJwt ?? "", cookieRt);
        if (!cancelled && newJwt) {
          setTokens(
            newJwt,
            getCookie(REFRESH_COOKIE) || "",
            getCookie("auth_rtok_exp") || ""
          );
        }
      }

      if (!cancelled) setChecking(false);
    }

    go();
    return () => {
      cancelled = true;
    };
  }, [jwt, hasHydrated, setTokens]);

  if (!hasHydrated || checking) {
    return <div style={{ padding: 24 }}>Checking session…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
