import * as React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DataGrid,
  type GridColDef,
  type GridRowsProp,
  type GridRowIdGetter,
  type GridValidRowModel,
} from "@mui/x-data-grid";
import { DataGridToolbar } from "./DatagridToolbar";

export type ReusableDataGridProps<
  T extends GridValidRowModel = GridValidRowModel
> = {
  rows: T[] | GridRowsProp<T>;
  columns: GridColDef<T>[];
  getRowId?: GridRowIdGetter<T>;
  pageSize?: number;
  exportFileName?: string;
  toolbarColor?: string;
  stickyRightField?: string;
};

export default function ReusableDataGrid<
  T extends GridValidRowModel = GridValidRowModel
>({
  rows,
  columns,
  getRowId,
  pageSize = 50,
  exportFileName = "export",
  toolbarColor = "#646464",
  stickyRightField,
}: ReusableDataGridProps<T>) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const columnsForScreen = React.useMemo<GridColDef<T>[]>(() => {
    if (!isSmall) return columns;
    return columns.map((c) => ({
      ...c,
      sortable: false,
      minWidth: c.minWidth ?? 120,
      flex: c.flex ?? 1,
    }));
  }, [columns, isSmall]);

  return (
    <Box sx={{ flex: 1, position: "relative", height: "100%", width: "100%" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columnsForScreen}
          getRowId={getRowId}
          disableRowSelectionOnClick
          autoHeight={isSmall}
          density={isSmall ? "compact" : "standard"}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize } },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          slots={{ toolbar: DataGridToolbar }}
          slotProps={{
            toolbar: {
              color: toolbarColor,
              csvOptions: {
                fileName: exportFileName,
                delimiter: ",",
                utf8WithBom: true,
              },
              printOptions: { hideFooter: false, hideToolbar: false },
            },
          }}
          sortingOrder={["asc", "desc"]}
          disableColumnMenu={isSmall}
          checkboxSelection={false}
          disableVirtualization={Boolean(stickyRightField)}
          sx={
            stickyRightField
              ? {
                  [`& .MuiDataGrid-cell[data-field="${stickyRightField}"]`]: {
                    position: "sticky",
                    right: 0,
                    zIndex: 1112,
                    backgroundColor: (t) => t.palette.background.paper,
                    borderLeft: (t) => `1px solid ${t.palette.divider}`,
                    boxShadow: (t) =>
                      t.palette.mode === "dark"
                        ? "-2px 0 4px rgba(0,0,0,.18)"
                        : "-2px 0 4px rgba(0,0,0,.05)",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: -4,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      pointerEvents: "none",
                      background: (t) =>
                        t.palette.mode === "dark"
                          ? "linear-gradient(to left, rgba(0,0,0,.10), rgba(0,0,0,0))"
                          : "linear-gradient(to left, rgba(0,0,0,.03), rgba(0,0,0,0))",
                    },
                  },

                  [`& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader[data-field="${stickyRightField}"]`]:
                    {
                      position: "sticky",
                      right: 0,
                      zIndex: 1113,
                      backgroundColor: (t) => t.palette.background.paper,
                      borderLeft: (t) => `1px solid ${t.palette.divider}`,
                      boxShadow: (t) =>
                        t.palette.mode === "dark"
                          ? "-2px 0 4px rgba(0,0,0,.20)"
                          : "-2px 0 4px rgba(0,0,0,.06)",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: -4,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        pointerEvents: "none",
                        background: (t) =>
                          t.palette.mode === "dark"
                            ? "linear-gradient(to left, rgba(0,0,0,.12), rgba(0,0,0,0))"
                            : "linear-gradient(to left, rgba(0,0,0,.04), rgba(0,0,0,0))",
                      },
                    },
                }
              : undefined
          }
        />
      </Box>
    </Box>
  );
}
