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
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  fromPickerValue,
  isValidRange,
  todayStr,
  toPickerValue,
} from "../../../features/construction_site/utils/dates";

export type AssignBaseWindow = { from: string; to: string; custom: boolean };

export type AssignRange<TWindow extends AssignBaseWindow> = {
  windows: TWindow[];
};

type Preselected<TRange extends AssignRange<AssignBaseWindow>> = {
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
  addWindow: string;
  windowLabel: (index: number) => string;
  removeWindowTooltip: string;
  windowsCountLabel: (count: number) => string;
};

type Props<TItem, TWindow extends AssignBaseWindow, TPayload> = {
  open: boolean;
  title: string;
  onClose: () => void;

  items: TItem[];
  getItemId: (item: TItem) => number;
  getItemPrimary: (item: TItem) => string;
  getItemSecondary?: (item: TItem) => ReactNode;

  preselected: Preselected<AssignRange<TWindow>>;
  initialGlobalRange?: { from: string; to: string } | null;

  createWindow: (ctx: { globalFrom: string; globalTo: string }) => TWindow;

  renderWindowExtra?: (args: {
    id: number;
    item: TItem | undefined;
    window: TWindow;
    windowIndex: number;
    setWindowPatch: (patch: Partial<TWindow>) => void;
  }) => ReactNode;

  onSave: (payload: TPayload) => void;
  buildPayload: (args: {
    selected: number[];
    ranges: Record<number, AssignRange<TWindow>>;
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
  allowMultipleWindows?: boolean;

  labels?: Partial<Labels>;
};

export function ReusableAssignDialog<
  TItem,
  TWindow extends AssignBaseWindow,
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
  createWindow,
  renderWindowExtra,

  onSave,
  buildPayload,

  busy = false,
  loading = false,
  error = false,
  emptyText = "No items.",
  loadErrorText = "Failed to load.",
  detailGridMd = "minmax(140px,1fr) 180px 180px",
  leftWidthMd = "260px",
  allowMultipleWindows = true,
  labels,
}: Props<TItem, TWindow, TPayload>) {
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
    addWindow: labels?.addWindow ?? "Add window",
    windowLabel: labels?.windowLabel ?? ((i) => `Window ${i + 1}`),
    removeWindowTooltip: labels?.removeWindowTooltip ?? "Remove window",
    windowsCountLabel:
      labels?.windowsCountLabel ??
      ((count) => `${count} window${count === 1 ? "" : "s"}`),
  };

  const [selected, setSelected] = useState<number[]>([]);
  const [globalFrom, setGlobalFrom] = useState<string>(todayStr());
  const [globalTo, setGlobalTo] = useState<string>(todayStr());
  const [ranges, setRanges] = useState<Record<number, AssignRange<TWindow>>>(
    {}
  );
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
        const next: Record<number, AssignRange<TWindow>> = {};
        filtered.forEach((id) => {
          if (old[id]) next[id] = old[id];
        });
        return next;
      });
    }
  }, [open, items, selected, getItemId]);

  const markTouched = () => setTouched(true);

  const getOrCreateRange = (id: number) =>
    ranges[id] ?? { windows: [createWindow({ globalFrom, globalTo })] };

  const toggle = (id: number) => {
    markTouched();
    setSelected((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      setRanges((old) => {
        if (next.includes(id) && !old[id]) {
          return {
            ...old,
            [id]: { windows: [createWindow({ globalFrom, globalTo })] },
          };
        }
        return old;
      });

      return next;
    });
  };

  const applyGlobalToNonCustom = (nextFrom: string, nextTo: string) => {
    setRanges((old) => {
      const updated: Record<number, AssignRange<TWindow>> = { ...old };
      selected.forEach((id) => {
        const r = updated[id];
        if (!r) return;
        updated[id] = {
          ...r,
          windows: r.windows.map((window) =>
            window.custom ? window : { ...window, from: nextFrom, to: nextTo }
          ),
        };
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

  const setWindowFrom = (id: number, index: number, v: string) => {
    markTouched();
    setRanges((old) => {
      const prev = getOrCreateRange(id);
      const windows = prev.windows.map((window, i) =>
        i === index ? { ...window, from: v, custom: true } : window
      );
      return { ...old, [id]: { ...prev, windows } };
    });
  };

  const setWindowTo = (id: number, index: number, v: string) => {
    markTouched();
    setRanges((old) => {
      const prev = getOrCreateRange(id);
      const windows = prev.windows.map((window, i) =>
        i === index ? { ...window, to: v, custom: true } : window
      );
      return { ...old, [id]: { ...prev, windows } };
    });
  };

  const addWindow = (id: number) => {
    if (!allowMultipleWindows) return;
    markTouched();
    setRanges((old) => {
      const prev = getOrCreateRange(id);
      return {
        ...old,
        [id]: {
          ...prev,
          windows: [...prev.windows, createWindow({ globalFrom, globalTo })],
        },
      };
    });
  };

  const removeWindow = (id: number, index: number) => {
    if (!allowMultipleWindows) return;
    markTouched();
    setRanges((old) => {
      const prev = getOrCreateRange(id);
      if (prev.windows.length <= 1) return old;
      return {
        ...old,
        [id]: {
          ...prev,
          windows: prev.windows.filter((_, i) => i !== index),
        },
      };
    });
  };

  const resetWindowToGlobal = (id: number, index: number) => {
    markTouched();
    setRanges((old) => {
      const prev = getOrCreateRange(id);
      return {
        ...old,
        [id]: {
          ...prev,
          windows: prev.windows.map((window, i) =>
            i === index
              ? { ...window, from: globalFrom, to: globalTo, custom: false }
              : window
          ),
        },
      };
    });
  };

  const isCustom = useMemo(() => {
    if (selected.length === 0) return false;
    return selected.some((id) => {
      const r = ranges[id];
      if (!r) return false;
      return r.windows.some(
        (window) => window.from !== globalFrom || window.to !== globalTo
      );
    });
  }, [selected, ranges, globalFrom, globalTo]);

  const allRangesValid = useMemo(() => {
    if (!isValidRange(globalFrom, globalTo)) return false;
    for (const id of selected) {
      const r = getOrCreateRange(id);
      for (const window of r.windows) {
        if (!isValidRange(window.from, window.to)) return false;
      }
    }
    return true;
  }, [selected, ranges, globalFrom, globalTo]);

  const handleSave = () => {
    if (selected.length > 0 && !allRangesValid) return;
    const payload = buildPayload({ selected, ranges, globalFrom, globalTo });
    onSave(payload);
  };

  const selectedItems = useMemo(() => {
    const byId = new Map(items.map((it) => [getItemId(it), it]));
    return selected.map((id) => ({ id, item: byId.get(id) }));
  }, [items, selected, getItemId]);

  const computedGrid = allowMultipleWindows
    ? `${detailGridMd} 48px 48px`
    : `${detailGridMd} 48px`;

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
                <Stack spacing={1.5} sx={{ maxHeight: 420, overflowY: "auto" }}>
                  {selectedItems.map(({ id, item }) => {
                    const range = getOrCreateRange(id);

                    return (
                      <Box
                        key={id}
                        sx={{
                          p: 1.5,
                          border: (t) => `1px solid ${t.palette.divider}`,
                          borderRadius: 1,
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            mb: 1,
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

                          {allowMultipleWindows ? (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<AddRoundedIcon />}
                              onClick={() => addWindow(id)}
                              sx={{
                                textTransform: "none",
                                borderColor: "#E5E7EB",
                                color: "#111827",
                                fontWeight: 500,
                              }}
                            >
                              {L.addWindow}
                            </Button>
                          ) : null}
                        </Box>

                        <Stack spacing={1}>
                          {range.windows.map((window, index) => {
                            const isWindowSynced =
                              window.from === globalFrom &&
                              window.to === globalTo;
                            const allowRemove =
                              allowMultipleWindows && range.windows.length > 1;

                            return (
                              <Box
                                key={`${id}-${index}`}
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: {
                                    xs: "1fr",
                                    md: computedGrid,
                                  },
                                  gap: 1,
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 500,
                                  }}
                                >
                                  {L.windowLabel(index)}
                                </Typography>

                                <DatePicker
                                  value={toPickerValue(window.from)}
                                  onChange={(nv) =>
                                    setWindowFrom(
                                      id,
                                      index,
                                      fromPickerValue(nv)
                                    )
                                  }
                                  slotProps={{
                                    textField: {
                                      size: "small",
                                      error: !isValidRange(
                                        window.from,
                                        window.to
                                      ),
                                    },
                                  }}
                                />

                                <DatePicker
                                  value={toPickerValue(window.to)}
                                  onChange={(nv) =>
                                    setWindowTo(id, index, fromPickerValue(nv))
                                  }
                                  slotProps={{
                                    textField: {
                                      size: "small",
                                      error: !isValidRange(
                                        window.from,
                                        window.to
                                      ),
                                    },
                                  }}
                                />

                                {renderWindowExtra ? (
                                  <Box>
                                    {renderWindowExtra({
                                      id,
                                      item,
                                      window: window as TWindow,
                                      windowIndex: index,
                                      setWindowPatch: (patch) => {
                                        setTouched(true);
                                        setRanges((old) => {
                                          const prev = getOrCreateRange(id);
                                          const nextWindows = prev.windows.map(
                                            (entry, i) =>
                                              i === index
                                                ? { ...entry, ...patch }
                                                : entry
                                          );
                                          return {
                                            ...old,
                                            [id]: {
                                              ...prev,
                                              windows: nextWindows,
                                            },
                                          };
                                        });
                                      },
                                    })}
                                  </Box>
                                ) : null}

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Tooltip title={L.resetToGlobalTooltip}>
                                    <span>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          resetWindowToGlobal(id, index)
                                        }
                                        disabled={isWindowSynced}
                                      >
                                        <RestartAltIcon fontSize="small" />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </Box>

                                {allowMultipleWindows ? (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Tooltip title={L.removeWindowTooltip}>
                                      <span>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            removeWindow(id, index)
                                          }
                                          disabled={!allowRemove}
                                        >
                                          <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                  </Box>
                                ) : null}
                              </Box>
                            );
                          })}
                        </Stack>
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
