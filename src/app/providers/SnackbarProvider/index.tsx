import {
  SnackbarProvider as NotistackProvider,
  MaterialDesignContent,
} from "notistack";
import { styled } from "@mui/material/styles";
import type { PropsWithChildren } from "react";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(
  ({ theme }) => ({
    color: "#fff",

    "&.notistack-MuiContent-success": {
      backgroundColor: theme.palette.success.main,
    },
    "&.notistack-MuiContent-error": {
      backgroundColor: theme.palette.error.main,
    },
    "&.notistack-MuiContent-warning": {
      backgroundColor: theme.palette.warning.main,
    },
    "&.notistack-MuiContent-info": {
      backgroundColor: theme.palette.info.main,
    },
  })
);

export function SnackbarProvider({ children }: PropsWithChildren) {
  return (
    <NotistackProvider
      dense
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={4000}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        warning: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent,
        default: StyledMaterialDesignContent,
      }}
    >
      {children}
    </NotistackProvider>
  );
}
