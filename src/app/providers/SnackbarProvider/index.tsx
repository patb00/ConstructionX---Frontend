import { SnackbarProvider as NotistackProvider } from "notistack";
import type { PropsWithChildren } from "react";

export function SnackbarProvider({ children }: PropsWithChildren) {
  return (
    <NotistackProvider
      dense
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={4000}
    >
      {children}
    </NotistackProvider>
  );
}
