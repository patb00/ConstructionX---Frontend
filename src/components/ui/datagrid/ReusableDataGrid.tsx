import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DataGridPro,
  type GridColDef,
  type GridRowsProp,
  type GridRowIdGetter,
  type GridValidRowModel,
  useGridApiRef,
  type GridRowParams,
  type GridPaginationModel,
  type GridFilterModel,
  type GridColumnVisibilityModel,
} from "@mui/x-data-grid-pro";
import { useTranslation } from "react-i18next";
import { DataGridToolbar } from "./DatagridToolbar";
import useColumnHeaderMappings from "./useColumnHeaderMappings";
import { getGridLocaleText } from "./gridLocaleText";
import { useEffect, useMemo, useState } from "react";

type PinnedColumnsState = {
  left?: string[];
  right?: string[];
};

export type DetailPanelMode = "all" | "mobile-only" | "desktop-only";

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
  renderListViewCell?: never;
  listViewColumns?: never;

  paginationMode?: "client" | "server";
  rowCount?: number;
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;

  columnVisibilityModel?: GridColumnVisibilityModel;

  getDetailPanelContent?: (params: GridRowParams<T>) => React.ReactNode;
  getDetailPanelHeight?: (params: GridRowParams<T>) => number;
  detailPanelMode?: DetailPanelMode;

  filterMode?: "client" | "server";
  filterModel?: GridFilterModel;
  onFilterModelChange?: (model: GridFilterModel) => void;
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
  getDetailPanelContent,
  getDetailPanelHeight,
  detailPanelMode = "all",
  paginationMode = "client",
  rowCount,
  paginationModel,
  onPaginationModelChange,
  columnVisibilityModel,
  filterMode,
  filterModel,
  onFilterModelChange,
}: ReusableDataGridProps<T>) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const apiRef = useGridApiRef();
  const { t, i18n } = useTranslation();
  const headerMappings = useColumnHeaderMappings();

  const [pinnedState, setPinnedState] = useState<
    PinnedColumnsState | undefined
  >(undefined);

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    api.setDensity(isSmall ? "compact" : "standard");
  }, [isSmall, apiRef]);

  const baseForScreen = useMemo<GridColDef<T>[]>(() => {
    if (!isSmall) return columns;

    const actionsCol = columns.find((c) => c.field === "actions");
    const firstDataCol = columns.find((c) => c.field !== "actions");

    const mobileCols: GridColDef<T>[] = [];
    if (firstDataCol) mobileCols.push(firstDataCol);
    if (actionsCol) mobileCols.push(actionsCol);

    const chosen = mobileCols.length > 0 ? mobileCols : columns;

    return chosen.map((c) => ({
      ...c,
      sortable: false,
      minWidth: c.minWidth ?? 120,
      flex: c.flex ?? 1,
    }));
  }, [columns, isSmall]);

  const columnsForScreen = useMemo<GridColDef<T>[]>(() => {
    return applyHeaderMappings(baseForScreen, headerMappings);
  }, [baseForScreen, headerMappings, i18n.language]);

  const localeText = useMemo(() => getGridLocaleText(t), [t, i18n.language]);

  const pinnedColumns = !isSmall ? pinnedState : undefined;

  useEffect(() => {
    if (!pinnedRightField) return;

    setPinnedState((prev) => {
      const right = new Set(prev?.right ?? []);
      if (!right.has(pinnedRightField)) right.add(pinnedRightField);
      return { ...prev, right: Array.from(right) };
    });
  }, [pinnedRightField]);

  const shouldUseDetailPanel =
    !!getDetailPanelContent &&
    !!getDetailPanelHeight &&
    (() => {
      switch (detailPanelMode) {
        case "mobile-only":
          return isSmall;
        case "desktop-only":
          return !isSmall;
        case "all":
        default:
          return true;
      }
    })();

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
      paginationMode={paginationMode}
      rowCount={paginationMode === "server" ? rowCount : undefined}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      initialState={
        paginationModel
          ? undefined
          : {
              pagination: { paginationModel: { page: 0, pageSize } },
            }
      }
      pageSizeOptions={[5, 10, 25, 50, 100]}
      slots={{ toolbar: DataGridToolbar }}
      pagination
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
      rowHeight={isSmall ? 56 : 52}
      pinnedColumns={pinnedColumns}
      onPinnedColumnsChange={(newPinned) =>
        setPinnedState(newPinned as PinnedColumnsState)
      }
      getDetailPanelContent={
        shouldUseDetailPanel ? getDetailPanelContent : undefined
      }
      getDetailPanelHeight={
        shouldUseDetailPanel ? getDetailPanelHeight : undefined
      }
      filterMode={filterMode}
      filterModel={filterModel}
      onFilterModelChange={onFilterModelChange}
      columnVisibilityModel={columnVisibilityModel}
      sx={{
        border: "none",
        backgroundColor: "#fff",

        "& .MuiDataGrid-main": {
          border: "1px solid #E5E7EB",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          backgroundColor: "#fff",
        },

        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#F4F6FF",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
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
