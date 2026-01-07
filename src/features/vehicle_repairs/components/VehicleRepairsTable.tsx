import { useMemo } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

import type { VehicleRepair } from "..";
import { useVehicleRepairsAll } from "../hooks/useVehicleRepairsAll";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString()
    : String(value);
};

const formatNumber = (value?: number | null) => {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
};

export default function VehicleRepairsTable() {
  const { t } = useTranslation();
  const { repairs, total, paginationModel, setPaginationModel, error, isLoading } =
    useVehicleRepairsAll();

  const columns = useMemo<GridColDef<VehicleRepair>[]>(
    () => [
      {
        field: "name",
        headerName: t("common.columns.name"),
        minWidth: 180,
        flex: 1,
      },
      {
        field: "registrationNumber",
        headerName: t("common.columns.registrationNumber"),
        minWidth: 180,
      },
      {
        field: "model",
        headerName: t("common.columns.model"),
        minWidth: 160,
      },
      {
        field: "yearOfManufacturing",
        headerName: t("common.columns.yearOfManufacturing"),
        minWidth: 170,
      },
      {
        field: "vehicleType",
        headerName: t("common.columns.vehicleType"),
        minWidth: 160,
        valueFormatter: (params) => params.value ?? "—",
      },
      {
        field: "horsePower",
        headerName: t("common.columns.horsePower"),
        minWidth: 140,
        valueFormatter: (params) => formatNumber(params.value),
      },
      {
        field: "repairDate",
        headerName: t("common.columns.repairDate"),
        minWidth: 150,
        valueFormatter: (params) => formatDate(params.value),
      },
      {
        field: "cost",
        headerName: t("common.columns.cost"),
        minWidth: 130,
        valueFormatter: (params) => formatNumber(params.value),
      },
      {
        field: "condition",
        headerName: t("common.columns.condition"),
        minWidth: 160,
      },
      {
        field: "description",
        headerName: t("common.columns.description"),
        minWidth: 220,
        flex: 1,
        valueFormatter: (params) => params.value ?? "—",
      },
    ],
    [t]
  );

  if (error) {
    return <div>{t("vehicleRepairs.list.error")}</div>;
  }

  return (
    <ReusableDataGrid<VehicleRepair>
      storageKey="vehicle-repairs"
      rows={repairs}
      columns={columns}
      getRowId={(row) => String(row.id)}
      loading={!!isLoading}
      paginationMode="server"
      rowCount={total}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
    />
  );
}
