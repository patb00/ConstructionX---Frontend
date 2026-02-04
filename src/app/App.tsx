import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import { useEffect } from "react";
import "./providers/LocalizationProvider/i18n";
import { Box, CircularProgress } from "@mui/material";

export function App() {
  const loadFromCookies = useAuthStore((s) => s.loadFromCookies);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    loadFromCookies();
  }, [loadFromCookies]);

  if (!hasHydrated) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <RouterProvider router={router} />;
}
