import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  CircularProgress,
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  fromPickerValue,
  isValidRange,
  todayStr,
  toPickerValue,
} from "../../../features/construction_site/utils/dates";

export type AssignBaseRange = { from: string; to: string; custom: boolean };

type Preselected<TRange extends AssignBaseRange> = {
  ids: number[];
  map: Record<number, TRange>;
};

type Labels = {
  startLabel: string;
  endLabel: string;
  cancel: string;
  save: string;
  saving: string;
  invalidRange: string;
  pickHint: string;
  itemsCountLabel: (count: number) => string;
  selectedCountLabel: (count: number) => string;
  chipGlobal: string;
  chipCustom: string;
  resetToGlobalTooltip: string;
};

type Props<TItem, TRange extends AssignBaseRange, TPayload> = {
  open: boolean;
  title: string;
  onClose: () => void;

  items: TItem[];
  getItemId: (item: TItem) => number;
  getItemPrimary: (item: TItem) => string;
  getItemSecondary?: (item: TItem) => ReactNode;

  preselected: Preselected<TRange>;
  initialGlobalRange?: { from: string; to: string } | null;

  createRange: (ctx: { globalFrom: string; globalTo: string }) => TRange;

  renderRowExtra?: (args: {
    id: number;
    item: TItem | undefined;
    range: TRange;
    setRangePatch: (patch: Partial<TRange>) => void;
  }) => ReactNode;

  onSave: (payload: TPayload) => void;
  buildPayload: (args: {
    selected: number[];
    ranges: Record<number, TRange>;
    globalFrom: string;
    globalTo: string;
  }) => TPayload;

  busy?: boolean;
  loading?: boolean;
  error?: boolean;
  emptyText?: string;
  loadErrorText?: string;

  detailGridMd?: string;
  leftWidthMd?: string;

  labels?: Partial<Labels>;
};

export function ReusableAssignDialog<
  TItem,
  TRange extends AssignBaseRange,
  TPayload
