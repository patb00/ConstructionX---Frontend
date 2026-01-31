import { useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  Chip,
  alpha,
  useTheme,
  LinearProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupsIcon from "@mui/icons-material/Groups";
import ConstructionIcon from "@mui/icons-material/Construction";

import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useCondo } from "../hooks/useCondo";

function formatDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

function formatMoney(amount?: number | null, currency?: string | null) {
  if (amount == null) return "";
  const c = (currency ?? "").toUpperCase();
  return c ? `${amount.toFixed(2)} ${c}` : `${amount.toFixed(2)}`;
}

export default function CondoDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();

  const condoId = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) ? n : 0;
  }, [id]);

  const query = useCondo(condoId);

  const condo = query.data;

  if (!condoId) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Typography color="text.secondary">
          {t("common.invalidId") || "Invalid ID"}
        </Typography>
      </Box>
    );
  }

  if (query.isLoading) {
    return (
      <Box p={10} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (query.isError || !condo) {
    return (
      <Box p={4} display="flex" flexDirection="column" alignItems="center">
        <Typography color="error" gutterBottom>
          {t("common.errorLoading") || "Error loading data"}
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          {t("common.back")}
        </Button>
      </Box>
    );
  }

  // Calculate occupancy percentage
  const occupancyPercent =
    condo.capacity > 0
      ? Math.min(100, Math.round((condo.currentlyOccupied / condo.capacity) * 100))
      : 0;
  
  const occupancyColor = occupancyPercent >= 100 ? "error" : occupancyPercent >= 80 ? "warning" : "success";

  return (
    <Stack spacing={3} sx={{ pb: 4, height: "100%", overflowY: "auto" }}>
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h4" fontWeight={700}>
               {t("condos.detail.title")}
            </Typography>
            <Chip
              label={`#${condo.id}`}
              size="small"
              sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main" }}
            />
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {condo.address}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
             <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/app/condos")}
            >
              {t("common.back")}
            </Button>
        </Stack>
      </Stack>

      {/* OVERVIEW ROW */}
      <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
         <Stack direction={{ xs: "column", md: "row" }} spacing={3} divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />}>
             {/* Occupancy */}
             <Box sx={{ flex: 1.5 }}>
                <Stack spacing={1}>
                     <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                        <GroupsIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={600} textTransform="uppercase">
                            {t("condos.detail.occupancy")}
                        </Typography>
                     </Stack>
                     <Stack direction="row" alignItems="flex-end" spacing={1}>
                        <Typography variant="h4" fontWeight={700}>
                            {condo.currentlyOccupied}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>
                            / {condo.capacity}
                        </Typography>
                     </Stack>
                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress variant="determinate" value={occupancyPercent} color={occupancyColor} sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">{`${occupancyPercent}%`}</Typography>
                        </Box>
                     </Box>
                </Stack>
             </Box>
             
             {/* Dates */}
             <Box sx={{ flex: 1 }}>
                <Stack spacing={2}>
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary" mb={0.5}>
                            <CalendarTodayIcon fontSize="small" />
                            <Typography variant="caption" fontWeight={600} textTransform="uppercase">{t("condos.detail.leaseStart")}</Typography>
                        </Stack>
                        <Typography variant="body1" fontWeight={500}>
                            {formatDate(condo.leaseStartDate)}
                        </Typography>
                    </Box>
                     <Box>
                        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary" mb={0.5}>
                            <CalendarTodayIcon fontSize="small" />
                            <Typography variant="caption" fontWeight={600} textTransform="uppercase">{t("condos.detail.leaseEnd")}</Typography>
                        </Stack>
                        <Typography variant="body1" fontWeight={500}>
                            {formatDate(condo.leaseEndDate)}
                        </Typography>
                    </Box>
                </Stack>
             </Box>

             {/* Responsible Person */}
             <Box sx={{ flex: 1.5 }}>
                 <Stack spacing={1} height="100%" justifyContent="center">
                    <Stack direction="row" alignItems="center" spacing={1} color="text.secondary" mb={1}>
                            <PersonIcon fontSize="small" />
                            <Typography variant="caption" fontWeight={600} textTransform="uppercase">
                                {t("condos.detail.responsiblePerson")}
                            </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                             display="flex"
                             alignItems="center"
                             justifyContent="center"
                             sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: alpha(theme.palette.info.main, 0.1), color: "info.main" }}
                           >
                                <PersonIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                {/* @ts-ignore */}
                                {condo.responsibleEmployeeName || "—"}
                            </Typography>
                            {/* @ts-ignore */}
                            {condo.responsibleEmployeeJobPosition && (
                                <Typography variant="body2" color="text.secondary">
                                    {/* @ts-ignore */}
                                    {condo.responsibleEmployeeJobPosition}
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                 </Stack>
             </Box>
         </Stack>
      </Paper>

      {/* FINANCIALS & DETAILS ROW */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="stretch">
        
        {/* FINANCIALS CARD */}
        <Box sx={{ width: { xs: "100%", md: 350 }, flexShrink: 0 }}>
             <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, height: "100%" }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                    {t("condos.detail.financials")}
                </Typography>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                            {t("condos.detail.pricePerDay")}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AttachMoneyIcon color="action" />
                            <Typography variant="h5" fontWeight={700}>
                                {formatMoney(condo.pricePerDay, condo.currency)}
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider />
                     <Box>
                        <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                            {t("condos.detail.pricePerMonth")}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AttachMoneyIcon color="action" />
                            <Typography variant="h5" fontWeight={700}>
                                {formatMoney(condo.pricePerMonth, condo.currency)}
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
             </Paper>
        </Box>

        {/* ASSOCIATIONS */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
             <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, height: "100%" }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                    <Box flex={1}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <GroupsIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>
                                {t("condos.detail.assignedEmployees")}
                            </Typography>
                        </Stack>
                        {/* @ts-ignore */}
                        {condo.employees && condo.employees.length > 0 ? (
                            <Stack spacing={1}>
                                {/* @ts-ignore */}
                                {condo.employees.map((emp: any) => (
                                    <Stack key={emp.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1, bgcolor: "action.hover", borderRadius: 1 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <PersonIcon fontSize="small" color="action" />
                                            <Typography variant="body2" fontWeight={500}>
                                                {emp.firstName} {emp.lastName}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        ) : (
                             <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                {t("condos.detail.noEmployees")}
                            </Typography>
                        )}
                    </Box>

                    {/* Divider for mobile/desktop */}
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />
                    <Divider flexItem sx={{ display: { xs: "block", md: "none" } }} />

                    <Box flex={1}>
                         <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <ConstructionIcon color="warning" />
                            <Typography variant="h6" fontWeight={600}>
                                {t("condos.detail.constructionSites")}
                            </Typography>
                        </Stack>
                         {/* @ts-ignore */}
                        {condo.constructionSites && condo.constructionSites.length > 0 ? (
                            <Stack spacing={1}>
                                {/* @ts-ignore */}
                                {condo.constructionSites.map((site: any) => (
                                    <Stack key={site.id} sx={{ p: 1, bgcolor: "action.hover", borderRadius: 1 }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {site.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {site.location}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        ) : (
                             <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                {t("condos.detail.noSites")}
                            </Typography>
                        )}
                    </Box>
                </Stack>
             </Paper>
        </Box>
      </Stack>

      {/* NOTE CARD */}
      <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <DescriptionIcon color="action" />
                <Typography variant="h6" fontWeight={600}>
                    {t("condos.form.field.notes")}
                </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                {condo.notes || t("common.dash")}
            </Typography>
      </Paper>
    </Stack>
  );
}
