import { Box, Stack, Typography } from "@mui/material";
import type { GridColDef, GridValidRowModel } from "@mui/x-data-grid-pro";
import { useMemo } from "react";
import useColumnHeaderMappings from "./useColumnHeaderMappings";

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
  const detailColumns = useMemo(
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

  const mappings = useColumnHeaderMappings();

  const translatedColumns = useMemo(() => {
    if (!mappings.length) return detailColumns;

    const map = new Map<string, string>();
    for (const { original, translated } of mappings) {
      map.set(original, translated);
    }

    return detailColumns.map((c) => {
      const current = (c.headerName ?? c.field) as string;
      const translated = map.get(current);
      return translated ? { ...c, headerName: translated } : c;
    });
  }, [detailColumns, mappings]);

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#F9FAFB",
        fontSize: "12px",
      }}
    >
      <Stack spacing={1.0}>
        {translatedColumns.map((col) => {
          const field = col.field as string;
          let rawValue = (row as any)[field];

          if (col.valueGetter) {
            try {
              rawValue = (col.valueGetter as any)(rawValue, row, col as any, {} as any);
            } catch (e) {
              console.warn("Error calling valueGetter for field", field, e);
            }
          }

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
                {(() => {
                  if (Array.isArray(rawValue)) {
                    if (rawValue.length === 0) return "-";
                    if (typeof rawValue[0] === "object" && rawValue[0] !== null) {
                      return rawValue
                        .map((item: any) => item.name || item.title || item.label || "-")
                        .join(", ");
                    }
                    return rawValue.join(", ");
                  } else if (typeof rawValue === "object" && rawValue !== null) {
           
                     if ("name" in rawValue) return (rawValue as any).name;
                     if ("title" in rawValue) return (rawValue as any).title;
                     if ("label" in rawValue) return (rawValue as any).label;
                     return JSON.stringify(rawValue); 
                  }
                  return String(rawValue);
                })()}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
