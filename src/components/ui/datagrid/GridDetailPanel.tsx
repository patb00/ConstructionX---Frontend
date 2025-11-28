import * as React from "react";
import { Box, Stack, Typography } from "@mui/material";
import type { GridColDef, GridValidRowModel } from "@mui/x-data-grid-pro";

type GridDetailPanelProps<T extends GridValidRowModel> = {
  row: T;
  columns: GridColDef<T>[];
  columnFilter?: (col: GridColDef<T>) => boolean;
};

export function GridDetailPanel<T extends GridValidRowModel>({
  row,
  columns,
  columnFilter,
}: GridDetailPanelProps<T>) {
  const detailColumns = React.useMemo(
    () =>
      columns.filter((c) => {
        if (!c.field) return false;
        if (c.field === "actions" || c.field === "__list__") return false;
        if ((c as any).hide) return false;

        if (columnFilter && !columnFilter(c)) return false;
        return true;
      }),
    [columns, columnFilter]
  );

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#F9FAFB",
        fontSize: "12px",
      }}
    >
      <Stack spacing={1.0}>
        {detailColumns.map((col) => {
          const field = col.field as string;
          const rawValue = (row as any)[field];

          if (
            rawValue === undefined ||
            rawValue === null ||
            rawValue === "" ||
            rawValue === false
          ) {
            return null;
          }

          const label = col.headerName ?? col.field;

          return (
            <Box key={col.field}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mb: 0.25,
                  fontSize: "11px",
                }}
              >
                {label}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                {String(rawValue)}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