>({
  open,
  title,
  onClose,

  items,
  getItemId,
  getItemPrimary,
  getItemSecondary,

  preselected,
  initialGlobalRange = null,
  createRange,
  renderRowExtra,

  onSave,
  buildPayload,

  busy = false,
  loading = false,
  error = false,
  emptyText = "No items.",
  loadErrorText = "Failed to load.",
  detailGridMd = "minmax(220px,1fr) 180px 180px 48px",
  leftWidthMd = "260px",
  labels,
}: Props<TItem, TRange, TPayload>) {
  const L: Labels = {
    startLabel: labels?.startLabel ?? "Start",
    endLabel: labels?.endLabel ?? "End",
    cancel: labels?.cancel ?? "Cancel",
    save: labels?.save ?? "Save",
    saving: labels?.saving ?? "Saving...",
    invalidRange: labels?.invalidRange ?? "Invalid date range.",
    pickHint: labels?.pickHint ?? "Pick at least one item.",
    itemsCountLabel: labels?.itemsCountLabel ?? ((c) => `Items: ${c}`),
    selectedCountLabel: labels?.selectedCountLabel ?? ((c) => `Selected: ${c}`),
    chipGlobal: labels?.chipGlobal ?? "Global",
    chipCustom: labels?.chipCustom ?? "Custom",
    resetToGlobalTooltip: labels?.resetToGlobalTooltip ?? "Reset to global",
  };

  const [selected, setSelected] = useState<number[]>([]);
  const [globalFrom, setGlobalFrom] = useState<string>(todayStr());
  const [globalTo, setGlobalTo] = useState<string>(todayStr());
  const [ranges, setRanges] = useState<Record<number, TRange>>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelected([]);
      setGlobalFrom(todayStr());
      setGlobalTo(todayStr());
      setRanges({});
      setTouched(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || touched) return;
    setSelected(preselected.ids);
    setRanges(preselected.map);

    if (initialGlobalRange) {
      setGlobalFrom(initialGlobalRange.from);
      setGlobalTo(initialGlobalRange.to);
    } else {
      setGlobalFrom(todayStr());
      setGlobalTo(todayStr());
    }
  }, [open, touched, preselected, initialGlobalRange]);

  useEffect(() => {
    if (!open || selected.length === 0) return;
    const existing = new Set(items.map((it) => getItemId(it)));
    const filtered = selected.filter((id) => existing.has(id));

    if (filtered.length !== selected.length) {
      setSelected(filtered);
      setRanges((old) => {
        const next: Record<number, TRange> = {};
        filtered.forEach((id) => {
          if (old[id]) next[id] = old[id];
        });
        return next;
      });
    }
  }, [open, items, selected, getItemId]);

  const markTouched = () => setTouched(true);

  const toggle = (id: number) => {
    markTouched();
    setSelected((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      setRanges((old) => {
        if (next.includes(id) && !old[id]) {
          return { ...old, [id]: createRange({ globalFrom, globalTo }) };
        }
        return old;
      });

      return next;
    });
  };

  const applyGlobalToNonCustom = (nextFrom: string, nextTo: string) => {
    setRanges((old) => {
      const updated: Record<number, TRange> = { ...old };
      selected.forEach((id) => {
        const r = updated[id];
        if (!r) return;
        if (!r.custom) updated[id] = { ...r, from: nextFrom, to: nextTo };
      });
      return updated;
    });
  };

  const onChangeGlobalFrom = (v: string) => {
    markTouched();
    setGlobalFrom(v);
    applyGlobalToNonCustom(v, globalTo);
  };

  const onChangeGlobalTo = (v: string) => {
    markTouched();
    setGlobalTo(v);
    applyGlobalToNonCustom(globalFrom, v);
  };

  const setRowFrom = (id: number, v: string) => {
    markTouched();
    setRanges((old) => {
      const prev = old[id] ?? createRange({ globalFrom, globalTo });
      return { ...old, [id]: { ...prev, from: v, custom: true } };
    });
  };

  const setRowTo = (id: number, v: string) => {
    markTouched();
    setRanges((old) => {
      const prev = old[id] ?? createRange({ globalFrom, globalTo });
      return { ...old, [id]: { ...prev, to: v, custom: true } };
    });
  };

  const resetRowToGlobal = (id: number) => {
    markTouched();
    setRanges((old) => {
      const prev = old[id] ?? createRange({ globalFrom, globalTo });
      return {
        ...old,
        [id]: { ...prev, from: globalFrom, to: globalTo, custom: false },
      };
    });
  };

  const isCustom = useMemo(() => {
    if (selected.length === 0) return false;
    return selected.some((id) => {
      const r = ranges[id];
      if (!r) return false;
      return r.from !== globalFrom || r.to !== globalTo;
    });
  }, [selected, ranges, globalFrom, globalTo]);

  const allRangesValid = useMemo(() => {
    if (!isValidRange(globalFrom, globalTo)) return false;
    for (const id of selected) {
      const r = ranges[id] ?? createRange({ globalFrom, globalTo });
      if (!isValidRange(r.from, r.to)) return false;
    }
    return true;
  }, [selected, ranges, globalFrom, globalTo, createRange]);

  const handleSave = () => {
    if (selected.length > 0 && !allRangesValid) return;
    const payload = buildPayload({ selected, ranges, globalFrom, globalTo });
    onSave(payload);
  };

  const selectedItems = useMemo(() => {
    const byId = new Map(items.map((it) => [getItemId(it), it]));
    return selected.map((id) => ({ id, item: byId.get(id) }));
  }, [items, selected, getItemId]);

  const computedGrid = detailGridMd;

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (busy) return;
        onClose();
      }}
      fullWidth
      maxWidth="xl"
      PaperProps={{ sx: { position: "relative", p: 2.5, pt: 2.25, pb: 2.5 } }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}
        >
          {title}
        </DialogTitle>

        <IconButton
          onClick={() => {
            if (busy) return;
            onClose();
          }}
          disabled={busy}
          sx={{
            width: 32,
            height: 32,
            borderRadius: "999px",
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": { backgroundColor: "#EFF6FF" },
          }}
        >
          <CloseIcon sx={{ fontSize: 16, color: "#111827" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, mb: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{loadErrorText}</Typography>
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">{emptyText}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: `${leftWidthMd} 1fr` },
              minHeight: 420,
            }}
          >
            <Box
              sx={{
                borderRight: (t) => ({ md: `1px solid ${t.palette.divider}` }),
                p: 2,
                overflowY: "auto",
                maxHeight: 560,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {L.itemsCountLabel(items.length)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {L.selectedCountLabel(selected.length)}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 1 }} />

              <Stack spacing={0.5}>
                {items.map((it) => {
                  const id = getItemId(it);
                  const checked = selected.includes(id);
                  const primary = getItemPrimary(it);

                  return (
                    <Box
                      key={id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={checked}
                        onChange={() => toggle(id)}
                        sx={{ mr: 1 }}
                      />
                      <Box
                        onClick={() => toggle(id)}
                        sx={{ cursor: "pointer", minWidth: 0, flex: 1 }}
                        title={primary}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {primary || `ID ${id}`}
                        </Typography>
                        {getItemSecondary ? (
                          <Typography variant="caption" color="text.secondary">
                            {getItemSecondary(it)}
                          </Typography>
                        ) : null}
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            <Box sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{
                  p: 2,
                  mb: 2,
                  border: (t) => `1px dashed ${t.palette.divider}`,
                  borderRadius: 1,
                }}
              >
                <DatePicker
                  label={L.startLabel}
                  value={toPickerValue(globalFrom)}
                  onChange={(nv) => onChangeGlobalFrom(fromPickerValue(nv))}
                  slotProps={{ textField: { size: "small" } }}
                />

                <DatePicker
                  label={L.endLabel}
                  value={toPickerValue(globalTo)}
                  onChange={(nv) => onChangeGlobalTo(fromPickerValue(nv))}
                  slotProps={{ textField: { size: "small" } }}
                />

                <Chip
                  label={isCustom ? L.chipCustom : L.chipGlobal}
                  color={isCustom ? "warning" : "default"}
                  sx={{ ml: { sm: "auto" } }}
                />
              </Stack>

              {selected.length === 0 ? (
                <Typography color="text.secondary">{L.pickHint}</Typography>
              ) : (
                <Stack spacing={1} sx={{ maxHeight: 420, overflowY: "auto" }}>
                  {selectedItems.map(({ id, item }) => {
                    const r =
                      ranges[id] ?? createRange({ globalFrom, globalTo });
                    const isRowGloballySynced =
                      r.from === globalFrom && r.to === globalTo;

                    return (
                      <Box
                        key={id}
                        sx={{
                          p: 1,
                          border: (t) => `1px solid ${t.palette.divider}`,
                          borderRadius: 1,
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", md: computedGrid },
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={item ? getItemPrimary(item) : `ID ${id}`}
                          >
                            {item ? getItemPrimary(item) : `ID ${id}`}
                          </Typography>
                        </Box>

                        <DatePicker
                          value={toPickerValue(r.from)}
                          onChange={(nv) => setRowFrom(id, fromPickerValue(nv))}
                          slotProps={{
                            textField: {
                              size: "small",
                              error: !isValidRange(r.from, r.to),
                            },
                          }}
                        />

                        <DatePicker
                          value={toPickerValue(r.to)}
                          onChange={(nv) => setRowTo(id, fromPickerValue(nv))}
                          slotProps={{
                            textField: {
                              size: "small",
                              error: !isValidRange(r.from, r.to),
                            },
                          }}
                        />

                        {renderRowExtra ? (
                          <Box>
                            {renderRowExtra({
                              id,
                              item,
                              range: r as TRange,
                              setRangePatch: (patch) => {
                                setTouched(true);
                                setRanges((old) => ({
                                  ...old,
                                  [id]: { ...(old[id] ?? r), ...patch },
                                }));
                              },
                            })}
                          </Box>
                        ) : null}

                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Tooltip title={L.resetToGlobalTooltip}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => resetRowToGlobal(id)}
                                disabled={isRowGloballySynced}
                              >
                                <RestartAltIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 0,
          mt: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        {selected.length > 0 && !allRangesValid && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mr: "auto", pl: 0.5 }}
          >
            {L.invalidRange}
          </Typography>
        )}

        <Button
          onClick={() => {
            if (busy) return;
            onClose();
          }}
          disabled={busy}
          size="small"
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 500,
            px: 2.5,
            borderColor: "#E5E7EB",
            color: "#111827",
            backgroundColor: "#ffffff",
            "&:hover": { backgroundColor: "#F9FAFB", borderColor: "#D1D5DB" },
          }}
        >
          {L.cancel}
        </Button>

        <Button
          onClick={handleSave}
          size="small"
          variant="contained"
          disabled={
            busy || loading || error || (selected.length > 0 && !allRangesValid)
          }
          sx={{ textTransform: "none", fontWeight: 600, px: 2.5 }}
        >
          {busy ? L.saving : L.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
