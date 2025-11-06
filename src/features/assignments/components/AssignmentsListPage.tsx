import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import { Construction, DirectionsCar, Handyman } from "@mui/icons-material";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { useAssignedVehicles } from "../../administration/employees/hooks/useAssignedVehicles";
import { useAssignedConstructionSites } from "../../administration/employees/hooks/useAssignedConstructionSites";
import { useAssignedTools } from "../../administration/employees/hooks/useAssignedTools";
import { StatCard } from "../../../components/ui/StatCard";
import type {
  AssignedConstructionSite,
  AssignedTool,
  AssignedVehicle,
} from "../../administration/employees";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useTranslation } from "react-i18next";

type TabKey = "construction" | "vehicles" | "tools";

const AssignmentsListPage = () => {
  const { t } = useTranslation();
  const { employeeRows = [] } = useEmployees();

  const {
    acsRows,
    acsColumns,
    isLoading: isLoadingSites,
  } = useAssignedConstructionSites();
  const {
    vehicleRows,
    vehicleColumns,
    isLoading: isLoadingVehicles,
  } = useAssignedVehicles();
  const {
    toolRows,
    toolColumns,
    isLoading: isLoadingTools,
  } = useAssignedTools();

  const { userId, role } = useAuthStore();

  const myUserId = React.useMemo(() => {
    const n =
      typeof userId === "string"
        ? parseInt(userId, 10)
        : typeof userId === "number"
        ? userId
        : NaN;
    return Number.isFinite(n) ? n : null;
  }, [userId]);

  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<
    number | ""
  >("");

  const effectiveEmployeeId =
    role === "Admin"
      ? typeof selectedEmployeeId === "number"
        ? selectedEmployeeId
        : null
      : myUserId;

  const myConstructionRows = React.useMemo(
    () =>
      effectiveEmployeeId == null
        ? acsRows
        : acsRows.filter((r) => r.employeeId === effectiveEmployeeId),
    [acsRows, effectiveEmployeeId]
  );

  const myVehicleRows = React.useMemo(
    () =>
      effectiveEmployeeId == null
        ? vehicleRows
        : vehicleRows.filter(
            (r) => r.responsibleEmployeeId === effectiveEmployeeId
          ),
    [vehicleRows, effectiveEmployeeId]
  );

  const myToolRows = React.useMemo(
    () =>
      effectiveEmployeeId == null
        ? toolRows
        : toolRows.filter(
            (r) => r.responsibleEmployeeId === effectiveEmployeeId
          ),
    [toolRows, effectiveEmployeeId]
  );

  const counts = {
    construction: myConstructionRows.length,
    vehicles: myVehicleRows.length,
    tools: myToolRows.length,
  };

  const [tab, setTab] = React.useState<TabKey>("construction");

  const itemSx = {
    flexBasis: {
      xs: "100%",
      sm: "calc(50% - 8px)",
      md: "calc(33.333% - 12px)",
    },
    flexGrow: 1,
  } as const;

  const getEmployeeLabel = (e: any) =>
    [e?.firstName, e?.lastName].filter(Boolean).join(" ") || `#${e?.id}`;

  const handleSelectChange = (e: SelectChangeEvent<number | "">) => {
    const v = e.target.value;
    if (v === "" || v === undefined || v === null) {
      setSelectedEmployeeId("");
    } else {
      const num = typeof v === "number" ? v : Number(v);
      setSelectedEmployeeId(Number.isFinite(num) ? num : "");
    }
  };

  console.log(acsColumns, vehicleColumns, toolColumns);

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Typography variant="h5" fontWeight={600}>
        {t("assignments.title")}
      </Typography>

      {role === "Admin" && (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 280 }} variant="outlined">
            <InputLabel id="employee-select-label" shrink>
              {t("assignments.filterByEmployee")}
            </InputLabel>
            <Select<number | "">
              labelId="employee-select-label"
              id="employee-select"
              label={t("assignments.filterByEmployee")}
              value={selectedEmployeeId}
              onChange={handleSelectChange}
              displayEmpty
              renderValue={(val) => {
                if (val === "") return <em>{t("assignments.allEmployees")}</em>;
                const id = typeof val === "number" ? val : Number(val);
                const emp = employeeRows.find((x) => x.id === id);
                return emp ? getEmployeeLabel(emp) : `#${id}`;
              }}
            >
              <MenuItem value="">
                <em>{t("assignments.allEmployees")}</em>
              </MenuItem>
              {employeeRows.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {getEmployeeLabel(e)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <StatCard
          sx={itemSx}
          label={t("assignments.construction")}
          value={counts.construction}
          icon={<Construction color="primary" fontSize="small" />}
          onClick={
            counts.construction > 0 ? () => setTab("construction") : undefined
          }
          selected={tab === "construction"}
          disabled={counts.construction === 0}
        />
        <StatCard
          sx={itemSx}
          label={t("assignments.vehicles")}
          value={counts.vehicles}
          icon={<DirectionsCar color="primary" fontSize="small" />}
          onClick={counts.vehicles > 0 ? () => setTab("vehicles") : undefined}
          selected={tab === "vehicles"}
          disabled={counts.vehicles === 0}
        />
        <StatCard
          sx={itemSx}
          label={t("assignments.tools")}
          value={counts.tools}
          icon={<Handyman color="primary" fontSize="small" />}
          onClick={counts.tools > 0 ? () => setTab("tools") : undefined}
          selected={tab === "tools"}
          disabled={counts.tools === 0}
        />
      </Box>

      <Box sx={{ height: "100%", width: "100%" }}>
        {tab === "construction" && (
          <ReusableDataGrid<AssignedConstructionSite>
            rows={myConstructionRows}
            columns={acsColumns}
            loading={isLoadingSites}
            exportFileName="assigned-construction-sites"
            pageSize={25}
          />
        )}

        {tab === "vehicles" && (
          <ReusableDataGrid<AssignedVehicle>
            rows={myVehicleRows}
            columns={vehicleColumns}
            loading={isLoadingVehicles}
            exportFileName="assigned-vehicles"
            pageSize={25}
          />
        )}

        {tab === "tools" && (
          <ReusableDataGrid<AssignedTool>
            rows={myToolRows}
            columns={toolColumns}
            loading={isLoadingTools}
            exportFileName="assigned-tools"
            pageSize={25}
          />
        )}
      </Box>
    </Stack>
  );
};

export default AssignmentsListPage;
