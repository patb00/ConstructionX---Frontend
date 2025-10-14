import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/router";
import { queryClient } from "./providers/QueryProvider";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import { useEffect } from "react";

export function App() {
  const loadFromCookies = useAuthStore((s) => s.loadFromCookies);
  useEffect(() => {
    loadFromCookies();
  }, [loadFromCookies]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
