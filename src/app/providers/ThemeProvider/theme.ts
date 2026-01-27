import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#F1B103" },
    secondary: { main: "#04befe" },
    success: { main: "#21D191" },
    warning: { main: "#F1B103" },
    error: { main: "#FF6666" },
    background: { default: "#ffffff", paper: "#ffffff" },
  },

  spacing: 8,

  typography: {
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
    h4: { fontWeight: 700 },
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant !== "contained" && {
            color: theme.palette.primary.main,
          }),

          ...(ownerState.variant === "contained" && {
            color: theme.palette.common.white,
          }),
        }),
      },
    },

    MuiChip: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.color === "success" &&
            ownerState.variant === "filled" && {
              color: "#ffffff",
            }),

          ...(ownerState.color === "warning" &&
            ownerState.variant === "filled" && {
              color: "#ffffff",
            }),
        }),
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          textTransform: "none",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          textTransform: "none",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #E5E7EB !important",
        },
      },
    },
  },
});
