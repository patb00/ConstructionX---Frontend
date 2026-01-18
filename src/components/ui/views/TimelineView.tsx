import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  Avatar,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useMemo, useState } from "react";

import {
  addDays,
  makeHeaderFormatter,
  makeTooltipFormatter,
  safeFormatISO,
  formatLocalIsoDate,
} from "../../../utils/dateFormatters";
import { getIntlLocale } from "../../../utils/u18nLocale";
import {
  clampDate,
  dayIndex,
  daysDiffInclusive,
  normalizeDate,
  overlapsRange,
} from "../../../utils/timelineView";

export type Lane = {
  id: string;
  title: string;
  initials?: string;
};

export type TimelineItem = {
  id: string;
  laneId: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate: string;
  color: string;

  assigneeName?: string;
  assigneeInitials?: string;

  meta?: {
    type?: string;
    laneLabel?: string;

    constructionSiteId?: number;
    employeeId?: number;
  };
};

type TimelineBoardProps = {
  lanes: Lane[];
  items: TimelineItem[];
  startDate: string;
  endDate: string;
  onItemClick?: (args: { item: TimelineItem; dayIso: string }) => void;
};

type Segment = {
  segmentId: string;
  baseId: string;
  laneId: string;
  title: string;
  subtitle?: string;
  dayIdx: number;
  color: string;
  meta?: TimelineItem["meta"];
  originalStart: string;
  originalEnd: string;
  rowIndex: number;
  isFirst: boolean;
  isLast: boolean;
};

