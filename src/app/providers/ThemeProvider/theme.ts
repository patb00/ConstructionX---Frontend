import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#ff9800" },
    secondary: { main: "#04befe" },
    background: { default: "#ffffff", paper: "#ffffff" },
  },
  //shape: { borderRadius: 40 },
  spacing: 8,
  typography: {
    fontFamily:
      '"Poppins", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    h4: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
  },
});
