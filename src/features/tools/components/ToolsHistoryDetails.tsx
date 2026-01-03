import { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import BuildIcon from "@mui/icons-material/Build";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useTranslation } from "react-i18next";

import type { ToolHistoryItem } from "..";
import { useToolHistory } from "../hooks/useToolHistory";

import {
  HistoryPanelShell,
  pillSx,
} from "../../../components/ui/history/HistoryPanelShell";
import { HistoryCard } from "../../../components/ui/history/HistoryCard";
import { HistoryAccordionSection } from "../../../components/ui/history/HistoryAccordionSection";

function formatRange(
  from?: string | null,
  to?: string | null,
  ongoingLabel = "(ongoing)"
) {
  const f = from ?? "";
  return to ? `${f} → ${to}` : `${f} → ${ongoingLabel}`;
}

export function ToolHistoryDetails({ toolId }: { toolId: number }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    historyRows,
    total,
    paginationModel,
    setPaginationModel,
    isLoading,
    isFetching,
    error,
  } = useToolHistory(toolId);

  const [accumulated, setAccumulated] = useState<ToolHistoryItem[]>([]);

  useEffect(() => {
    setAccumulated([]);
    setPaginationModel((p) => ({ ...p, page: 0 }));
  }, [toolId]);

  useEffect(() => {
    if (!historyRows) return;

    setAccumulated((prev) => {
      if (paginationModel.page === 0) return historyRows;

      const seen = new Set(
        prev.map(
          (x) =>
            `${x.constructionSiteId}-${x.responsibleEmployeeId}-${
              x.dateFrom ?? x.changedAt ?? ""
            }-${x.dateTo ?? "ongoing"}-${x.action ?? ""}`
        )
      );

      const next = [...prev];
      for (const row of historyRows) {
        const k = `${row.constructionSiteId}-${row.responsibleEmployeeId}-${
          row.dateFrom ?? row.changedAt ?? ""
        }-${row.dateTo ?? "ongoing"}-${row.action ?? ""}`;
        if (!seen.has(k)) next.push(row);
      }
      return next;
    });
  }, [historyRows, paginationModel.page]);

  const canLoadMore = accumulated.length < (total ?? 0);
  const rows = useMemo(() => accumulated ?? [], [accumulated]);

  const isEmpty = !isLoading && !error && (total ?? rows.length) === 0;

  return (
    <HistoryPanelShell
      title={t("history.tool.title")}
      headerChips={
        <Chip
          size="small"
          icon={<BuildIcon sx={{ fontSize: 14 }} />}
          label={`${t("history.common.toolId")}: ${toolId}`}
          sx={{ ...pillSx, bgcolor: alpha(theme.palette.primary.main, 0.04) }}
        />
      }
    >
      <HistoryAccordionSection
        defaultExpanded
        icon={<AssignmentIcon sx={{ fontSize: 18 }} />}
        label={t("history.tool.assignments")}
        count={total ?? rows.length}
        isLoading={isLoading && paginationModel.page === 0}
        isError={!!error}
        errorText={t("history.common.loadError")}
        emptyText={t("history.tool.emptyAssignments")}
      >
        <Stack spacing={1}>
          {rows.map((it, idx) => {
            const from = it.dateFrom ?? it.changedAt ?? "";
            const title =
              it.constructionSiteName ??
              `${t("common.columns.constructionSiteName")} #${
                it.constructionSiteId
              }`;

            return (
              <HistoryCard
                key={`${it.constructionSiteId}-${
                  it.responsibleEmployeeId
                }-${from}-${it.dateTo ?? "ongoing"}-${it.action ?? ""}-${idx}`}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {title}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" noWrap>
                    {it.constructionSiteLocation ?? "—"}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 0.5 }}
                    alignItems="center"
                  >
                    <Chip
                      size="small"
                      label={formatRange(
                        from,
                        it.dateTo,
                        t("history.common.ongoing")
                      )}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.info.main, 0.06),
                      }}
                    />

                    {it.action ? (
                      <Chip
                        size="small"
                        label={it.action}
                        sx={{
                          ...pillSx,
                          bgcolor: alpha(theme.palette.secondary.main, 0.06),
                        }}
                      />
                    ) : null}

                    {it.responsibleEmployeeName ? (
                      <Chip
                        size="small"
                        label={it.responsibleEmployeeName}
                        sx={{
                          ...pillSx,
                          bgcolor: alpha(theme.palette.success.main, 0.06),
                        }}
                      />
                    ) : null}
                  </Stack>
                </Box>
              </HistoryCard>
            );
          })}

          <Box sx={{ pt: 0.5 }}>
            <Button
              size="small"
              variant="text"
              disabled={!canLoadMore || isFetching}
              onClick={() =>
                setPaginationModel((p) => ({ ...p, page: p.page + 1 }))
              }
            >
              {isFetching
                ? t("history.common.loading")
                : t("history.common.loadMore")}
            </Button>
          </Box>

          {isEmpty ? null : null}
        </Stack>
      </HistoryAccordionSection>
    </HistoryPanelShell>
  );
}
