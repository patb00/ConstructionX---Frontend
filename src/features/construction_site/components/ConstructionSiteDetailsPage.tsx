import {
  Box,
  Button,
  Stack,
  Typography,
  Card,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PlaceIcon from "@mui/icons-material/Place";
import BadgeIcon from "@mui/icons-material/Badge";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import HandymanIcon from "@mui/icons-material/Handyman";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { FaTools, FaCarSide, FaMinusCircle, FaUser } from "react-icons/fa";

import StatCard from "./StatCard";
import { formatDate, formatDateRange } from "../utils/dates";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConstructionSite } from "../hooks/useConstructionSite";
import { useState, useMemo, useCallback } from "react";

import AssignEmployeesDialog from "./AssignEmployeesDialog";
import AssignToolsDialog from "./AssignToolsDialog";
import AssignVehiclesDialog from "./AssignVehiclesDialog";
import {
  BoardView,
  type BoardColumnConfig,
} from "../../../components/ui/views/BoardView";

import { useAssignEmployeesToConstructionSite } from "../hooks/useAssignEmployeesToConstructionSite";
import { useAssignToolsToConstructionSite } from "../hooks/useAssignToolsToConstructionSite";
import { useAssignVehiclesToConstructionSite } from "../hooks/useAssignVehiclesToConstructionSite";

import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { fullName } from "../utils/name";
import { normalizeText } from "../utils/normalize";
import { useConstructionSiteStatusOptions } from "../hooks/useConstructionSiteStatusOptions";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  jobPositionName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
};

type Tool = {
  id: number;
  name?: string | null;
  model?: string | null;
  inventoryNumber?: string | null;
  serialNumber?: string | null;
  status?: string | null;
  condition?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  responsibleEmployeeName?: string | null;
  responsibleEmployeeId?: number | null;
};

type Vehicle = {
  id: number;
  name?: string | null;
  brand?: string | null;
  model?: string | null;
  registrationNumber?: string | null;
  status?: string | null;
  condition?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  responsibleEmployeeName?: string | null;
  responsibleEmployeeId?: number | null;
};

type RemoveBadgeIconProps = {
  icon: React.ReactNode;
};

