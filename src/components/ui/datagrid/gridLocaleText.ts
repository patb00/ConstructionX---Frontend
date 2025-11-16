import {
  GRID_DEFAULT_LOCALE_TEXT,
  type GridLocaleText,
} from "@mui/x-data-grid";
import type { TFunction } from "i18next";

/**
 * Builds a complete GridLocaleText object from i18next translations.
 * Falls back to MUI defaults when a key is missing.
 */
export function getGridLocaleText(t: TFunction): GridLocaleText {
  const overrides: Partial<GridLocaleText> = {
    // ===== Root / overlays =====
    noRowsLabel: t("common.datagrid.noRowsLabel", "No rows"),
    noResultsOverlayLabel: t(
      "common.datagrid.noResultsOverlayLabel",
      "No results found."
    ),
    noColumnsOverlayLabel: t(
      "common.datagrid.noColumnsOverlayLabel",
      "No columns"
    ),
    noColumnsOverlayManageColumns: t(
      "common.datagrid.noColumnsOverlayManageColumns",
      "Manage columns"
    ),
    emptyPivotOverlayLabel: t(
      "common.datagrid.emptyPivotOverlayLabel",
      "Add fields to rows, columns, and values to create a pivot table"
    ),

    // ===== Density selector (toolbar) =====
    toolbarDensity: t("common.datagrid.toolbarDensity", "Density"),
    toolbarDensityLabel: t("common.datagrid.toolbarDensityLabel", "Density"),
    toolbarDensityCompact: t(
      "common.datagrid.toolbarDensityCompact",
      "Compact"
    ),
    toolbarDensityStandard: t(
      "common.datagrid.toolbarDensityStandard",
      "Standard"
    ),
    toolbarDensityComfortable: t(
      "common.datagrid.toolbarDensityComfortable",
      "Comfortable"
    ),

    // ===== Columns button (toolbar) =====
    toolbarColumns: t("common.datagrid.toolbarColumns", "Columns"),
    toolbarColumnsLabel: t(
      "common.datagrid.toolbarColumnsLabel",
      "Select columns"
    ),

    // ===== Filters (toolbar) =====
    toolbarFilters: t("common.datagrid.toolbarFilters", "Filters"),
    toolbarFiltersLabel: t(
      "common.datagrid.toolbarFiltersLabel",
      "Show filters"
    ),
    toolbarFiltersTooltipHide: t(
      "common.datagrid.toolbarFiltersTooltipHide",
      "Hide filters"
    ),
    toolbarFiltersTooltipShow: t(
      "common.datagrid.toolbarFiltersTooltipShow",
      "Show filters"
    ),
    toolbarFiltersTooltipActive: (count) =>
      t("common.datagrid.toolbarFiltersTooltipActive", {
        count,
        defaultValue:
          count !== 1 ? "{{count}} active filters" : "{{count}} active filter",
      }),

    // ===== Quick filter (toolbar) =====
    toolbarQuickFilterPlaceholder: t(
      "common.datagrid.toolbarQuickFilterPlaceholder",
      "Search…"
    ),
    toolbarQuickFilterLabel: t(
      "common.datagrid.toolbarQuickFilterLabel",
      "Search"
    ),
    toolbarQuickFilterDeleteIconLabel: t(
      "common.datagrid.toolbarQuickFilterDeleteIconLabel",
      "Clear"
    ),

    // ===== Export (toolbar) =====
    toolbarExport: t("common.datagrid.toolbarExport", "Export"),
    toolbarExportLabel: t("common.datagrid.toolbarExportLabel", "Export"),
    toolbarExportCSV: t("common.datagrid.toolbarExportCSV", "Download as CSV"),
    toolbarExportPrint: t("common.datagrid.toolbarExportPrint", "Print"),
    toolbarExportExcel: t(
      "common.datagrid.toolbarExportExcel",
      "Download as Excel"
    ),

    // ===== Pivot / Charts / Assistant buttons (toolbar) =====
    toolbarPivot: t("common.datagrid.toolbarPivot", "Pivot"),
    //toolbarCharts: t("common.datagrid.toolbarCharts", "Charts"),
    toolbarAssistant: t("common.datagrid.toolbarAssistant", "AI Assistant"),

    // ===== Columns management dialog =====
    columnsManagementSearchTitle: t(
      "common.datagrid.columnsManagementSearchTitle",
      "Search"
    ),
    columnsManagementNoColumns: t(
      "common.datagrid.columnsManagementNoColumns",
      "No columns"
    ),
    columnsManagementShowHideAllText: t(
      "common.datagrid.columnsManagementShowHideAllText",
      "Show/Hide All"
    ),
    columnsManagementReset: t(
      "common.datagrid.columnsManagementReset",
      "Reset"
    ),
    columnsManagementDeleteIconLabel: t(
      "common.datagrid.columnsManagementDeleteIconLabel",
      "Clear"
    ),

    // ===== Filter panel =====
    filterPanelAddFilter: t(
      "common.datagrid.filterPanelAddFilter",
      "Add filter"
    ),
    filterPanelRemoveAll: t(
      "common.datagrid.filterPanelRemoveAll",
      "Remove all"
    ),
    filterPanelDeleteIconLabel: t(
      "common.datagrid.filterPanelDeleteIconLabel",
      "Delete"
    ),
    filterPanelLogicOperator: t(
      "common.datagrid.filterPanelLogicOperator",
      "Logic operator"
    ),
    filterPanelOperator: t("common.datagrid.filterPanelOperator", "Operator"),
    filterPanelOperatorAnd: t("common.datagrid.filterPanelOperatorAnd", "And"),
    filterPanelOperatorOr: t("common.datagrid.filterPanelOperatorOr", "Or"),
    filterPanelColumns: t("common.datagrid.filterPanelColumns", "Columns"),
    filterPanelInputLabel: t("common.datagrid.filterPanelInputLabel", "Value"),
    filterPanelInputPlaceholder: t(
      "common.datagrid.filterPanelInputPlaceholder",
      "Filter value"
    ),

    // ===== Filter operators =====
    filterOperatorContains: t(
      "common.datagrid.filterOperatorContains",
      "contains"
    ),
    filterOperatorDoesNotContain: t(
      "common.datagrid.filterOperatorDoesNotContain",
      "does not contain"
    ),
    filterOperatorEquals: t("common.datagrid.filterOperatorEquals", "equals"),
    filterOperatorDoesNotEqual: t(
      "common.datagrid.filterOperatorDoesNotEqual",
      "does not equal"
    ),
    filterOperatorStartsWith: t(
      "common.datagrid.filterOperatorStartsWith",
      "starts with"
    ),
    filterOperatorEndsWith: t(
      "common.datagrid.filterOperatorEndsWith",
      "ends with"
    ),
    filterOperatorIs: t("common.datagrid.filterOperatorIs", "is"),
    filterOperatorNot: t("common.datagrid.filterOperatorNot", "is not"),
    filterOperatorAfter: t("common.datagrid.filterOperatorAfter", "is after"),
    filterOperatorOnOrAfter: t(
      "common.datagrid.filterOperatorOnOrAfter",
      "is on or after"
    ),
    filterOperatorBefore: t(
      "common.datagrid.filterOperatorBefore",
      "is before"
    ),
    filterOperatorOnOrBefore: t(
      "common.datagrid.filterOperatorOnOrBefore",
      "is on or before"
    ),
    filterOperatorIsEmpty: t(
      "common.datagrid.filterOperatorIsEmpty",
      "is empty"
    ),
    filterOperatorIsNotEmpty: t(
      "common.datagrid.filterOperatorIsNotEmpty",
      "is not empty"
    ),
    filterOperatorIsAnyOf: t(
      "common.datagrid.filterOperatorIsAnyOf",
      "is any of"
    ),
    "filterOperator=": t("common.datagrid.filterOperatorEqualSymbol", "="),
    "filterOperator!=": t("common.datagrid.filterOperatorNotEqualSymbol", "!="),
    "filterOperator>": t(
      "common.datagrid.filterOperatorGreaterThanSymbol",
      ">"
    ),
    "filterOperator>=": t(
      "common.datagrid.filterOperatorGreaterOrEqualSymbol",
      ">="
    ),
    "filterOperator<": t("common.datagrid.filterOperatorLessThanSymbol", "<"),
    "filterOperator<=": t(
      "common.datagrid.filterOperatorLessOrEqualSymbol",
      "<="
    ),

    // ===== Header filter operators (menu labels) =====
    headerFilterOperatorContains: t(
      "common.datagrid.headerFilterOperatorContains",
      "Contains"
    ),
    headerFilterOperatorDoesNotContain: t(
      "common.datagrid.headerFilterOperatorDoesNotContain",
      "Does not contain"
    ),
    headerFilterOperatorEquals: t(
      "common.datagrid.headerFilterOperatorEquals",
      "Equals"
    ),
    headerFilterOperatorDoesNotEqual: t(
      "common.datagrid.headerFilterOperatorDoesNotEqual",
      "Does not equal"
    ),
    headerFilterOperatorStartsWith: t(
      "common.datagrid.headerFilterOperatorStartsWith",
      "Starts with"
    ),
    headerFilterOperatorEndsWith: t(
      "common.datagrid.headerFilterOperatorEndsWith",
      "Ends with"
    ),
    headerFilterOperatorIs: t("common.datagrid.headerFilterOperatorIs", "Is"),
    headerFilterOperatorNot: t(
      "common.datagrid.headerFilterOperatorNot",
      "Is not"
    ),
    headerFilterOperatorAfter: t(
      "common.datagrid.headerFilterOperatorAfter",
      "Is after"
    ),
    headerFilterOperatorOnOrAfter: t(
      "common.datagrid.headerFilterOperatorOnOrAfter",
      "Is on or after"
    ),
    headerFilterOperatorBefore: t(
      "common.datagrid.headerFilterOperatorBefore",
      "Is before"
    ),
    headerFilterOperatorOnOrBefore: t(
      "common.datagrid.headerFilterOperatorOnOrBefore",
      "Is on or before"
    ),
    headerFilterOperatorIsEmpty: t(
      "common.datagrid.headerFilterOperatorIsEmpty",
      "Is empty"
    ),
    headerFilterOperatorIsNotEmpty: t(
      "common.datagrid.headerFilterOperatorIsNotEmpty",
      "Is not empty"
    ),
    headerFilterOperatorIsAnyOf: t(
      "common.datagrid.headerFilterOperatorIsAnyOf",
      "Is any of"
    ),
    "headerFilterOperator=": t(
      "common.datagrid.headerFilterOperatorEqualSymbol",
      "Equals"
    ),
    "headerFilterOperator!=": t(
      "common.datagrid.headerFilterOperatorNotEqualSymbol",
      "Not equals"
    ),
    "headerFilterOperator>": t(
      "common.datagrid.headerFilterOperatorGreaterThanSymbol",
      "Greater than"
    ),
    "headerFilterOperator>=": t(
      "common.datagrid.headerFilterOperatorGreaterOrEqualSymbol",
      "Greater than or equal to"
    ),
    "headerFilterOperator<": t(
      "common.datagrid.headerFilterOperatorLessThanSymbol",
      "Less than"
    ),
    "headerFilterOperator<=": t(
      "common.datagrid.headerFilterOperatorLessOrEqualSymbol",
      "Less than or equal to"
    ),
    headerFilterClear: t("common.datagrid.headerFilterClear", "Clear filter"),

    // ===== Filter values =====
    filterValueAny: t("common.datagrid.filterValueAny", "any"),
    filterValueTrue: t("common.datagrid.filterValueTrue", "true"),
    filterValueFalse: t("common.datagrid.filterValueFalse", "false"),

    // ===== Column menu =====
    columnMenuLabel: t("common.datagrid.columnMenuLabel", "Menu"),
    columnMenuAriaLabel: (columnName: string) =>
      t("common.datagrid.columnMenuAriaLabel", {
        columnName,
        defaultValue: "{{columnName}} column menu",
      }),
    columnMenuShowColumns: t(
      "common.datagrid.columnMenuShowColumns",
      "Show columns"
    ),
    columnMenuManageColumns: t(
      "common.datagrid.columnMenuManageColumns",
      "Manage columns"
    ),
    columnMenuFilter: t("common.datagrid.columnMenuFilter", "Filter"),
    columnMenuHideColumn: t(
      "common.datagrid.columnMenuHideColumn",
      "Hide column"
    ),
    columnMenuUnsort: t("common.datagrid.columnMenuUnsort", "Unsort"),
    columnMenuSortAsc: t("common.datagrid.columnMenuSortAsc", "Sort by ASC"),
    columnMenuSortDesc: t("common.datagrid.columnMenuSortDesc", "Sort by DESC"),
    columnMenuManagePivot: t(
      "common.datagrid.columnMenuManagePivot",
      "Manage pivot"
    ),
    /*     columnMenuManageCharts: t(
      "common.datagrid.columnMenuManageCharts",
      "Manage charts"
    ), */

    // ===== Column header =====
    columnHeaderFiltersTooltipActive: (count) =>
      t("common.datagrid.columnHeaderFiltersTooltipActive", {
        count,
        defaultValue:
          count !== 1 ? "{{count}} active filters" : "{{count}} active filter",
      }),
    columnHeaderFiltersLabel: t(
      "common.datagrid.columnHeaderFiltersLabel",
      "Show filters"
    ),
    columnHeaderSortIconLabel: t(
      "common.datagrid.columnHeaderSortIconLabel",
      "Sort"
    ),

    // ===== Footer / selection / totals =====
    footerRowSelected: (count) =>
      t("common.datagrid.footerRowSelected", {
        count,
        defaultValue:
          count !== 1
            ? "{{count, number}} rows selected"
            : "{{count, number}} row selected",
      }),
    footerTotalRows: t("common.datagrid.footerTotalRows", "Total Rows:"),
    footerTotalVisibleRows: (visibleCount, totalCount) =>
      t("common.datagrid.footerTotalVisibleRows", {
        visibleCount,
        totalCount,
        defaultValue: "{{visibleCount, number}} of {{totalCount, number}}",
      }),

    // ===== Checkbox selection =====
    checkboxSelectionHeaderName: t(
      "common.datagrid.checkboxSelectionHeaderName",
      "Checkbox selection"
    ),
    checkboxSelectionSelectAllRows: t(
      "common.datagrid.checkboxSelectionSelectAllRows",
      "Select all rows"
    ),
    checkboxSelectionUnselectAllRows: t(
      "common.datagrid.checkboxSelectionUnselectAllRows",
      "Unselect all rows"
    ),
    checkboxSelectionSelectRow: t(
      "common.datagrid.checkboxSelectionSelectRow",
      "Select row"
    ),
    checkboxSelectionUnselectRow: t(
      "common.datagrid.checkboxSelectionUnselectRow",
      "Unselect row"
    ),

    // ===== Boolean cell =====
    booleanCellTrueLabel: t("common.datagrid.booleanCellTrueLabel", "yes"),
    booleanCellFalseLabel: t("common.datagrid.booleanCellFalseLabel", "no"),

    // ===== Actions cell =====
    actionsCellMore: t("common.datagrid.actionsCellMore", "more"),

    // ===== Column pinning =====
    pinToLeft: t("common.datagrid.pinToLeft", "Pin to left"),
    pinToRight: t("common.datagrid.pinToRight", "Pin to right"),
    unpin: t("common.datagrid.unpin", "Unpin"),

    // ===== Tree data =====
    treeDataGroupingHeaderName: t(
      "common.datagrid.treeDataGroupingHeaderName",
      "Group"
    ),
    treeDataExpand: t("common.datagrid.treeDataExpand", "see children"),
    treeDataCollapse: t("common.datagrid.treeDataCollapse", "hide children"),

    // ===== Grouping columns =====
    groupingColumnHeaderName: t(
      "common.datagrid.groupingColumnHeaderName",
      "Group"
    ),
    groupColumn: (name) =>
      t("common.datagrid.groupColumn", {
        name,
        defaultValue: "Group by {{name}}",
      }),
    unGroupColumn: (name) =>
      t("common.datagrid.unGroupColumn", {
        name,
        defaultValue: "Stop grouping by {{name}}",
      }),

    // ===== Master/detail =====
    detailPanelToggle: t(
      "common.datagrid.detailPanelToggle",
      "Detail panel toggle"
    ),
    expandDetailPanel: t("common.datagrid.expandDetailPanel", "Expand"),
    collapseDetailPanel: t("common.datagrid.collapseDetailPanel", "Collapse"),

    // ===== Pagination =====
    paginationRowsPerPage: t(
      "common.datagrid.paginationRowsPerPage",
      "Rows per page:"
    ),
    paginationDisplayedRows: ({ from, to, count, estimated }) => {
      if (!estimated) {
        // Always pass a string for interpolation to satisfy TS
        const countLabel =
          count !== -1
            ? String(count)
            : t("common.datagrid.moreThanX", "more than {{to}}", { to });

        return t(
          "common.datagrid.paginationDisplayedRows",
          "{{from}}–{{to}} of {{countLabel}}",
          { from, to, countLabel }
        );
      }

      const estimatedLabel =
        estimated && estimated > to
          ? t("common.datagrid.aroundX", "around {{estimated}}", { estimated })
          : t("common.datagrid.moreThanX", "more than {{to}}", { to });

      return t(
        "common.datagrid.paginationDisplayedRowsEstimated",
        "{{from}}–{{to}} of {{estimatedLabel}}",
        { from, to, estimatedLabel }
      );
    },
    paginationItemAriaLabel: (type) => {
      if (type === "first")
        return t("common.datagrid.paginationFirst", "Go to first page");
      if (type === "last")
        return t("common.datagrid.paginationLast", "Go to last page");
      if (type === "next")
        return t("common.datagrid.paginationNext", "Go to next page");
      return t("common.datagrid.paginationPrevious", "Go to previous page");
    },

    // ===== Row reordering =====
    rowReorderingHeaderName: t(
      "common.datagrid.rowReorderingHeaderName",
      "Row reordering"
    ),

    // ===== Aggregation =====
    aggregationMenuItemHeader: t(
      "common.datagrid.aggregationMenuItemHeader",
      "Aggregation"
    ),
    /*     aggregationFunctionLabelNone: t(
      "common.datagrid.aggregationFunctionLabelNone",
      "none"
    ), */
    aggregationFunctionLabelSum: t(
      "common.datagrid.aggregationFunctionLabelSum",
      "sum"
    ),
    aggregationFunctionLabelAvg: t(
      "common.datagrid.aggregationFunctionLabelAvg",
      "avg"
    ),
    aggregationFunctionLabelMin: t(
      "common.datagrid.aggregationFunctionLabelMin",
      "min"
    ),
    aggregationFunctionLabelMax: t(
      "common.datagrid.aggregationFunctionLabelMax",
      "max"
    ),
    aggregationFunctionLabelSize: t(
      "common.datagrid.aggregationFunctionLabelSize",
      "size"
    ),

    // ===== Pivot panel =====
    pivotToggleLabel: t("common.datagrid.pivotToggleLabel", "Pivot"),
    pivotRows: t("common.datagrid.pivotRows", "Rows"),
    pivotColumns: t("common.datagrid.pivotColumns", "Columns"),
    pivotValues: t("common.datagrid.pivotValues", "Values"),
    pivotCloseButton: t(
      "common.datagrid.pivotCloseButton",
      "Close pivot settings"
    ),
    pivotSearchButton: t("common.datagrid.pivotSearchButton", "Search fields"),
    pivotSearchControlPlaceholder: t(
      "common.datagrid.pivotSearchControlPlaceholder",
      "Search fields"
    ),
    pivotSearchControlLabel: t(
      "common.datagrid.pivotSearchControlLabel",
      "Search fields"
    ),
    pivotSearchControlClear: t(
      "common.datagrid.pivotSearchControlClear",
      "Clear search"
    ),
    pivotNoFields: t("common.datagrid.pivotNoFields", "No fields"),
    pivotMenuMoveUp: t("common.datagrid.pivotMenuMoveUp", "Move up"),
    pivotMenuMoveDown: t("common.datagrid.pivotMenuMoveDown", "Move down"),
    pivotMenuMoveToTop: t("common.datagrid.pivotMenuMoveToTop", "Move to top"),
    pivotMenuMoveToBottom: t(
      "common.datagrid.pivotMenuMoveToBottom",
      "Move to bottom"
    ),
    pivotMenuRows: t("common.datagrid.pivotMenuRows", "Rows"),
    pivotMenuColumns: t("common.datagrid.pivotMenuColumns", "Columns"),
    pivotMenuValues: t("common.datagrid.pivotMenuValues", "Values"),
    pivotMenuOptions: t("common.datagrid.pivotMenuOptions", "Field options"),
    pivotMenuAddToRows: t("common.datagrid.pivotMenuAddToRows", "Add to Rows"),
    pivotMenuAddToColumns: t(
      "common.datagrid.pivotMenuAddToColumns",
      "Add to Columns"
    ),
    pivotMenuAddToValues: t(
      "common.datagrid.pivotMenuAddToValues",
      "Add to Values"
    ),
    pivotMenuRemove: t("common.datagrid.pivotMenuRemove", "Remove"),
    pivotDragToRows: t(
      "common.datagrid.pivotDragToRows",
      "Drag here to create rows"
    ),
    pivotDragToColumns: t(
      "common.datagrid.pivotDragToColumns",
      "Drag here to create columns"
    ),
    pivotDragToValues: t(
      "common.datagrid.pivotDragToValues",
      "Drag here to create values"
    ),
    pivotYearColumnHeaderName: t(
      "common.datagrid.pivotYearColumnHeaderName",
      "(Year)"
    ),
    pivotQuarterColumnHeaderName: t(
      "common.datagrid.pivotQuarterColumnHeaderName",
      "(Quarter)"
    ),

    // ===== Charts configuration panel =====
    /*     chartsNoCharts: t(
      "common.datagrid.chartsNoCharts",
      "There are no charts available"
    ), */
    /*     chartsChartNotSelected: t(
      "common.datagrid.chartsChartNotSelected",
      "Select a chart type to configure its options"
    ), */
    /*  chartsTabChart: t("common.datagrid.chartsTabChart", "Chart"), */
    /*   chartsTabFields: t("common.datagrid.chartsTabFields", "Fields"), */
    /* chartsTabCustomize: t("common.datagrid.chartsTabCustomize", "Customize"), */
    /*     chartsCloseButton: t(
      "common.datagrid.chartsCloseButton",
      "Close charts configuration"
    ), */
    /*     chartsSyncButtonLabel: t(
      "common.datagrid.chartsSyncButtonLabel",
      "Sync chart"
    ), */
    /*     chartsSearchPlaceholder: t(
      "common.datagrid.chartsSearchPlaceholder",
      "Search fields"
    ), */
    /*   chartsSearchLabel: t("common.datagrid.chartsSearchLabel", "Search fields"), */
    /* chartsSearchClear: t("common.datagrid.chartsSearchClear", "Clear search"), */
    /* chartsNoFields: t("common.datagrid.chartsNoFields", "No fields"), */
    /*     chartsFieldBlocked: t(
      "common.datagrid.chartsFieldBlocked",
      "This field cannot be added to any section"
    ), */
    /* chartsCategories: t("common.datagrid.chartsCategories", "Categories"), */
    /* chartsSeries: t("common.datagrid.chartsSeries", "Series"), */
    /*     chartsMenuAddToDimensions: (dimensionLabel: string) =>
      t("common.datagrid.chartsMenuAddToDimensions", {
        dimensionLabel,
        defaultValue: "Add to {{dimensionLabel}}",
      }), */
    /*     chartsMenuAddToValues: (valuesLabel: string) =>
      t("common.datagrid.chartsMenuAddToValues", {
        valuesLabel,
        defaultValue: "Add to {{valuesLabel}}",
      }), */
    /* chartsMenuMoveUp: t("common.datagrid.chartsMenuMoveUp", "Move up"), */
    /* chartsMenuMoveDown: t("common.datagrid.chartsMenuMoveDown", "Move down"), */
    /*     chartsMenuMoveToTop: t(
      "common.datagrid.chartsMenuMoveToTop",
      "Move to top"
    ), */
    /*     chartsMenuMoveToBottom: t(
      "common.datagrid.chartsMenuMoveToBottom",
      "Move to bottom"
    ), */
    /* chartsMenuOptions: t("common.datagrid.chartsMenuOptions", "Field options"), */
    /*  chartsMenuRemove: t("common.datagrid.chartsMenuRemove", "Remove"), */
    /*    chartsDragToDimensions: (dimensionLabel: string) =>
      t("common.datagrid.chartsDragToDimensions", {
        dimensionLabel,
        defaultValue: "Drag here to use column as {{dimensionLabel}}",
      }), */
    /*    chartsDragToValues: (valuesLabel: string) =>
      t("common.datagrid.chartsDragToValues", {
        valuesLabel,
        defaultValue: "Drag here to use column as {{valuesLabel}}",
      }), */

    // ===== AI Assistant (panel) =====
    aiAssistantPanelTitle: t(
      "common.datagrid.aiAssistantPanelTitle",
      "AI Assistant"
    ),
    aiAssistantPanelClose: t(
      "common.datagrid.aiAssistantPanelClose",
      "Close AI Assistant"
    ),
    aiAssistantPanelNewConversation: t(
      "common.datagrid.aiAssistantPanelNewConversation",
      "New conversation"
    ),
    aiAssistantPanelConversationHistory: t(
      "common.datagrid.aiAssistantPanelConversationHistory",
      "Conversation history"
    ),
    aiAssistantPanelEmptyConversation: t(
      "common.datagrid.aiAssistantPanelEmptyConversation",
      "No prompt history"
    ),
    aiAssistantSuggestions: t(
      "common.datagrid.aiAssistantSuggestions",
      "Suggestions"
    ),

    // ===== Prompt field =====
    promptFieldLabel: t("common.datagrid.promptFieldLabel", "Prompt"),
    promptFieldPlaceholder: t(
      "common.datagrid.promptFieldPlaceholder",
      "Type a prompt…"
    ),
    promptFieldPlaceholderWithRecording: t(
      "common.datagrid.promptFieldPlaceholderWithRecording",
      "Type or record a prompt…"
    ),
    promptFieldPlaceholderListening: t(
      "common.datagrid.promptFieldPlaceholderListening",
      "Listening for prompt…"
    ),
    promptFieldSpeechRecognitionNotSupported: t(
      "common.datagrid.promptFieldSpeechRecognitionNotSupported",
      "Speech recognition is not supported in this browser"
    ),
    promptFieldSend: t("common.datagrid.promptFieldSend", "Send"),
    promptFieldRecord: t("common.datagrid.promptFieldRecord", "Record"),
    promptFieldStopRecording: t(
      "common.datagrid.promptFieldStopRecording",
      "Stop recording"
    ),

    // ===== Prompt (status) =====
    promptRerun: t("common.datagrid.promptRerun", "Run again"),
    promptProcessing: t("common.datagrid.promptProcessing", "Processing…"),
    promptAppliedChanges: t(
      "common.datagrid.promptAppliedChanges",
      "Applied changes"
    ),

    // ===== Prompt changes =====
    promptChangeGroupDescription: (column: string) =>
      t("common.datagrid.promptChangeGroupDescription", {
        column,
        defaultValue: "Group by {{column}}",
      }),
    promptChangeAggregationLabel: (column: string, aggregation: string) =>
      t("common.datagrid.promptChangeAggregationLabel", {
        column,
        aggregation,
        defaultValue: "{{column}} ({{aggregation}})",
      }),
    promptChangeAggregationDescription: (column: string, aggregation: string) =>
      t("common.datagrid.promptChangeAggregationDescription", {
        column,
        aggregation,
        defaultValue: "Aggregate {{column}} ({{aggregation}})",
      }),
    promptChangeFilterLabel: (
      column: string,
      operator: string,
      value: string
    ) =>
      operator === "is any of"
        ? t("common.datagrid.promptChangeFilterLabelAnyOf", {
            column,
            value,
            defaultValue: "{{column}} is any of: {{value}}",
          })
        : t("common.datagrid.promptChangeFilterLabel", {
            column,
            operator,
            value,
            defaultValue: "{{column}} {{operator}} {{value}}",
          }),
    promptChangeFilterDescription: (
      column: string,
      operator: string,
      value: string
    ) =>
      operator === "is any of"
        ? t("common.datagrid.promptChangeFilterDescriptionAnyOf", {
            column,
            value,
            defaultValue: "Filter where {{column}} is any of: {{value}}",
          })
        : t("common.datagrid.promptChangeFilterDescription", {
            column,
            operator,
            value,
            defaultValue: "Filter where {{column}} {{operator}} {{value}}",
          }),
    promptChangeSortDescription: (column: string, direction: string) =>
      t("common.datagrid.promptChangeSortDescription", {
        column,
        direction,
        defaultValue: "Sort by {{column}} ({{direction}})",
      }),
    promptChangePivotEnableLabel: t(
      "common.datagrid.promptChangePivotEnableLabel",
      "Pivot"
    ),
    promptChangePivotEnableDescription: t(
      "common.datagrid.promptChangePivotEnableDescription",
      "Enable pivot"
    ),
    promptChangePivotColumnsLabel: (count: number) =>
      t("common.datagrid.promptChangePivotColumnsLabel", {
        count,
        defaultValue: "Columns ({{count}})",
      }),
    promptChangePivotColumnsDescription: (column: string, direction: string) =>
      t("common.datagrid.promptChangePivotColumnsDescription", {
        column,
        direction,
        defaultValue: "{{column}}{{direction ? ` (${direction})` : ''}}",
      }),
    promptChangePivotRowsLabel: (count: number) =>
      t("common.datagrid.promptChangePivotRowsLabel", {
        count,
        defaultValue: "Rows ({{count}})",
      }),
    promptChangePivotValuesLabel: (count: number) =>
      t("common.datagrid.promptChangePivotValuesLabel", {
        count,
        defaultValue: "Values ({{count}})",
      }),
    promptChangePivotValuesDescription: (column: string, aggregation: string) =>
      t("common.datagrid.promptChangePivotValuesDescription", {
        column,
        aggregation,
        defaultValue: "{{column}} ({{aggregation}})",
      }),
  };
  return {
    ...GRID_DEFAULT_LOCALE_TEXT,
    ...overrides,
  };
}
