import type { Theme } from "@mui/material";

export function statusColor(value: number, theme: Theme): string {
  switch (value) {
    case 1:
      return theme.palette.secondary.main;
    case 2:
      return theme.palette.secondary.dark ?? theme.palette.secondary.main;
    case 3:
      return theme.palette.warning.main;
    case 4:
      return theme.palette.success.main;
    case 5:
      return theme.palette.error.main;
    default:
      return theme.palette.grey[400];
  }
}
