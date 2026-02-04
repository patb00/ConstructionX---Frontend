import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  type GridCsvExportOptions,
  type GridPrintExportOptions,
} from "@mui/x-data-grid";
import { memo } from "react";

export type DataGridToolbarProps = {
  color?: string;
  quickFilterDebounceMs?: number;
  csvOptions?: GridCsvExportOptions;
  printOptions?: GridPrintExportOptions;
};

function DataGridToolbarBase({
  color = "#646464",
  quickFilterDebounceMs = 300,
  csvOptions,
  printOptions,
}: DataGridToolbarProps) {
  return (
    <GridToolbarContainer
      sx={{
        gap: 1,
        p: 1,
        borderBottom: "none !important",
        "& .MuiButtonBase-root": {
          color,
          "& svg": { color },
          "&:hover": { backgroundColor: "rgba(100,100,100,0.08)" },
        },
        "& .MuiInputBase-root": {
          color,
          "& .MuiSvgIcon-root": { color },
          "& input": { color },
        },
        background: "#FDFDFD",
      }}
    >
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={csvOptions} printOptions={printOptions} />
      <GridToolbarQuickFilter debounceMs={quickFilterDebounceMs} />
    </GridToolbarContainer>
  );
}

export const DataGridToolbar = memo(DataGridToolbarBase);
