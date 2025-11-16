import * as React from "react";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DataGridPro,
  type GridColDef,
  type GridRowsProp,
  type GridRowIdGetter,
  type GridValidRowModel,
  type GridRenderCellParams,
  type GridListViewColDef,
  useGridApiRef,
  type GridRowParams,
} from "@mui/x-data-grid-pro";
import { useTranslation } from "react-i18next";
import { DataGridToolbar } from "./DatagridToolbar";
import useColumnHeaderMappings from "./useColumnHeaderMappings";
import { getGridLocaleText } from "./gridLocaleText";

type PinnedColumnsState = {
  left?: string[];
  right?: string[];
};

function defaultListViewCell<T extends GridValidRowModel>(
  params: GridRenderCellParams<T>,
  columns: GridColDef<T>[],
  listViewColumns?: string[]
) {
  const { id, api, row } = params;

  const colMap = new Map<string, GridColDef<T>>();
  columns.forEach((col) => {
    if (col.field) colMap.set(col.field, col);
  });

  const orderedFields =
    listViewColumns && listViewColumns.length
      ? listViewColumns
      : (columns.map((c) => c.field).filter(Boolean) as string[]);

  const idField =
    orderedFields.find((f) => f === "id") ??
    orderedFields.find((f) => f.toLowerCase().includes("id"));

  const actionsField = orderedFields.find((f) => f === "actions");

  const primaryField = orderedFields.find(
    (f) => f !== idField && f !== actionsField
  );

  const idCol = idField ? colMap.get(idField) : undefined;
  const primaryCol = primaryField ? colMap.get(primaryField) : undefined;
  const actionsCol = actionsField ? colMap.get(actionsField) : undefined;

  const getValue = (field?: string) => {
    if (!field) return undefined;
    if (typeof (api as any).getCellValue === "function") {
      return (api as any).getCellValue(id, field);
    }
    return (row as any)[field];
  };

  const idValue = getValue(idField);
  const primaryValue = getValue(primaryField);

  let actions: React.ReactElement[] = [];
  if (
    actionsCol &&
    (actionsCol.type === "actions" || actionsCol.field === "actions")
  ) {
    const getActions = (actionsCol as any).getActions as
      | ((p: any) => React.ReactElement[])
      | undefined;

    actions =
      getActions?.({
        id,
        row,
        field: actionsCol.field,
        api,
      }) ?? [];
  }

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        height: "100%",
        px: 1,
        gap: 1,
        overflow: "hidden",
      }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {idCol && idValue !== undefined && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: 0.25,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {(idCol.headerName ?? idCol.field) + ": "} {String(idValue)}
          </Typography>
        )}

        {primaryCol && (
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {(primaryCol.headerName ?? primaryCol.field) + ": "}{" "}
            {primaryValue !== undefined ? String(primaryValue) : ""}
          </Typography>
        )}
      </Box>

      {actions.length > 0 && (
        <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
          {actions.map((action, idx) => (
            <Box key={idx}>{action}</Box>
          ))}
        </Box>
      )}
    </Stack>
  );
}

export type ReusableDataGridProps<
  T extends GridValidRowModel = GridValidRowModel
> = {
  rows: T[] | GridRowsProp<T>;
  columns: GridColDef<T>[];
  getRowId?: GridRowIdGetter<T>;
  pageSize?: number;
  exportFileName?: string;
  toolbarColor?: string;
  pinnedRightField?: string;
  loading?: boolean;
  renderListViewCell?: (params: GridRenderCellParams<T>) => React.ReactNode;
  listViewColumns?: string[];
  getDetailPanelContent?: (params: GridRowParams<T>) => React.ReactNode;
  getDetailPanelHeight?: (params: GridRowParams<T>) => number;
};

function applyHeaderMappings<T extends GridValidRowModel>(
  columns: GridColDef<T>[],
  mappings: Array<{ original: string; translated: string }>
): GridColDef<T>[] {
  if (!mappings.length) return columns;

  const map = new Map<string, string>();
  for (const { original, translated } of mappings) {
    map.set(original, translated);
  }

  return columns.map((c) => {
    const current = (c.headerName ?? c.field) as string;
    const translated = map.get(current);
    if (translated) {
      return { ...c, headerName: translated };
    }
    return c;
  });
}

export default function ReusableDataGrid<
  T extends GridValidRowModel = GridValidRowModel
