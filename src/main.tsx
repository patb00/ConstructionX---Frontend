import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { AppThemeProvider } from "./app/providers/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/providers/QueryProvider";
import { SnackbarProvider } from "./app/providers/SnackbarProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </QueryClientProvider>
    </AppThemeProvider>
  </React.StrictMode>
);
