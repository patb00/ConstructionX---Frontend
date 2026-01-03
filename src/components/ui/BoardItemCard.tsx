import { Card, Typography, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";

type BoardItemCardProps = {
  actions?: ReactNode;
  children: ReactNode;
  dateRangeText?: string | null;
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

      {!!dateRangeText && (
        <Typography
          variant="caption"
          color="primary.main"
          sx={{ display: "block", mt: 0.25 }}
        >
          {dateRangeText}
        </Typography>
      )}
    </Card>
  );
}
