import { Paper } from "@mui/material";
import type { ReactNode } from "react";

export function HistoryCard({ children }: { children: ReactNode }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.25,
        borderColor: "divider",
        boxShadow:
          "0 1px 2px rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.02)",
      }}
    >
      {children}
    </Paper>
  );
}
