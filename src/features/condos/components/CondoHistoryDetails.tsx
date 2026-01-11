import { Box, Chip, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ApartmentIcon from "@mui/icons-material/Apartment";
import GroupIcon from "@mui/icons-material/Group";
import BuildIcon from "@mui/icons-material/Build";
import { useTranslation } from "react-i18next";

import {
  HistoryPanelShell,
  pillSx,
} from "../../../components/ui/history/HistoryPanelShell";
import { HistoryAccordionSection } from "../../../components/ui/history/HistoryAccordionSection";
import { HistoryCard } from "../../../components/ui/history/HistoryCard";
import { useCondo } from "../hooks/useCondo";
import type { CondoDetails } from "..";
import { formatRangeWithOngoingLabel } from "../../../utils/dateFormatters";

export function CondoHistoryDetails({ condoId }: { condoId: number }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const condoQuery = useCondo(condoId);

  const condo = condoQuery.data as CondoDetails | undefined;
  const employees = condo?.employees ?? [];
  const sites = condo?.constructionSites ?? [];

  return (
    <HistoryPanelShell
      title={t("history.condo.title")}
      headerChips={
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap" }}>
          <Chip
            size="small"
            icon={<ApartmentIcon sx={{ fontSize: 14 }} />}
            label={`${t("history.common.condoId")}: ${condoId}`}
            sx={{ ...pillSx, bgcolor: alpha(theme.palette.primary.main, 0.04) }}
          />
          {condo?.address ? (
            <Chip
              size="small"
              label={condo.address}
              sx={{ ...pillSx, bgcolor: alpha(theme.palette.info.main, 0.06) }}
            />
          ) : null}
          {condo?.responsibleEmployeeName ? (
            <Chip
              size="small"
              label={condo.responsibleEmployeeName}
              sx={{
                ...pillSx,
                bgcolor: alpha(theme.palette.success.main, 0.06),
              }}
            />
          ) : null}
        </Stack>
      }
    >
      <HistoryAccordionSection
        defaultExpanded
        icon={<GroupIcon sx={{ fontSize: 18 }} />}
        label={t("history.condo.employees")}
        count={employees.length}
        isLoading={condoQuery.isLoading}
        isError={!!condoQuery.error}
        errorText={t("history.common.loadError")}
        emptyText={t("history.condo.emptyEmployees")}
      >
        <Stack spacing={1}>
          {employees.map((e) => {
            const fullName = [e.firstName, e.lastName]
              .filter(Boolean)
              .join(" ");
            return (
              <HistoryCard
                key={`${e.id}-${e.dateFrom ?? ""}-${e.dateTo ?? ""}`}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {fullName || `${t("common.employee")} #${e.id}`}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" noWrap>
                    {e.jobPositionName ?? "—"}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 0.5 }}
                    alignItems="center"
                  >
                    <Chip
                      size="small"
                      label={formatRangeWithOngoingLabel(
                        e.dateFrom,
                        e.dateTo,
                        t("history.common.ongoing")
                      )}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.info.main, 0.06),
                      }}
                    />
                  </Stack>
                </Box>
              </HistoryCard>
            );
          })}
        </Stack>
      </HistoryAccordionSection>

      <HistoryAccordionSection
        icon={<BuildIcon sx={{ fontSize: 18 }} />}
        label={t("history.condo.constructionSites")}
        count={sites.length}
        isLoading={condoQuery.isLoading}
        isError={!!condoQuery.error}
        errorText={t("history.common.loadError")}
        emptyText={t("history.condo.emptyConstructionSites")}
      >
        <Stack spacing={1}>
          {sites.map((s) => (
            <HistoryCard key={String(s.id)}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {s.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {s.location ?? "—"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 0.5 }}
                  alignItems="center"
                >
                  <Chip
                    size="small"
                    label={formatRangeWithOngoingLabel(
                      s.startDate,
                      s.plannedEndDate,
                      t("history.common.ongoing")
                    )}
                    sx={{
                      ...pillSx,
                      bgcolor: alpha(theme.palette.info.main, 0.06),
                    }}
                  />
                </Stack>
              </Box>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>
    </HistoryPanelShell>
  );
}