>({
  rows,
  columns,
  getRowId,
  pageSize = 50,
  exportFileName = "export",
  toolbarColor = "#646464",
  pinnedRightField,
  loading,
  renderListViewCell,
  listViewColumns,
  getDetailPanelContent,
  getDetailPanelHeight,
}: ReusableDataGridProps<T>) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const apiRef = useGridApiRef();
  const { t, i18n } = useTranslation();
  const headerMappings = useColumnHeaderMappings();

  const [pinnedState, setPinnedState] = React.useState<
    PinnedColumnsState | undefined
  >(undefined);

  React.useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    api.setDensity(isSmall ? "compact" : "standard");
  }, [isSmall, apiRef]);

  const baseForScreen = React.useMemo<GridColDef<T>[]>(() => {
    if (!isSmall) return columns;
    return columns.map((c) => ({
      ...c,
      sortable: false,
      minWidth: c.minWidth ?? 120,
      flex: c.flex ?? 1,
    }));
  }, [columns, isSmall]);

  const columnsForScreen = React.useMemo<GridColDef<T>[]>(() => {
    return applyHeaderMappings(baseForScreen, headerMappings);
  }, [baseForScreen, headerMappings, i18n.language]);

  const localeText = React.useMemo(
    () => getGridLocaleText(t),
    [t, i18n.language]
  );

  const isListView = isSmall;

  const listViewColumn: GridListViewColDef<T> = React.useMemo(
    () => ({
      field: "__list__",
      renderCell: (params) =>
        renderListViewCell
          ? renderListViewCell(params)
          : defaultListViewCell(params, columnsForScreen, listViewColumns),
    }),
    [renderListViewCell, columnsForScreen, listViewColumns]
  );

  const rowHeight = isListView ? 64 : 52;

  const pinnedColumns = !isListView ? pinnedState : undefined;

  React.useEffect(() => {
    if (!pinnedRightField) return;

    setPinnedState((prev) => {
      const right = new Set(prev?.right ?? []);
      if (!right.has(pinnedRightField)) right.add(pinnedRightField);
      return { ...prev, right: Array.from(right) };
    });
  }, [pinnedRightField]);

  return (
    <DataGridPro
      loading={loading}
      apiRef={apiRef}
      showToolbar
      rows={rows}
      columns={columnsForScreen}
      getRowId={getRowId}
      disableRowSelectionOnClick
      autoHeight={isSmall}
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
        loadingOverlay: {
          variant: "skeleton",
          noRowsVariant: "skeleton",
        },
      }}
      sortingOrder={["asc", "desc"]}
      disableColumnMenu={isSmall}
      checkboxSelection={false}
      localeText={localeText}
      listView={isListView}
      listViewColumn={listViewColumn}
      rowHeight={rowHeight}
      pinnedColumns={pinnedColumns}
      onPinnedColumnsChange={(newPinned) =>
        setPinnedState(newPinned as PinnedColumnsState)
      }
      getDetailPanelContent={getDetailPanelContent}
      getDetailPanelHeight={getDetailPanelHeight}
      sx={{
        border: "none",
        backgroundColor: "#fff",

        "& .MuiDataGrid-main": {
          border: "1px solid #E5E7EB",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,

          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,

          overflow: "hidden",
          backgroundColor: "#fff",
        },

        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#F4F6FF",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          overflow: "visible",
        },

        "& .MuiDataGrid-columnHeadersInner": {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },

        "& .MuiDataGrid-filler": {
          backgroundColor: "#fff",
        },

        "& .MuiDataGrid-columnHeaders .MuiDataGrid-filler": {
          backgroundColor: "#F4F6FF",
          borderTopRightRadius: 8,
        },

        "& .MuiDataGrid-scrollbarFiller, & .MuiDataGrid-scrollbarFiller--pinnedRight":
          {
            backgroundColor: "#F4F6FF !important",
            borderTopRightRadius: 8,
            zIndex: 0,
          },

        "& .MuiDataGrid-columnHeader": {
          color: "#6F7295",
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          backgroundColor: "transparent",
        },

        "& .MuiDataGrid-columnHeader--pinnedRight": {
          backgroundColor: "#F4F6FF",
          zIndex: 3,
          borderTopRightRadius: "16px",
        },

        "& .MuiDataGrid-cell--pinnedRight": {
          backgroundColor: "#fff",
          zIndex: 2,
        },

        "& .MuiDataGrid-pinnedColumnHeaders--right, & .MuiDataGrid-pinnedColumns--right":
          {
            boxShadow: "-8px 0 8px -4px rgba(15, 23, 42, 0.08)",
          },

        "& .MuiDataGrid-iconSeparator": {
          display: "none",
        },

        "& .MuiDataGrid-cell": {
          fontSize: 13,
          color: "#1D1F2C",
          borderBottom: "none",
          backgroundColor: "#fff",
        },
      }}
    />
  );
}
