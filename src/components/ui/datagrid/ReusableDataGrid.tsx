import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme, type SxProps, type Theme } from "@mui/material/styles";
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
  type GridPinnedColumnFields,
  type GridRowClassNameParams,
  type GridGroupingColDefOverride,
  type GridRowId,
} from "@mui/x-data-grid-pro";
import { useTranslation } from "react-i18next";

import { DataGridToolbar } from "./DatagridToolbar";
import useColumnHeaderMappings from "./useColumnHeaderMappings";
import { getGridLocaleText } from "./gridLocaleText";

import { useAuthStore } from "../../../features/auth/store/useAuthStore";

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

  paginationMode?: "client" | "server";
  rowCount?: number;
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;

  columnVisibilityModel?: GridColumnVisibilityModel;

  getDetailPanelContent?: (params: GridRowParams<T>) => React.ReactNode;
  getDetailPanelHeight?: (params: GridRowParams<T>) => number | "auto";
  detailPanelMode?: DetailPanelMode;

  filterMode?: "client" | "server";
  filterModel?: GridFilterModel;
  onFilterModelChange?: (model: GridFilterModel) => void;

  storageKey?: string;
  persistState?: boolean;

  getRowClassName?: (params: GridRowClassNameParams<T>) => string;
  sx?: SxProps<Theme>;

  mobilePrimaryField?: string;

  treeData?: boolean;
  getTreeDataPath?: (row: T) => string[];
  groupingColDef?: GridGroupingColDefOverride;
  defaultGroupingExpansionDepth?: number;
  isGroupExpandedByDefault?: (node: any) => boolean;

  detailPanelExpandedRowIds?: Set<GridRowId>;
  onDetailPanelExpandedRowIdsChange?: (ids: Set<GridRowId>) => void;
};

function applyHeaderMappings<T extends GridValidRowModel>(
  columns: GridColDef<T>[],
  mappings: Array<{ original: string; translated: string }>
): GridColDef<T>[] {
  if (!mappings.length) return columns;

  const map = new Map<string, string>();
  for (const { original, translated } of mappings)
    map.set(original, translated);

  return columns.map((c) => {
    const current = (c.headerName ?? c.field) as string;
    const translated = map.get(current);
    return translated ? { ...c, headerName: translated } : c;
  });
}

type PersistedGridState = {
  version: number;
  columnVisibilityModel?: GridColumnVisibilityModel;
  filterModel?: GridFilterModel;
  pinnedColumns?: GridPinnedColumnFields;
  columnWidths?: Record<string, number>;
  columnOrder?: string[];
};

