import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/router";
import { queryClient } from "./providers/QueryProvider";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import { useEffect } from "react";
import "./providers/LocalizationProvider/i18n";

export function App() {
  const loadFromCookies = useAuthStore((s) => s.loadFromCookies);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    loadFromCookies();
  }, [loadFromCookies]);

  if (!hasHydrated) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
