import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import { useCallback, useEffect, useRef, useState } from "react";

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type HistoryMetaRow = {
  label: string;
  value: React.ReactNode;
};

export type HistoryViewItem = {
  title: string;
  subtitle?: string;
  badge?: string;
  date?: string;
  meta?: HistoryMetaRow[];
};

type HistoryPanelProps<TItem> = {
  title?: string;
  pageSize?: number;
  queryKey: (page0: number, pageSize: number) => readonly unknown[];
  queryFn: (page0: number, pageSize: number) => Promise<PagedResult<TItem>>;
  mapItem: (item: TItem) => HistoryViewItem;
  dateColWidth?: number;
  loadMoreLabel?: string;
};

function safeDateOnly(d?: string) {
  if (!d) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const da = Number(m[3]);
    const dt = new Date(y, mo, da);
    return isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

function formatDateLabel(d?: string) {
  const dt = safeDateOnly(d);
  if (!dt) return "";
  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function HistoryPanel<TItem>({
  title = "History",
  pageSize = 5,
  queryKey,
  queryFn,
  mapItem,
  dateColWidth = 96,
  loadMoreLabel = "Load more",
}: HistoryPanelProps<TItem>) {
  const [page0, setPage0] = useState(0);
  const [allItems, setAllItems] = useState<TItem[]>([]);
  const activeIndex = 0;

  const loadedPagesRef = useRef<Set<number>>(new Set());

  const q = useQuery({
    queryKey: queryKey(page0, pageSize),
    queryFn: () => queryFn(page0, pageSize),
  });

  useEffect(() => {
    if (!q.data) return;

    if (loadedPagesRef.current.has(page0)) return;
    loadedPagesRef.current.add(page0);

    const incoming = q.data.items ?? [];
    setAllItems((prev) => (page0 === 0 ? incoming : [...prev, ...incoming]));
  }, [q.data, page0]);

  const onLoadMore = useCallback(() => {
    setPage0((p) => p + 1);
  }, []);

  const onReset = useCallback(() => {
    loadedPagesRef.current.clear();
    setPage0(0);
    setAllItems([]);
  }, []);

  return (
    <Paper variant="outlined" sx={{ p: 2, width: "100%", minWidth: 0 }}>
      <Stack spacing={0.25} sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {q.data ? `${q.data.total} total` : ""}
          {q.isFetching ? " • loading…" : ""}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {q.isLoading && allItems.length === 0 && (
        <Stack spacing={1.25}>
          <Skeleton height={56} />
          <Skeleton height={56} />
        </Stack>
      )}

      {!q.isError && allItems.length > 0 && (
        <Timeline
          position="right"
          sx={{
            p: 0,
            m: 0,
            width: "100%",
            alignItems: "flex-start",
            "& .MuiTimelineItem-root": {
              width: "100%",
              alignItems: "flex-start",
            },
            "& .MuiTimelineItem-root:before": { flex: 0, padding: 0 },
          }}
        >
          {allItems.map((raw, idx) => {
            const v = mapItem(raw);
            const isActive = idx === activeIndex;

            return (
              <TimelineItem key={idx} sx={{ width: "100%" }}>
                <TimelineOppositeContent
                  sx={{
                    flex: `0 0 ${dateColWidth}px`,
                    maxWidth: dateColWidth,
                    pr: 2,
                    pt: 1.1,
                    m: 0,
                    textAlign: "right",
                  }}
                >
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {formatDateLabel(v.date)}
                  </Typography>
                </TimelineOppositeContent>

                <TimelineSeparator sx={{ alignItems: "center" }}>
                  <TimelineDot
                    color="primary"
                    variant={isActive ? "filled" : "outlined"}
                    sx={(theme) => ({
                      bgcolor: isActive
                        ? theme.palette.primary.main
                        : theme.palette.background.paper,
                      borderColor: theme.palette.primary.main,
                    })}
                  />
                  {idx < allItems.length - 1 && (
                    <TimelineConnector
                      sx={(theme) => ({
                        bgcolor: theme.palette.primary.main,
                        width: 2,
                        borderRadius: 99,
                      })}
                    />
                  )}
                </TimelineSeparator>

                <TimelineContent
                  sx={{ py: 1, m: 0, width: "100%", minWidth: 0 }}
                >
                  <Paper
                    variant="outlined"
                    sx={(theme) => ({
                      width: "100%",
                      px: 2,
                      py: 1,
                      minWidth: 0,
                      bgcolor: isActive
                        ? theme.palette.primary.main
                        : theme.palette.background.paper,
                      color: "white",
                      boxShadow: isActive
                        ? "0 2px 8px rgba(0,0,0,0.18)"
                        : "0 1px 4px rgba(0,0,0,0.08)",
                    })}
                  >
                    <Stack spacing={v.meta?.length ? 1 : 0}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {v.badge && (
                          <Chip
                            size="small"
                            label={v.badge}
                            sx={(theme) => ({
                              bgcolor: isActive
                                ? alpha(theme.palette.common.white, 0.22)
                                : alpha(theme.palette.primary.main, 0.1),
                              color: isActive
                                ? theme.palette.common.white
                                : theme.palette.primary.main,
                              fontWeight: 700,
                            })}
                          />
                        )}

                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={800} noWrap>
                            {v.title}
                          </Typography>
                          {v.subtitle && (
                            <Typography
                              variant="caption"
                              sx={{ opacity: isActive ? 0.85 : 0.7 }}
                              noWrap
                            >
                              {v.subtitle}
                            </Typography>
                          )}
                        </Box>
                      </Stack>

                      {v.meta && v.meta.length > 0 && (
                        <Stack spacing={0.5} sx={{ pl: 0.25 }}>
                          {v.meta.map((row, i) => (
                            <Stack
                              key={i}
                              direction="row"
                              spacing={1}
                              sx={{ minWidth: 0 }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ opacity: isActive ? 0.85 : 0.75 }}
                              >
                                {row.label}:
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  opacity: isActive ? 0.9 : 0.85,
                                  fontWeight: 600,
                                  minWidth: 0,
                                }}
                                noWrap
                              >
                                {row.value}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            );
          })}

          <TimelineItem sx={{ width: "100%" }}>
            <TimelineOppositeContent
              sx={{
                flex: `0 0 ${dateColWidth}px`,
                maxWidth: dateColWidth,
                pr: 2,
                m: 0,
              }}
            />
            <TimelineSeparator sx={{ alignItems: "center" }}>
              <TimelineDot
                variant="outlined"
                sx={(theme) => ({
                  borderColor: theme.palette.primary.main,
                })}
              />
            </TimelineSeparator>
            <TimelineContent sx={{ py: 1, m: 0, width: "100%", minWidth: 0 }}>
              <Paper
                variant="outlined"
                onClick={onLoadMore}
                sx={(theme) => ({
                  width: "100%",
                  px: 2,
                  py: 1.5,
                  borderStyle: "dashed",
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                  opacity: q.isFetching ? 0.7 : 1,
                  pointerEvents: q.isFetching ? "none" : "auto",
                })}
              >
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="primary"
                  sx={{ textAlign: "left" }}
                >
                  {loadMoreLabel}
                </Typography>
              </Paper>

              {allItems.length > 0 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.75, display: "block", cursor: "pointer" }}
                  onClick={onReset}
                >
                  Reset
                </Typography>
              )}
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      )}
    </Paper>
  );
}