export const TimelineView: React.FC<TimelineBoardProps> = ({
  lanes,
  items,
  startDate,
  endDate,
  onItemClick,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { t, i18n } = useTranslation();

  const locale = useMemo(
    () => getIntlLocale(i18n),
    [i18n.language, i18n.resolvedLanguage]
  );

  const headerFmt = useMemo(() => makeHeaderFormatter(locale), [locale]);
  const tooltipFmt = useMemo(() => makeTooltipFormatter(locale), [locale]);

  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  const totalDays = useMemo(() => daysDiffInclusive(start, end), [start, end]);
  const totalCols = totalDays;

  const labelColWidth = 220;
  const dayMinWidth = 44;

  const barHeight = isSmall ? 64 : 56;
  const rowGap = 6;
  const rowHeight = barHeight + rowGap;

  const baseTopOffset = 4;

  const [expandedLanes, setExpandedLanes] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    setExpandedLanes((prev) => {
      const next = { ...prev };
      lanes.forEach((lane) => {
        if (next[lane.id] === undefined) next[lane.id] = true;
      });
      return next;
    });
  }, [lanes]);

  const toggleLane = (laneId: string) => {
    setExpandedLanes((prev) => ({ ...prev, [laneId]: !prev[laneId] }));
  };

  const colWidthPercent = 100 / totalCols;

  const dayHeaders = useMemo(() => {
    const result: { date: Date; label: string; isWeekend: boolean }[] = [];
    for (let i = 0; i < totalDays; i++) {
      const d = addDays(start, i);
      const day = d.getDay();
      const isWeekend = day === 0 || day === 6;

      const label = headerFmt.format(d);

      result.push({ date: d, label, isWeekend });
    }
    return result;
  }, [start, totalDays, headerFmt]);

  const legend = useMemo(() => {
    const map = new Map<string, { label: string; color: string }>();
    items.forEach((it) => {
      const label =
        it.meta?.laneLabel || it.meta?.type || t("assignments.timeline.item");
      const key = `${label}__${it.color}`;
      if (!map.has(key)) map.set(key, { label, color: it.color });
    });
    return Array.from(map.values());
  }, [items, t]);

  const laneSegments = useMemo(() => {
    const byLane = new Map<string, Segment[]>();
    lanes.forEach((lane) => byLane.set(lane.id, []));

    const rowIndexByLane = new Map<string, Map<string, number>>();

    const getRowIndex = (laneId: string, baseId: string) => {
      let m = rowIndexByLane.get(laneId);
      if (!m) {
        m = new Map();
        rowIndexByLane.set(laneId, m);
      }
      if (!m.has(baseId)) m.set(baseId, m.size);
      return m.get(baseId)!;
    };

    items.forEach((it) => {
      const rawS = normalizeDate(it.startDate);
      const rawE = normalizeDate(it.endDate);

      if (!overlapsRange(rawS, rawE, start, end)) return;

      const s = clampDate(rawS, start, end);
      const e = clampDate(rawE, start, end);

      const startIdx = Math.max(0, dayIndex(start, s));
      const endIdx = Math.min(totalDays - 1, dayIndex(start, e));

      const rowIndex = getRowIndex(it.laneId, it.id);

      for (let d = startIdx; d <= endIdx; d++) {
        const seg: Segment = {
          segmentId: `${it.id}__d${d}`,
          baseId: it.id,
          laneId: it.laneId,
          title: it.title,
          subtitle: it.subtitle,
          dayIdx: d,
          color: it.color,
          meta: it.meta,
          originalStart: it.startDate,
          originalEnd: it.endDate,
          rowIndex,
          isFirst: d === startIdx,
          isLast: d === endIdx,
        };

        if (!byLane.has(it.laneId)) byLane.set(it.laneId, []);
        byLane.get(it.laneId)!.push(seg);
      }
    });

    byLane.forEach((arr) => {
      arr.sort((a, b) => a.rowIndex - b.rowIndex || a.dayIdx - b.dayIdx);
    });

    return byLane;
  }, [items, lanes, start, end, totalDays]);

  return (
    <Card sx={{ p: 2, overflowX: "auto", position: "relative" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${labelColWidth}px repeat(${totalCols}, minmax(${dayMinWidth}px, 1fr))`,
          alignItems: "center",
        }}
      >
        <Box />
        {dayHeaders.map((d, idx) => (
          <Box
            key={idx}
            sx={{
              textAlign: "center",
              py: 0.5,
              borderBottom: (t) => `1px solid ${t.palette.divider}`,
              bgcolor: d.isWeekend
                ? alpha(theme.palette.primary.light, 0.08)
                : "transparent",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {d.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${labelColWidth}px repeat(${totalCols}, minmax(${dayMinWidth}px, 1fr))`,
        }}
      >
        {lanes.map((lane) => {
          const isExpanded = expandedLanes[lane.id] ?? true;
          const segs = laneSegments.get(lane.id) ?? [];

          const rowCount = segs.length
            ? Math.max(...segs.map((s) => s.rowIndex)) + 1
            : 1;

          const expandedHeight = baseTopOffset + rowCount * rowHeight;

          return (
            <Fragment key={lane.id}>
              <Box
                sx={{
                  py: 0.75,
                  pr: 1,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none",
                  gap: 1,
                }}
                onClick={() => toggleLane(lane.id)}
              >
                <ExpandMoreIcon
                  fontSize="small"
                  sx={{
                    transition: "transform 0.2s ease",
                    transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                    color: "#6D6D6D",
                  }}
                />

                {lane.initials && (
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: 12,
                      bgcolor: alpha(theme.palette.grey[700], 0.08),
                      color: theme.palette.text.primary,
                      border: `1px solid ${alpha(
                        theme.palette.grey[700],
                        0.15
                      )}`,
                    }}
                  >
                    {lane.initials}
                  </Avatar>
                )}

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#6D6D6D",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {lane.title}
                </Typography>
              </Box>

              <Box
                sx={{
                  position: "relative",
                  gridColumn: `2 / span ${totalCols}`,
                  minHeight: isExpanded ? expandedHeight : rowHeight,
                  transition: "min-height 0.25s ease",
                  borderBottom: (t) => `1px solid ${t.palette.divider}`,

                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage: dayHeaders
                      .map((d, idx) => {
                        if (!d.isWeekend) return null;
                        const left = idx * colWidthPercent;
                        const right = (idx + 1) * colWidthPercent;
                        return `linear-gradient(to right,
                        transparent 0%,
                        transparent ${left}%,
                        ${alpha(theme.palette.primary.light, 0.08)} ${left}%,
                        ${alpha(theme.palette.primary.light, 0.08)} ${right}%,
                        transparent ${right}%,
                        transparent 100%)`;
                      })
                      .filter(Boolean)
                      .join(", "),
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    pointerEvents: "none",
                    zIndex: 0,
                  },
                }}
              >
                {segs.map((seg) => {
                  const dayGapPx = 5;
                  const leftPct = seg.dayIdx * colWidthPercent;

                  const left = `calc(${leftPct}% + ${dayGapPx / 2}px)`;
                  const width = `calc(${colWidthPercent}% - ${dayGapPx}px)`;

                  const top = baseTopOffset + seg.rowIndex * rowHeight;

                  const bg = alpha(seg.color, 0.22);
                  const border = alpha(seg.color, 0.85);

                  const tooltipContent = (
                    <Box sx={{ p: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, display: "block", mb: 0.25 }}
                      >
                        {seg.title}
                      </Typography>

                      {seg.subtitle && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mb: 0.25,
                            color: "text.secondary",
                          }}
                        >
                          {seg.subtitle}
                        </Typography>
                      )}

                      {seg.meta?.laneLabel && (
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mb: 0.25 }}
                        >
                          <strong>
                            {t("assignments.timeline.tooltip.type", "Type")}:
                          </strong>{" "}
                          {seg.meta.laneLabel}
                        </Typography>
                      )}

                      <Typography variant="caption" sx={{ display: "block" }}>
                        <strong>
                          {t("assignments.timeline.tooltip.from", "From")}:
                        </strong>{" "}
                        {safeFormatISO(seg.originalStart, tooltipFmt)}
                      </Typography>

                      <Typography variant="caption" sx={{ display: "block" }}>
                        <strong>
                          {t("assignments.timeline.tooltip.to", "To")}:
                        </strong>{" "}
                        {safeFormatISO(seg.originalEnd, tooltipFmt)}
                      </Typography>
                    </Box>
                  );

                  return (
                    <Tooltip
                      key={seg.segmentId}
                      title={tooltipContent}
                      arrow
                      placement="top"
                      enterDelay={150}
                    >
                      <Box
                        onClick={() => {
                          if (!onItemClick) return;

                          const originalItem = items.find(
                            (x) => x.id === seg.baseId
                          );
                          if (!originalItem) return;

                          const clickedDay = addDays(start, seg.dayIdx);
                          const dayIso = formatLocalIsoDate(clickedDay);

                          onItemClick({ item: originalItem, dayIso });
                        }}
                        sx={{
                          position: "absolute",
                          zIndex: 1,
                          left,
                          width,
                          top,
                          height: barHeight,

                          borderTopLeftRadius: seg.isFirst ? 3 : 2,
                          borderBottomLeftRadius: seg.isFirst ? 3 : 2,
                          borderTopRightRadius: seg.isLast ? 3 : 2,
                          borderBottomRightRadius: seg.isLast ? 3 : 2,

                          bgcolor: bg,
                          border: `1px solid ${border}`,
                          display: "flex",
                          alignItems: "center",
                          px: 1.25,
                          py: 0.25,
                          overflow: "hidden",
                          cursor: "pointer",
                          opacity: isExpanded ? 1 : 0,
                          pointerEvents: isExpanded ? "auto" : "none",
                          boxShadow:
                            "0 1px 2px rgba(15,23,42,0.10), 0 0 0 1px rgba(15,23,42,0.03)",
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              color: theme.palette.text.primary,
                              fontWeight: 700,
                              lineHeight: 1.1,
                              display: "block",
                            }}
                          >
                            {seg.title}
                          </Typography>

                          {seg.subtitle && (
                            <Typography
                              variant="caption"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: theme.palette.text.secondary,
                                lineHeight: 1.1,
                                display: "block",
                              }}
                            >
                              {seg.subtitle}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            </Fragment>
          );
        })}
      </Box>

      {legend.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {legend.map((l) => (
            <Box
              key={`${l.label}__${l.color}`}
              sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  bgcolor: l.color,
                  boxShadow: `0 0 0 2px ${alpha(l.color, 0.25)}`,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {l.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
};