function RemoveBadgeIcon({ icon }: RemoveBadgeIconProps) {
  return (
    <Box sx={{ position: "relative", width: 16, height: 16 }}>
      {icon}
      <FaMinusCircle
        size={10}
        color="#d32f2f"
        style={{
          position: "absolute",
          bottom: -4,
          right: -4,
          background: "white",
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}

export default function ConstructionSiteDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const siteId = Number(id);

  if (!Number.isFinite(siteId))
    return <div>{t("constructionSites.edit.invalidUrlId")}</div>;

  const { data } = useConstructionSite(siteId);
  const { employeeRows = [] } = useEmployees();

  const [openEmp, setOpenEmp] = useState(false);
  const [openTools, setOpenTools] = useState(false);
  const [openVeh, setOpenVeh] = useState(false);

  const assignEmp = useAssignEmployeesToConstructionSite();
  const assignTools = useAssignToolsToConstructionSite();
  const assignVeh = useAssignVehiclesToConstructionSite();

  const statusOptions = useConstructionSiteStatusOptions();

  const employees = (data?.constructionSiteEmployees ?? []) as Employee[];
  const tools = (data?.constructionSiteTools ?? []) as Tool[];
  const vehicles = (data?.constructionSiteVehicles ?? []) as Vehicle[];

  const statusLabel = useMemo(() => {
    if (data?.status == null) return "—";
    return statusOptions.find((opt) => opt.value === data.status)?.label ?? "—";
  }, [data?.status, statusOptions]);

  const removeBtnSx = {
    position: "absolute" as const,
    bottom: 6,
    right: 6,
    opacity: 0.75,
    "&:hover": { opacity: 1 },
  };

  const employeeIdByName = useMemo(() => {
    return new Map(
      (employeeRows as any[]).map((e: any) => [
        normalizeText(fullName(e.firstName, e.lastName)),
        Number(e.id),
      ])
    );
  }, [employeeRows]);

  const resolveResponsibleEmployeeId = useCallback(
    (item: {
      responsibleEmployeeId?: number | null;
      responsibleEmployeeName?: string | null;
    }) => {
      const direct = item.responsibleEmployeeId;
      if (Number.isFinite(Number(direct))) return Number(direct);

      const name = item.responsibleEmployeeName;
      if (name) {
        const mapped = employeeIdByName.get(normalizeText(name));
        if (Number.isFinite(Number(mapped))) return Number(mapped);
      }

      return null;
    },
    [employeeIdByName]
  );

  const unassignEmployee = useCallback(
    (employeeIdToRemove: number) => {
      const remaining = employees
        .filter((e) => e.id !== employeeIdToRemove)
        .map((e) => ({
          employeeId: e.id,
          dateFrom: e.dateFrom ?? null,
          dateTo: e.dateTo ?? null,
        }));

      assignEmp.mutate({
        constructionSiteId: siteId,
        employees: remaining,
      } as any);
    },
    [assignEmp, employees, siteId]
  );

  const unassignTool = useCallback(
    (toolIdToRemove: number) => {
      const remaining = tools
        .filter((x) => x.id !== toolIdToRemove)
        .map((x) => {
          const respId = resolveResponsibleEmployeeId(x);
          return {
            toolId: x.id,
            dateFrom: x.dateFrom ?? null,
            dateTo: x.dateTo ?? null,
            responsibleEmployeeId: respId,
          };
        });

      assignTools.mutate({
        constructionSiteId: siteId,
        tools: remaining,
      } as any);
    },
    [assignTools, tools, siteId, resolveResponsibleEmployeeId]
  );

  const unassignVehicle = useCallback(
    (vehicleIdToRemove: number) => {
      const remaining = vehicles
        .filter((x) => x.id !== vehicleIdToRemove)
        .map((x) => {
          const respId = resolveResponsibleEmployeeId(x);
          return {
            vehicleId: x.id,
            dateFrom: x.dateFrom ?? null,
            dateTo: x.dateTo ?? null,
            responsibleEmployeeId: respId,
          };
        });

      assignVeh.mutate({
        constructionSiteId: siteId,
        vehicles: remaining,
      } as any);
    },
    [assignVeh, vehicles, siteId, resolveResponsibleEmployeeId]
  );

  const columns: BoardColumnConfig[] = useMemo(() => {
    const employeeCount = employees.length;
    const toolCount = tools.length;
    const vehicleCount = vehicles.length;

    const employeeEmpty = (
      <Stack spacing={1.5} sx={{ p: 2, pl: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {t("constructionSites.detail.noEmployees")}
        </Typography>

        <Box
          onClick={() => setOpenEmp(true)}
          sx={{
            p: 1.5,
            border: "1px dashed",
            borderColor: "primary.main",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AddIcon fontSize="small" color="primary" />
          <Typography variant="body2">
            {t("constructionSites.detail.addFirstEmployee")}
          </Typography>
        </Box>
      </Stack>
    );

    const toolsEmpty = (
      <Stack spacing={1.5} sx={{ p: 2, pl: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {t("constructionSites.detail.noTools")}
        </Typography>

        <Box
          onClick={() => setOpenTools(true)}
          sx={{
            p: 1.5,
            border: "1px dashed",
            borderColor: "primary.main",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AddIcon fontSize="small" color="primary" />
          <Typography variant="body2">
            {t("constructionSites.detail.addFirstTool")}
          </Typography>
        </Box>
      </Stack>
    );

    const vehiclesEmpty = (
      <Stack spacing={1.5} sx={{ p: 2, pl: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {t("constructionSites.detail.noVehicles")}
        </Typography>

        <Box
          onClick={() => setOpenVeh(true)}
          sx={{
            p: 1.5,
            border: "1px dashed",
            borderColor: "primary.main",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AddIcon fontSize="small" color="primary" />
          <Typography variant="body2">
            {t("constructionSites.detail.addFirstVehicle")}
          </Typography>
        </Box>
      </Stack>
    );

    const employeeColumn: BoardColumnConfig<Employee> = {
      id: "employees",
      icon: <GroupIcon color="primary" fontSize="small" />,
      title: t("constructionSites.detail.employees"),
      rows: employees,
      count: employeeCount,
      headerAction: (
        <IconButton
          size="small"
          onClick={() => setOpenEmp(true)}
          disableRipple
          sx={{
            p: 0.25,
            color: "primary.main",
            "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      ),
      emptyContent: employeeEmpty,
      renderRow: (e) => {
        const fullNameTxt = `${e.firstName} ${e.lastName}`.trim();
        const position = e.jobPositionName || t("common.notAvailable");
        const dateRange = formatDateRange(e.dateFrom, e.dateTo);

        return (
          <Card key={e.id} sx={{ p: 1.5, position: "relative" }}>
            <Tooltip title={t("common.unassign")}>
              <IconButton
                size="small"
                onClick={(evt) => {
                  evt.stopPropagation();
                  unassignEmployee(e.id);
                }}
                disabled={assignEmp.isPending}
                sx={removeBtnSx}
              >
                <RemoveBadgeIcon icon={<FaUser size={14} />} />
              </IconButton>
            </Tooltip>

            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ mb: 0.25 }}
              noWrap
            >
              {fullNameTxt}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.25 }}
              noWrap
            >
              {position}
            </Typography>

            {dateRange && (
              <Typography
                variant="caption"
                color="primary.main"
                sx={{ display: "block", mt: 0.25 }}
              >
                {dateRange}
              </Typography>
            )}
          </Card>
        );
      },
    };

    const toolsColumn: BoardColumnConfig<Tool> = {
      id: "tools",
      icon: <HandymanIcon color="primary" fontSize="small" />,
      title: t("constructionSites.detail.tools"),
      rows: tools,
      count: toolCount,
      headerAction: (
        <IconButton
          size="small"
          onClick={() => setOpenTools(true)}
          disableRipple
          sx={{
            p: 0.25,
            color: "primary.main",
            "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      ),
      emptyContent: toolsEmpty,
      renderRow: (tool) => {
        const title =
          tool.name ||
          tool.model ||
          tool.inventoryNumber ||
          tool.serialNumber ||
          "—";

        const meta =
          [
            tool.model &&
              `${t("constructionSites.detail.tool.modelShort")}: ${tool.model}`,
            tool.inventoryNumber &&
              `${t("constructionSites.detail.tool.inventoryShort")}: ${
                tool.inventoryNumber
              }`,
            tool.serialNumber &&
              `${t("constructionSites.detail.tool.serialShort")}: ${
                tool.serialNumber
              }`,
          ]
            .filter(Boolean)
            .join(" · ") || "—";

        const dateRange = formatDateRange(tool.dateFrom, tool.dateTo);

        return (
          <Card key={tool.id} sx={{ p: 1.5, position: "relative" }}>
            <Tooltip title={t("common.unassign")}>
              <IconButton
                size="small"
                onClick={(evt) => {
                  evt.stopPropagation();
                  unassignTool(tool.id);
                }}
                disabled={assignTools.isPending}
                sx={removeBtnSx}
              >
                <RemoveBadgeIcon icon={<FaTools size={14} />} />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 0.5,
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                  sx={{ mb: 0.25 }}
                >
                  {title}
                </Typography>

                {tool.responsibleEmployeeName && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {tool.responsibleEmployeeName}
                  </Typography>
                )}
              </Box>

              {tool.condition && <Chip size="small" label={tool.condition} />}
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.25 }}
              noWrap
            >
              {meta}
            </Typography>

            {dateRange && (
              <Typography
                variant="caption"
                color="primary.main"
                sx={{ display: "block", mt: 0.25 }}
              >
                {dateRange}
              </Typography>
            )}
          </Card>
        );
      },
    };

    const vehiclesColumn: BoardColumnConfig<Vehicle> = {
      id: "vehicles",
      icon: <DirectionsCarIcon color="primary" fontSize="small" />,
      title: t("constructionSites.detail.vehicles"),
      rows: vehicles,
      count: vehicleCount,
      headerAction: (
        <IconButton
          size="small"
          onClick={() => setOpenVeh(true)}
          disableRipple
          sx={{
            p: 0.25,
            color: "primary.main",
            "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      ),
      emptyContent: vehiclesEmpty,
      renderRow: (v) => {
        const title =
          v.name ||
          `${v.brand ?? ""} ${v.model ?? ""}`.trim() ||
          v.registrationNumber ||
          "—";

        const meta =
          [
            v.registrationNumber &&
              `${t("constructionSites.detail.vehicle.registration")}: ${
                v.registrationNumber
              }`,
            v.brand &&
              v.model &&
              `${t("constructionSites.detail.vehicle.model")}: ${v.brand} ${
                v.model
              }`,
          ]
            .filter(Boolean)
            .join(" · ") || "—";

        const dateRange = formatDateRange(v.dateFrom, v.dateTo);

        return (
          <Card key={v.id} sx={{ p: 1.5, position: "relative" }}>
            <Tooltip title={t("common.unassign")}>
              <IconButton
                size="small"
                onClick={(evt) => {
                  evt.stopPropagation();
                  unassignVehicle(v.id);
                }}
                disabled={assignVeh.isPending}
                sx={removeBtnSx}
              >
                <RemoveBadgeIcon icon={<FaCarSide size={14} />} />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 0.5,
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                  sx={{ mb: 0.25 }}
                >
                  {title}
                </Typography>

                {v.responsibleEmployeeName && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {v.responsibleEmployeeName}
                  </Typography>
                )}
              </Box>

              {(v.condition || v.status) && (
                <Stack direction="row" spacing={0.5}>
                  {v.status && (
                    <Chip size="small" variant="outlined" label={v.status} />
                  )}
                  {v.condition && <Chip size="small" label={v.condition} />}
                </Stack>
              )}
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.25 }}
              noWrap
            >
              {meta}
            </Typography>

            {dateRange && (
              <Typography
                variant="caption"
                color="primary.main"
                sx={{ display: "block", mt: 0.25 }}
              >
                {dateRange}
              </Typography>
            )}
          </Card>
        );
      },
    };

    return [employeeColumn, vehiclesColumn, toolsColumn];
  }, [
    employees,
    tools,
    vehicles,
    t,
    assignEmp.isPending,
    assignTools.isPending,
    assignVeh.isPending,
    unassignEmployee,
    unassignTool,
    unassignVehicle,
    removeBtnSx,
    setOpenEmp,
    setOpenTools,
    setOpenVeh,
  ]);

  return (
    <Stack spacing={2} sx={{ width: "100%", minWidth: 0 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("constructionSites.detail.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/constructionSites")}
          sx={{ color: "primary.main" }}
        >
          {t("constructionSites.edit.back")}
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <StatCard
          icon={<CalendarTodayIcon />}
          label={t("constructionSites.fields.period")}
          value={`${formatDate(data?.startDate)} — ${formatDate(
            data?.plannedEndDate
          )}`}
          caption={`${t("constructionSites.fields.created")}: ${formatDate(
            data?.createdDate
          )}`}
        />
        <StatCard
          icon={<BadgeIcon />}
          label={t("constructionSites.fields.manager")}
          value={data?.siteManagerName || "—"}
          caption={`${t("constructionSites.fields.id")}: ${data?.id ?? "—"}`}
        />
        <StatCard
          icon={<PlaceIcon />}
          label={t("constructionSites.fields.location")}
          value={data?.location || "—"}
          caption={`${t("constructionSites.fields.name")}: ${
            data?.name || "—"
          }`}
        />
        <StatCard
          icon={<InfoOutlinedIcon />}
          label={t("constructionSites.fields.status")}
          value={statusLabel}
          caption={`${t("constructionSites.fields.id")}: ${data?.id ?? "—"}`}
        />
      </Box>

      <BoardView columns={columns} />

      <AssignEmployeesDialog
        constructionSiteId={siteId}
        open={openEmp}
        onClose={() => setOpenEmp(false)}
      />
      <AssignToolsDialog
        constructionSiteId={siteId}
        open={openTools}
        onClose={() => setOpenTools(false)}
      />
      <AssignVehiclesDialog
        constructionSiteId={siteId}
        open={openVeh}
        onClose={() => setOpenVeh(false)}
      />
    </Stack>
  );
}
