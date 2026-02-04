import { Box, Card, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";

type BoardItemCardProps = {
  actions?: ReactNode;
  children: ReactNode;

  dateRangeText?: ReactNode;
  sx?: SxProps<Theme>;
};

export function BoardItemCard({
  actions,
  children,
  dateRangeText,
  sx,
}: BoardItemCardProps) {
  return (
    <Card sx={{ p: 1.5, position: "relative", ...((sx as object) ?? {}) }}>
      {actions}

      {children}

      {dateRangeText ? <Box sx={{ mt: 0.25 }}>{dateRangeText}</Box> : null}
    </Card>
  );
}
