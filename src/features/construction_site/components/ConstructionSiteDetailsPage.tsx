import {
  Box,
  Button,
  Stack,
  Typography,
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
import ApartmentIcon from "@mui/icons-material/Apartment";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FaTools, FaCarSide, FaUser } from "react-icons/fa";
import { formatDate, formatDateRange } from "../utils/dates";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConstructionSite } from "../hooks/useConstructionSite";
import { useState, useMemo, useCallback } from "react";
import {
  BoardView,
  type BoardColumnConfig,
} from "../../../components/ui/views/BoardView";
import { useAssignEmployeesToConstructionSite } from "../hooks/useAssignEmployeesToConstructionSite";
import { useAssignToolsToConstructionSite } from "../hooks/useAssignToolsToConstructionSite";
import { useAssignVehiclesToConstructionSite } from "../hooks/useAssignVehiclesToConstructionSite";
import { useAssignCondosToConstructionSite } from "../hooks/useAssignCondosToConstructionSite";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { fullName } from "../utils/name";
import { normalizeText } from "../utils/normalize";
import { useConstructionSiteStatusOptions } from "../../constants/enum/useConstructionSiteStatusOptions";
import AssignCondosDialog from "./dialogs/AssignCondosDialog";
import AssignEmployeesToCondoDialog from "./dialogs/AssignEmployeesToCondoDialog";
import AssignVehiclesDialog from "./dialogs/AssignVehiclesDialog";
import AssignToolsDialog from "./dialogs/AssignToolsDialog";
import AssignEmployeesDialog from "./dialogs/AssignEmployeesDialog";
import { buildUnassign } from "../utils/unassign";
import { EmptyColumn } from "../../../components/ui/EmptyColumn";
import { RemoveActionButton } from "../../../components/ui/RemoveActionButton";
import { BoardItemCard } from "../../../components/ui/BoardItemCard";
import StatCardDetail from "../../../components/ui/StatCardDetail";
import { AddBadgeIcon } from "../../../components/ui/icons/AddBadgeIcon";
import { RemoveBadgeIcon } from "../../../components/ui/icons/RemoveBadgeIcon";

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

type Condo = {
  id: number;
  name?: string | null;
  code?: string | null;
  status?: string | null;
  condition?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  responsibleEmployeeName?: string | null;
  responsibleEmployeeId?: number | null;
};

