import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PlaceIcon from "@mui/icons-material/Place";
import BadgeIcon from "@mui/icons-material/Badge";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConstructionSite } from "../hooks/useConstructionSite";
import StatCard from "./StatCard";
import { formatDate } from "../utils/dates";
import EmployeesSection from "../sections/EmployeesSection";
import ToolsSection from "../sections/ToolsSection";
import VehiclesSection from "../sections/VehiclesSection";
import { useState } from "react";
import AssignEmployeesDialog from "./AssignEmployeesDialog";
import AssignToolsDialog from "./AssignToolsDialog";
import AssignVehiclesDialog from "./AssignVehiclesDialog";

export default function ConstructionSiteDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const siteId = Number(id);
  if (!Number.isFinite(siteId))
    return <div>{t("constructionSites.edit.invalidUrlId")}</div>;
  const { data } = useConstructionSite(siteId);
  console.log(data);

  const [openEmp, setOpenEmp] = useState(false);
  const [openTools, setOpenTools] = useState(false);
  const [openVeh, setOpenVeh] = useState(false);
  return (
    <Stack spacing={2} sx={{ width: "100%", minWidth: 0 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("constructionSites.detail.title", {
            defaultValue: "Pregled gradilišta",
          })}
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
          label={t("constructionSites.fields.period", {
            defaultValue: "Razdoblje",
          })}
          value={`${formatDate(data?.startDate)} — ${formatDate(
            data?.plannedEndDate
          )}`}
          caption={`${t("constructionSites.fields.created", {
            defaultValue: "Kreirano",
          })}: ${formatDate(data?.createdDate)}`}
        />
        <StatCard
          icon={<BadgeIcon />}
          label={t("constructionSites.fields.manager", {
            defaultValue: "Voditelj gradilišta",
          })}
          value={data?.siteManagerName || "—"}
          caption={`${t("constructionSites.fields.id", {
            defaultValue: "ID",
          })}: ${data?.id ?? "—"}`}
        />
        <StatCard
          icon={<PlaceIcon />}
          label={t("constructionSites.fields.location", {
            defaultValue: "Lokacija",
          })}
          value={data?.location || "—"}
          caption={`${t("constructionSites.fields.name", {
            defaultValue: "Naziv",
          })}: ${data?.name || "—"}`}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mt: 2,
          width: "100%",
        }}
      >
        <EmployeesSection
          employees={data?.constructionSiteEmployees}
          onAdd={() => setOpenEmp(true)}
        />
        <ToolsSection
          tools={data?.constructionSiteTools}
          onAdd={() => setOpenTools(true)}
        />
      </Box>

      <VehiclesSection
        vehicles={data?.constructionSiteVehicles}
        onAdd={() => setOpenVeh(true)}
      />
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
