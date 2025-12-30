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

export type Lane = {
  id: string;
  title: string;
  initials?: string;
};

export type TimelineItem = {
  id: string;
  laneId: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;

  assigneeName?: string;
  assigneeInitials?: string;
};

type TimelineBoardProps = {
  lanes: Lane[];
  items: TimelineItem[];
  startDate: string;
  endDate: string;
};

function daysBetween(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function normalizeDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export const TimelineView: React.FC<TimelineBoardProps> = ({
  lanes,
  items,
  startDate,
  endDate,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const DAYS_PER_BLOCK = 5;

  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);
  const totalDays = daysBetween(start, end);
  const totalBlocks = Math.ceil(totalDays / DAYS_PER_BLOCK);

  const labelColWidth = 140;
  const dayMinWidth = 10;
  const rowHeight = isSmall ? 44 : 40;
  const barHeight = rowHeight - 12;
  const baseTopOffset = 6;

  const [expandedLanes, setExpandedLanes] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    setExpandedLanes((prev) => {
      const next = { ...prev };
      lanes.forEach((lane) => {
        if (next[lane.id] === undefined) {
          next[lane.id] = true;
        }
      });
      return next;
    });
  }, [lanes]);

  const toggleLane = (laneId: string) => {
    setExpandedLanes((prev) => ({
      ...prev,
      [laneId]: !prev[laneId],
    }));
  };

  const headerBlocks = useMemo(() => {
    const blocks: {
      startIndex: number;
      endIndex: number;
      startDate: Date;
      endDate: Date;
      label: string;
    }[] = [];

    for (let i = 0; i < totalDays; i += DAYS_PER_BLOCK) {
      const startIndex = i;
      const endIndex = Math.min(i + DAYS_PER_BLOCK - 1, totalDays - 1);

      const s = new Date(start);
      s.setDate(start.getDate() + startIndex);

      const e = new Date(start);
      e.setDate(start.getDate() + endIndex);

      blocks.push({
        startIndex,
        endIndex,
        startDate: s,
        endDate: e,
        label: `${s.getDate()}–${e.getDate()}`,
      });
    }

    return blocks;
  }, [start, totalDays]);

  const blockWidthPercent = 100 / totalBlocks;

  const getItemStyle = (item: TimelineItem) => {
    const s = normalizeDate(item.startDate);
    const e = normalizeDate(item.endDate);

    const offsetDays = Math.max(0, daysBetween(start, s) - 1);
    const lengthDays = Math.max(1, daysBetween(s, e));

    const leftBlocks = offsetDays / DAYS_PER_BLOCK;
    const widthBlocks = lengthDays / DAYS_PER_BLOCK;

    const left = leftBlocks * blockWidthPercent;
    const width = widthBlocks * blockWidthPercent;

    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  const getLaneBarColors = (index: number) => {
    if (index === 0) {
      return {
        bg: alpha(theme.palette.success.light, 0.35),
        border: alpha(theme.palette.success.main, 0.9),
        text: theme.palette.success.dark,
      };
    }
    if (index === 1) {
      return {
        bg: alpha(theme.palette.warning.light, 0.4),
        border: alpha(theme.palette.warning.main, 0.9),
        text: theme.palette.warning.dark,
      };
    }
    if (index === 2) {
      return {
        bg: alpha(theme.palette.error.light, 0.4),
        border: alpha(theme.palette.error.main, 0.9),
        text: theme.palette.error.dark,
      };
    }

    return {
      bg: alpha(theme.palette.grey[300], 0.4),
      border: alpha(theme.palette.grey[500], 0.9),
      text: theme.palette.text.primary,
    };
  };

  const weekendColor = "#F2F5FF";

  const blockHasWeekend = (blockStart: Date, blockEnd: Date) => {
    const d = new Date(blockStart);
    while (d <= blockEnd) {
      const day = d.getDay();
      if (day === 0 || day === 6) return true;
      d.setDate(d.getDate() + 1);
    }
    return false;
  };

  const weekendGradients = headerBlocks
    .map((b, idx) => {
      if (!blockHasWeekend(b.startDate, b.endDate)) return null;

      const left = idx * blockWidthPercent;
      const right = (idx + 1) * blockWidthPercent;

      return `linear-gradient(to right,
        transparent 0%,
        transparent ${left}%,
        ${weekendColor} ${left}%,
        ${weekendColor} ${right}%,
        transparent ${right}%,
        transparent 100%)`;
    })
    .filter(Boolean) as string[];

  const bgImages = weekendGradients.join(", ");
  const bgSizes = Array(weekendGradients.length).fill("100% 100%").join(", ");

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Card
      sx={{
        p: 2,
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${labelColWidth}px repeat(${totalBlocks}, minmax(${
            dayMinWidth * DAYS_PER_BLOCK
          }px, 1fr))`,
        }}
      >
        <Box />

        {(() => {
          const monthBlocks: {
            name: string;
            startIndex: number;
            span: number;
          }[] = [];

          let currentMonth = headerBlocks[0]?.startDate.getMonth() ?? 0;
          let startIndex = 0;

          headerBlocks.forEach((b, i) => {
            const month = b.startDate.getMonth();
            if (month !== currentMonth) {
              monthBlocks.push({
                name: headerBlocks[i - 1].startDate.toLocaleString(undefined, {
                  month: "long",
                }),
                startIndex,
                span: i - startIndex,
              });

              currentMonth = month;
              startIndex = i;
            }
          });

          if (headerBlocks.length) {
            monthBlocks.push({
              name: headerBlocks[
                headerBlocks.length - 1
              ].startDate.toLocaleString(undefined, { month: "long" }),
              startIndex,
              span: headerBlocks.length - startIndex,
            });
          }

          return monthBlocks.map((m, idx) => (
            <Box
              key={idx}
              sx={{
                gridColumn: `${m.startIndex + 2} / span ${m.span}`,
                textAlign: "center",
                py: 0.5,
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                {m.name}
              </Typography>
            </Box>
          ));
        })()}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${labelColWidth}px repeat(${totalBlocks}, minmax(${
            dayMinWidth * DAYS_PER_BLOCK
          }px, 1fr))`,
          alignItems: "center",
          columnGap: 0,
          rowGap: 0,
        }}
      >
        <Box />

        {headerBlocks.map((b, idx) => (
          <Box
            key={idx}
            sx={{
              textAlign: "center",
              py: 0.5,
              borderBottom: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {b.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${labelColWidth}px repeat(${totalBlocks}, minmax(${
            dayMinWidth * DAYS_PER_BLOCK
          }px, 1fr))`,
        }}
      >
        {lanes.map((lane, laneIndex) => {
          const laneItems = items.filter((i) => i.laneId === lane.id);
          const barColors = getLaneBarColors(laneIndex);
          const isExpanded = expandedLanes[lane.id] ?? true;

          const expandedHeight = laneItems.length
            ? laneItems.length * rowHeight
            : rowHeight;

          return (
            <Fragment key={lane.id}>
              <Box
                sx={{
                  py: 0.75,
                  pr: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  cursor: "pointer",
                  userSelect: "none",
                  gap: 0.5,
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
                  gridColumn: `2 / span ${totalBlocks}`,
                  minHeight: isExpanded ? expandedHeight : rowHeight,
                  transition: "min-height 0.25s ease",
                  borderBottom: (t) => `1px solid ${t.palette.divider}`,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage: bgImages,
                    backgroundSize: bgSizes,
                    backgroundRepeat: "no-repeat",
                    pointerEvents: "none",
                    zIndex: 0,
                  },
                }}
              >
                {laneItems.map((item, idx) => {
                  const style = getItemStyle(item);
                  const top = baseTopOffset + idx * rowHeight;

                  const tooltipContent = (
                    <Box sx={{ p: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, display: "block", mb: 0.25 }}
                      >
                        {item.title}
                      </Typography>

                      {item.assigneeName && (
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mb: 0.25 }}
                        >
                          <strong>
                            {t("assignments.timeline.tooltip.assignedTo")}
                          </strong>{" "}
                          {item.assigneeName}
                        </Typography>
                      )}

                      <Typography variant="caption" sx={{ display: "block" }}>
                        <strong>
                          {t("assignments.timeline.tooltip.lane")}
                        </strong>{" "}
                        {lane.title}
                      </Typography>

                      <Typography variant="caption" sx={{ display: "block" }}>
                        <strong>
                          {t("assignments.timeline.tooltip.from")}
                        </strong>{" "}
                        {formatDate(item.startDate)}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block" }}>
                        <strong>{t("assignments.timeline.tooltip.to")}</strong>{" "}
                        {formatDate(item.endDate)}
                      </Typography>
                    </Box>
                  );

                  return (
                    <Tooltip
                      key={item.id}
                      title={tooltipContent}
                      arrow
                      placement="top"
                      enterDelay={150}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          zIndex: 1,
                          ...style,
                          top,
                          height: barHeight,
                          borderRadius: 1,
                          bgcolor: barColors.bg,
                          border: `1px solid ${barColors.border}`,
                          display: "flex",
                          alignItems: "center",
                          px: 1.25,
                          gap: 0.75,
                          boxShadow:
                            "0 1px 2px rgba(15,23,42,0.10), 0 0 0 1px rgba(15,23,42,0.03)",
                          overflow: "hidden",
                          cursor: "pointer",
                          transition: "opacity 0.2s ease, transform 0.2s ease",
                          opacity: isExpanded ? 1 : 0,
                          transform: isExpanded
                            ? "translateY(0)"
                            : "translateY(-4px)",
                          pointerEvents: isExpanded ? "auto" : "none",
                        }}
                      >
                        {item.assigneeInitials && (
                          <Avatar
                            sx={{
                              width: 20,
                              height: 20,
                              fontSize: 11,
                              bgcolor: "rgba(255,255,255,0.95)",
                              color: barColors.text,
                              boxShadow: "0 0 0 1px rgba(15,23,42,0.08)",
                            }}
                          >
                            {item.assigneeInitials}
                          </Avatar>
                        )}

                        <Typography
                          variant="caption"
                          sx={{
                            color: "common.black",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            </Fragment>
          );
        })}
      </Box>
    </Card>
  );
};