const addHeaderAction = (onClick: () => void) => (
  <IconButton
    size="small"
    onClick={onClick}
    disableRipple
    sx={{
      p: 0.25,
      color: "primary.main",
      "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
    }}
  >
    <AddIcon fontSize="small" />
  </IconButton>
);

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
  const [openCondos, setOpenCondos] = useState(false);
  const [assignEmpCondoId, setAssignEmpCondoId] = useState<number | null>(null);
  const openAssignEmployees = assignEmpCondoId != null;
  const assignEmp = useAssignEmployeesToConstructionSite();
  const assignTools = useAssignToolsToConstructionSite();
  const assignVeh = useAssignVehiclesToConstructionSite();
  const assignCondos = useAssignCondosToConstructionSite();
  const statusOptions = useConstructionSiteStatusOptions();
  const employees = (data?.constructionSiteEmployees ?? []) as Employee[];
  const tools = (data?.constructionSiteTools ?? []) as Tool[];
  const vehicles = (data?.constructionSiteVehicles ?? []) as Vehicle[];
  const condos = (data?.constructionSiteCondos ?? []) as Condo[];
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

  const unassignEmployee = useMemo(
    () =>
      buildUnassign({
        siteId,
        items: employees,
        mutate: assignEmp.mutate,
        payloadKey: "employees",
        mapItem: (e: Employee) => ({
          employeeId: e.id,
          dateFrom: e.dateFrom ?? null,
          dateTo: e.dateTo ?? null,
        }),
      }),
    [siteId, employees, assignEmp.mutate]
  );

  const mapWithResponsible = useCallback(
    (x: {
      id: number;
      dateFrom?: string | null;
      dateTo?: string | null;
      responsibleEmployeeId?: number | null;
      responsibleEmployeeName?: string | null;
    }) => ({
      dateFrom: x.dateFrom ?? null,
      dateTo: x.dateTo ?? null,
      responsibleEmployeeId: resolveResponsibleEmployeeId(x),
    }),
    [resolveResponsibleEmployeeId]
  );

  const unassignTool = useMemo(
    () =>
      buildUnassign({
        siteId,
        items: tools,
        mutate: assignTools.mutate,
        payloadKey: "tools",
        mapItem: (t: Tool) => ({
          toolId: t.id,
          ...mapWithResponsible(t),
        }),
      }),
    [siteId, tools, assignTools.mutate, mapWithResponsible]
  );

  const unassignVehicle = useMemo(
    () =>
      buildUnassign({
        siteId,
        items: vehicles,
        mutate: assignVeh.mutate,
        payloadKey: "vehicles",
        mapItem: (x: Vehicle) => ({
          vehicleId: x.id,
          ...mapWithResponsible(x),
        }),
      }),
    [siteId, vehicles, assignVeh.mutate, mapWithResponsible]
  );

  const unassignCondo = useMemo(
    () =>
      buildUnassign({
        siteId,
        items: condos,
        mutate: assignCondos.mutate,
        payloadKey: "condos",
        mapItem: (x: Condo) => ({ condoId: x.id, ...mapWithResponsible(x) }),
      }),
    [siteId, condos, assignCondos.mutate, mapWithResponsible]
  );

  const columns: BoardColumnConfig[] = useMemo(() => {
    const employeeCount = employees.length;
    const toolCount = tools.length;
    const vehicleCount = vehicles.length;
    const condoCount = condos.length;

    const employeeColumn: BoardColumnConfig<Employee> = {
      id: "employees",
      icon: <GroupIcon color="primary" fontSize="small" />,
      title: t("constructionSites.detail.employees"),
      rows: employees,
      count: employeeCount,
      headerAction: addHeaderAction(() => setOpenEmp(true)),
      emptyContent: (
        <EmptyColumn
          text={t("constructionSites.detail.noEmployees")}
          cta={t("constructionSites.detail.addFirstEmployee")}
          onAdd={() => setOpenEmp(true)}
        />
      ),
      renderRow: (e) => {
        const fullNameTxt = `${e.firstName} ${e.lastName}`.trim();
        const position = e.jobPositionName || t("common.notAvailable");
        const dateRange = formatDateRange(e.dateFrom, e.dateTo);

        return (
          <BoardItemCard
            key={e.id}
            actions={
              <RemoveActionButton
                title={t("common.unassign")}
                icon={<RemoveBadgeIcon icon={<FaUser size={14} />} />}
                onClick={() => unassignEmployee(e.id)}
                disabled={assignEmp.isPending}
                sx={removeBtnSx}
              />
            }
            dateRangeText={dateRange}
          >
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
          </BoardItemCard>
        );
      },
    };

    const toolsColumn: BoardColumnConfig<Tool> = {
      id: "tools",
      icon: <HandymanIcon color="primary" fontSize="small" />,
      title: t("constructionSites.detail.tools"),
      rows: tools,
      count: toolCount,
      headerAction: addHeaderAction(() => setOpenTools(true)),
      emptyContent: (
        <EmptyColumn
          text={t("constructionSites.detail.noTools")}
          cta={t("constructionSites.detail.addFirstTool")}
          onAdd={() => setOpenTools(true)}
        />
      ),
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
          <BoardItemCard
            key={tool.id}
            actions={
              <RemoveActionButton
                title={t("common.unassign")}
                icon={<RemoveBadgeIcon icon={<FaTools size={14} />} />}
                onClick={() => unassignTool(tool.id)}
                disabled={assignTools.isPending}
                sx={removeBtnSx}
              />
            }
            dateRangeText={dateRange}
          >
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
          </BoardItemCard>
        );
      },
    };

    const vehiclesColumn: BoardColumnConfig<Vehicle> = {
      id: "vehicles",
      icon: <DirectionsCarIcon color="primary" fontSize="small" />,
      title: t("constructionSites.detail.vehicles"),
      rows: vehicles,
      count: vehicleCount,
      headerAction: addHeaderAction(() => setOpenVeh(true)),
      emptyContent: (
        <EmptyColumn
          text={t("constructionSites.detail.noVehicles")}
          cta={t("constructionSites.detail.addFirstVehicle")}
          onAdd={() => setOpenVeh(true)}
        />
      ),
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
          <BoardItemCard
            key={v.id}
            actions={
              <RemoveActionButton
                title={t("common.unassign")}
                icon={<RemoveBadgeIcon icon={<FaCarSide size={14} />} />}
                onClick={() => unassignVehicle(v.id)}
                disabled={assignVeh.isPending}
                sx={removeBtnSx}
              />
            }
            dateRangeText={dateRange}
          >
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
          </BoardItemCard>
        );
      },
    };

    const condosColumn: BoardColumnConfig<Condo> = {
      id: "condos",
      icon: <ApartmentIcon color="primary" fontSize="small" />,
      title: t("constructionSites.detail.condos"),
      rows: condos,
      count: condoCount,
      headerAction: addHeaderAction(() => setOpenCondos(true)),
      emptyContent: (
        <EmptyColumn
          text={t("constructionSites.detail.noCondos")}
          cta={t("constructionSites.detail.addFirstCondo")}
          onAdd={() => setOpenCondos(true)}
        />
      ),
      renderRow: (c) => {
        const dateRange = formatDateRange(c.dateFrom, c.dateTo);

        return (
          <BoardItemCard
            key={c.id}
            actions={
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  position: "absolute",
                  bottom: 6,
                  right: 6,
                  alignItems: "center",
                }}
              >
                <Tooltip title={t("condos.assignEmployees.title")}>
                  <IconButton
                    size="small"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setAssignEmpCondoId(c.id);
                    }}
                    sx={{
                      p: 0.25,
                      "&:hover": {
                        backgroundColor: "transparent",
                        opacity: 0.85,
                      },
                    }}
                  >
                    <AddBadgeIcon icon={<FaUser size={14} />} />
                  </IconButton>
                </Tooltip>

                <RemoveActionButton
                  title={t("common.unassign")}
                  icon={
                    <RemoveBadgeIcon icon={<HomeWorkIcon fontSize="small" />} />
                  }
                  onClick={() => unassignCondo(c.id)}
                  disabled={assignCondos.isPending}
                  sx={{ p: 0.25 }}
                />
              </Stack>
            }
            dateRangeText={dateRange}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 0.5,
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0, pr: 4 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                  sx={{ mb: 0.25 }}
                >
                  {c.name || c.code || `#${c.id}` || "—"}
                </Typography>

                {c.responsibleEmployeeName && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {c.responsibleEmployeeName}
                  </Typography>
                )}
              </Box>

              {(c.condition || c.status) && (
                <Stack direction="row" spacing={0.5}>
                  {c.status && (
                    <Chip size="small" variant="outlined" label={c.status} />
                  )}
                  {c.condition && <Chip size="small" label={c.condition} />}
                </Stack>
              )}
            </Box>
          </BoardItemCard>
        );
      },
    };

    return [employeeColumn, vehiclesColumn, toolsColumn, condosColumn];
  }, [
    employees,
    tools,
    vehicles,
    condos,
    t,
    assignEmp.isPending,
    assignTools.isPending,
    assignVeh.isPending,
    assignCondos.isPending,
    unassignEmployee,
    unassignTool,
    unassignVehicle,
    unassignCondo,
    removeBtnSx,
    setOpenEmp,
    setOpenTools,
    setOpenVeh,
    setOpenCondos,
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
        <StatCardDetail
          icon={<CalendarTodayIcon />}
          label={t("constructionSites.fields.period")}
          value={`${formatDate(data?.startDate)} — ${formatDate(
            data?.plannedEndDate
          )}`}
          caption={`${t("constructionSites.fields.created")}: ${formatDate(
            data?.createdDate
          )}`}
        />
        <StatCardDetail
          icon={<BadgeIcon />}
          label={t("constructionSites.fields.manager")}
          value={data?.siteManagerName || "—"}
          caption={`${t("constructionSites.fields.id")}: ${data?.id ?? "—"}`}
        />
        <StatCardDetail
          icon={<PlaceIcon />}
          label={t("constructionSites.fields.location")}
          value={data?.location || "—"}
          caption={`${t("constructionSites.fields.name")}: ${
            data?.name || "—"
          }`}
        />
        <StatCardDetail
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
      <AssignCondosDialog
        constructionSiteId={siteId}
        open={openCondos}
        onClose={() => setOpenCondos(false)}
      />
      <AssignEmployeesToCondoDialog
        condoId={assignEmpCondoId ?? 0}
        open={openAssignEmployees}
        onClose={() => setAssignEmpCondoId(null)}
      />
    </Stack>
  );
}
