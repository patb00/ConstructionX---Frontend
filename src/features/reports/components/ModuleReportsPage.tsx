import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  Divider,
  Drawer,
  IconButton,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

import {
  getReportsByModuleId,
  type ReportDefinition,
} from "../config/reports.config";
import type { ModuleId } from "../../../app/routes/navigation";
import { getNavItemByModuleId } from "../../../utils/navigationUtils";

import { languageToCulture } from "../utils/culture";
import { openReport } from "../utils/openReport";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { DateRange } from "@mui/x-date-pickers-pro/models";

import { formatLocalIsoDate } from "../../../utils/dateFormatters";
import { useConstructionSiteManagerOptions } from "../../constants/options/useConstructionSiteManagerOptions";
import { useConstructionSiteStatusOptions } from "../../constants/enum/useConstructionSiteStatusOptions";
import SmartForm, {
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

const STATUS_KEY_BY_VALUE: Record<number, string> = {
  1: "Planned",
  2: "InProgress",
  3: "OnHold",
  4: "Completed",
  5: "Cancelled",
};

type ConstructionReportFilters = {
  period: DateRange<Date>;
  siteManagerId: number | "";
  status: number | "";
};

const ModuleReportsPage = () => {
  const { moduleId } = useParams<{ moduleId: ModuleId }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const navItem = useMemo(
    () => (moduleId ? getNavItemByModuleId(moduleId) : undefined),
    [moduleId],
  );

  const culture = useMemo(
    () => languageToCulture(i18n.language),
    [i18n.language],
  );

  const [openingReportId, setOpeningReportId] = useState<string | null>(null);

  const [siteListRange, setSiteListRange] = useState<DateRange<Date>>([
    null,
    null,
  ]);
  const [totalHoursRange, setTotalHoursRange] = useState<DateRange<Date>>([
    null,
    null,
  ]);

  const [siteManagerId, setSiteManagerId] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [activeConstructionReportId, setActiveConstructionReportId] = useState<
    string | null
  >(null);

  const { options: managerOptions, isLoading: managersLoading } =
    useConstructionSiteManagerOptions();

  const statusOptions = useConstructionSiteStatusOptions();

  const reports: ReportDefinition[] = moduleId
    ? getReportsByModuleId(moduleId)
    : [];

  const isConstructionSiteListReportId = (id: string) =>
    id === "construction-site-list";

  const isConstructionTotalHoursReportId = (id: string) =>
    id === "construction-site-total-hours";

  const isAnyConstructionReportId = (id: string) =>
    isConstructionSiteListReportId(id) || isConstructionTotalHoursReportId(id);

  const selectedManagerLabel = useMemo(() => {
    if (siteManagerId == null)
      return t("constructionSites.form.status.all", "All");
    const found = managerOptions.find((o) => o.value === siteManagerId);
    return found?.label ?? t("common.notAvailable", "—");
  }, [siteManagerId, managerOptions, t]);

  const selectedStatusLabel = useMemo(() => {
    if (status == null) return t("constructionSites.form.status.all", "All");
    const found = statusOptions.find((o) => o.value === status);
    return found?.label ?? t("common.notAvailable", "—");
  }, [status, statusOptions, t]);

  const getRangeForReport = (reportId: string): DateRange<Date> => {
    if (isConstructionSiteListReportId(reportId)) return siteListRange;
    if (isConstructionTotalHoursReportId(reportId)) return totalHoursRange;
    return [null, null];
  };

  const formatRangeLabel = (range: DateRange<Date>) => {
    const isEmpty = !range[0] && !range[1];
    if (isEmpty) return t("constructionSites.form.period.all", "All");

    const start = range[0] ? formatLocalIsoDate(range[0]) : "";
    const end = range[1] ? formatLocalIsoDate(range[1]) : "";
    return `${start} → ${end}`;
  };

  const handleReportClick = async (reportId: string) => {
    setOpeningReportId(reportId);

    try {
      if (isConstructionSiteListReportId(reportId)) {
        const range = siteListRange;
        const start = range[0];
        const end = range[1];
        const statusValue =
          status != null ? STATUS_KEY_BY_VALUE[status] : undefined;

        await openReport(reportId as any, {
          culture,
          params: {
            startDate: start ? formatLocalIsoDate(start) : undefined,
            plannedEndDate: end ? formatLocalIsoDate(end) : undefined,
            siteManagerId,
            status: statusValue,
          },
        });

        return;
      }

      if (isConstructionTotalHoursReportId(reportId)) {
        const range = totalHoursRange;
        const from = range[0];
        const to = range[1];

        await openReport(reportId as any, {
          culture,
          params: {
            dateFrom: from ? formatLocalIsoDate(from) : undefined,
            dateTo: to ? formatLocalIsoDate(to) : undefined,
          },
        });

        return;
      }

      await openReport(reportId as any, { culture });
    } catch (error) {
      console.error("Greška pri otvaranju izvještaja", error);
      alert("Greška pri otvaranju izvještaja.");
    } finally {
      setOpeningReportId(null);
    }
  };

  const filterDefaults = useMemo<Partial<ConstructionReportFilters>>(() => {
    const range =
      activeConstructionReportId === "construction-site-total-hours"
        ? totalHoursRange
        : siteListRange;

    return {
      period: range,
      siteManagerId: siteManagerId ?? "",
      status: status ?? "",
    };
  }, [
    activeConstructionReportId,
    siteListRange,
    totalHoursRange,
    siteManagerId,
    status,
  ]);

  const filterFields = useMemo<FieldConfig<ConstructionReportFilters>[]>(() => {
    const fields: FieldConfig<ConstructionReportFilters>[] = [
      {
        name: "period",
        label: t("constructionSites.fields.period", "Period"),
        type: "date-range" as any,
        props: {},
      },
    ];

    if (activeConstructionReportId === "construction-site-list") {
      fields.push(
        {
          name: "siteManagerId",
          label: t("constructionSites.form.manager.label", "Site manager"),
          type: "select",
          options: managerOptions.map((m) => ({
            label: m.label,
            value: m.value ?? "",
          })),
          props: {
            disabled: managersLoading,
          },
        },
        {
          name: "status",
          label: t("constructionSites.form.status.label", "Status"),
          type: "select",
          options: [
            { label: t("constructionSites.form.status.all", "All"), value: "" },
            ...statusOptions.map((s) => ({ label: s.label, value: s.value })),
          ],
        },
      );
    }

    return fields;
  }, [
    t,
    activeConstructionReportId,
    managerOptions,
    managersLoading,
    statusOptions,
  ]);

  if (!moduleId || !navItem) {
    return (
      <Stack spacing={2} sx={{ width: "100%", minWidth: 0 }}>
        <Typography variant="h6" fontWeight={600}>
          {t("reports.module.notFoundTitle")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/izvjestaji")}
          sx={{ alignSelf: "flex-start", color: "primary.main" }}
        >
          {t("reports.module.back")}
        </Button>
      </Stack>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2} sx={{ width: "100%", minWidth: 0 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
                fontSize: 20,
              }}
            >
              {navItem.icon}
            </Box>

            <Typography variant="h5" fontWeight={600}>
              {t(navItem.labelKey)}
            </Typography>
          </Stack>

          <Button
            size="small"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/app/izvjestaji")}
            sx={{ color: "primary.main" }}
          >
            {t("reports.module.back")}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {t("reports.module.description")}
        </Typography>

        {reports.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("reports.module.noReports")}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            {reports.map((report) => {
              const isOpening = openingReportId === report.id;
              const isConstruction = isAnyConstructionReportId(report.id);

              const thisRange = getRangeForReport(report.id);
              const dateChipLabel = formatRangeLabel(thisRange);

              return (
                <Box key={report.id} sx={{ width: "100%" }}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 1.5,
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            color="text.primary"
                            noWrap
                          >
                            {t(report.labelKey)}
                          </Typography>

                          {report.descriptionKey && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {t(report.descriptionKey)}
                            </Typography>
                          )}

                          {isConstruction && (
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ mt: 1, flexWrap: "wrap" }}
                            >
                              <Chip
                                size="small"
                                label={`${t("constructionSites.fields.period", "Period")}: ${dateChipLabel}`}
                              />

                              {isConstructionSiteListReportId(report.id) && (
                                <>
                                  <Chip
                                    size="small"
                                    label={`${t("constructionSites.form.manager.label", "Site manager")}: ${selectedManagerLabel}`}
                                  />
                                  <Chip
                                    size="small"
                                    label={`${t("constructionSites.form.status.label", "Status")}: ${selectedStatusLabel}`}
                                  />
                                </>
                              )}
                            </Stack>
                          )}
                        </Box>

                        {isConstruction && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            onClick={() => {
                              setActiveConstructionReportId(report.id);
                              setFiltersOpen(true);
                            }}
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {t("common.filter", "Filters")}
                          </Button>
                        )}
                      </Box>

                      <Divider />

                      <Box display="flex" gap={1} alignItems="center">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleReportClick(report.id)}
                          sx={{ mt: 0.5 }}
                          disabled={isOpening}
                        >
                          {isOpening
                            ? t("reports.module.opening")
                            : t("reports.module.open")}
                        </Button>
                      </Box>
                    </Stack>
                  </Card>
                </Box>
              );
            })}
          </Box>
        )}

        <Drawer
          anchor="right"
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          PaperProps={{ sx: { width: 380 } }}
        >
          <Box
            sx={{
              px: 2,
              pt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {t("common.filter", "Filters")}
            </Typography>

            <IconButton onClick={() => setFiltersOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <SmartForm<ConstructionReportFilters>
            fields={filterFields}
            rows={
              activeConstructionReportId === "construction-site-list"
                ? [["period"], ["siteManagerId"], ["status"]]
                : [["period"]]
            }
            defaultValues={filterDefaults}
            submitLabel={t("common.done", "Done")}
            onSubmit={(vals) => {
              const nextRange = vals.period ?? [null, null];

              if (
                activeConstructionReportId === "construction-site-total-hours"
              ) {
                setTotalHoursRange(nextRange);
              } else {
                setSiteListRange(nextRange);
              }

              if (activeConstructionReportId === "construction-site-list") {
                setSiteManagerId(
                  vals.siteManagerId === "" ? null : Number(vals.siteManagerId),
                );
                setStatus(vals.status === "" ? null : Number(vals.status));
              }

              setFiltersOpen(false);
            }}
            formProps={{
              p: 2,
            }}
          />
        </Drawer>
      </Stack>
    </LocalizationProvider>
  );
};

export default ModuleReportsPage;