const GRID_STATE_VERSION = 1;

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
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
  storageKey,
  persistState = true,
  getRowClassName,
  sx,
  mobilePrimaryField,
  treeData,
  getTreeDataPath,
  groupingColDef,
  defaultGroupingExpansionDepth,
  isGroupExpandedByDefault,
  detailPanelExpandedRowIds,
  onDetailPanelExpandedRowIdsChange,
}: ReusableDataGridProps<T>) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const apiRef = useGridApiRef();
  const { t, i18n } = useTranslation();
  const headerMappings = useColumnHeaderMappings();

  const userId = useAuthStore((s) => s.userId);
  const effectiveStorageKey =
    persistState && userId && storageKey ? `dg:${userId}:${storageKey}` : null;

  const [pinnedState, setPinnedState] = useState<GridPinnedColumnFields>();

  const [localVisibilityModel, setLocalVisibilityModel] = useState<
    GridColumnVisibilityModel | undefined
  >(columnVisibilityModel);

  const [localFilterModel, setLocalFilterModel] = useState<
    GridFilterModel | undefined
  >(filterModel);

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    api.setDensity(isSmall ? "compact" : "standard");
  }, [isSmall, apiRef]);

  useEffect(() => {
    if (!effectiveStorageKey) return;

    const persisted = safeJsonParse<PersistedGridState>(
      localStorage.getItem(effectiveStorageKey)
    );

    if (!persisted || persisted.version !== GRID_STATE_VERSION) return;

    if (persisted.columnVisibilityModel)
      setLocalVisibilityModel(persisted.columnVisibilityModel);
    if (persisted.filterModel) setLocalFilterModel(persisted.filterModel);
    if (persisted.pinnedColumns) setPinnedState(persisted.pinnedColumns);
    if (persisted.columnWidths) setColumnWidths(persisted.columnWidths);
    if (persisted.columnOrder?.length) setColumnOrder(persisted.columnOrder);
  }, [effectiveStorageKey]);

  useEffect(() => {
    if (!effectiveStorageKey) return;

    const handle = window.setTimeout(() => {
      const next: PersistedGridState = {
        version: GRID_STATE_VERSION,
        columnVisibilityModel: localVisibilityModel,
        filterModel: localFilterModel,
        pinnedColumns: pinnedState,
        columnWidths,
        columnOrder,
      };
      localStorage.setItem(effectiveStorageKey, JSON.stringify(next));
    }, 300);

    return () => window.clearTimeout(handle);
  }, [
    effectiveStorageKey,
    localVisibilityModel,
    localFilterModel,
    pinnedState,
    columnWidths,
    columnOrder,
  ]);

  useEffect(() => {
    if (columnVisibilityModel) setLocalVisibilityModel(columnVisibilityModel);
  }, [columnVisibilityModel]);

  useEffect(() => {
    if (filterModel) setLocalFilterModel(filterModel);
  }, [filterModel]);

  const baseForScreen = useMemo<GridColDef<T>[]>(() => {
    if (!isSmall) return columns;

    const actionsCol = columns.find((c) => c.field === "actions");
    const firstDataCol =
      (mobilePrimaryField
        ? columns.find((c) => c.field === mobilePrimaryField)
        : undefined) ?? columns.find((c) => c.field !== "actions");

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
    let cols = applyHeaderMappings(baseForScreen, headerMappings);

    if (!isSmall && columnOrder.length) {
      const byField = new Map(cols.map((c) => [c.field, c] as const));

      const ordered: GridColDef<T>[] = [];
      for (const f of columnOrder) {
        const col = byField.get(f);
        if (col) ordered.push(col);
        byField.delete(f);
      }

      ordered.push(...Array.from(byField.values()));
      cols = ordered;
    }

    if (!isSmall && Object.keys(columnWidths).length) {
      cols = cols.map((c) => {
        const w = columnWidths[c.field];
        if (!w) return c;
        return { ...c, width: w, flex: undefined };
      });
    }

    return cols;
  }, [
    baseForScreen,
    headerMappings,
    i18n.language,
    isSmall,
    columnOrder,
    columnWidths,
  ]);

  const localeText = useMemo(() => getGridLocaleText(t), [t, i18n.language]);

  const pinnedColumns = !isSmall ? pinnedState : undefined;

  const effectiveFilterModel = filterModel ?? localFilterModel;

  useEffect(() => {
    if (!pinnedRightField || isSmall) return;

    setPinnedState((prev) => {
      const right = new Set(prev?.right ?? []);
      right.add(pinnedRightField);
      return { ...prev, right: Array.from(right) };
    });
  }, [pinnedRightField, isSmall]);

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

  const handleColumnWidthChange = useCallback(
    (params: any) => {
      if (isSmall) return;
      const field: string | undefined = params?.colDef?.field;
      const width: number | undefined = params?.width;
      if (!field || typeof width !== "number") return;

      setColumnWidths((prev) => ({ ...prev, [field]: width }));
    },
    [isSmall]
  );
  const handleColumnOrderChange = useCallback(() => {
    if (isSmall) return;

    const api: any = apiRef.current;
    if (!api?.getAllColumns) return;

    const fields = api.getAllColumns().map((c: any) => c.field);
    setColumnOrder(fields);
  }, [apiRef, isSmall]);

  return (
    <DataGridPro
      loading={loading}
      apiRef={apiRef}
      showToolbar
      rows={rows}
      columns={columnsForScreen}
      getRowId={getRowId}
      disableRowSelectionOnClick
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
        loadingOverlay: { variant: "skeleton", noRowsVariant: "skeleton" },
      }}
      sortingOrder={["asc", "desc"]}
      disableColumnMenu={isSmall}
      checkboxSelection={false}
      localeText={localeText}
      rowHeight={isSmall ? 56 : 52}
      pinnedColumns={pinnedColumns}
      onPinnedColumnsChange={(newPinned) =>
        setPinnedState(newPinned as GridPinnedColumnFields)
      }
      getDetailPanelContent={
        shouldUseDetailPanel ? getDetailPanelContent : undefined
      }
      getDetailPanelHeight={
        shouldUseDetailPanel ? getDetailPanelHeight : undefined
      }
      filterMode={filterMode ?? "client"}
      {...(effectiveFilterModel ? { filterModel: effectiveFilterModel } : {})}
      onFilterModelChange={(m) => {
        const normalized: GridFilterModel = {
          ...m,
          items: (m.items ?? []).map((it, idx) => ({
            id: it.id ?? idx,
            field: it.field,
            operator: it.operator,
            value: it.value,
          })),
        };

        setLocalFilterModel(normalized);
        onFilterModelChange?.(normalized);
      }}
      disableColumnFilter={false}
      columnVisibilityModel={columnVisibilityModel ?? localVisibilityModel}
      onColumnVisibilityModelChange={(m) => setLocalVisibilityModel(m)}
      onColumnWidthChange={handleColumnWidthChange}
      onColumnOrderChange={handleColumnOrderChange}
      getRowClassName={getRowClassName}
      treeData={treeData}
      getTreeDataPath={getTreeDataPath}
      groupingColDef={groupingColDef}
      defaultGroupingExpansionDepth={defaultGroupingExpansionDepth}
      isGroupExpandedByDefault={isGroupExpandedByDefault}
      detailPanelExpandedRowIds={detailPanelExpandedRowIds}
      onDetailPanelExpandedRowIdsChange={onDetailPanelExpandedRowIdsChange}
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

        "& .MuiDataGrid-filler": { backgroundColor: "#fff" },

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
        ...(sx ?? {}),
      }}
    />
  );
}
