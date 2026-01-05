import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { AppThemeProvider } from "./app/providers/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/providers/QueryProvider";
import { SnackbarProvider } from "./app/providers/SnackbarProvider";
import { LicenseInfo } from "@mui/x-license";
import { MuiDateProvider } from "./app/providers/MuiDateProvider";
import { registerSW } from "virtual:pwa-register";

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_X_LICENSE_KEY as string);

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MuiDateProvider>
    <AppThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </QueryClientProvider>
    </AppThemeProvider>
  </MuiDateProvider>
);
