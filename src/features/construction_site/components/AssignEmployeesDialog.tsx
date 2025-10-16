import * as React from "react";
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
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useAssignEmployeesToConstructionSite } from "../hooks/useAssignEmployeesToConstructionSite";

type Props = {
  constructionSiteId: number;
  open: boolean;
  onClose: () => void;
};

type EmpRange = { from: string; to: string; custom: boolean };

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function isValidRange(from: string, to: string) {
  if (!from || !to) return false;
  return new Date(from) <= new Date(to);
}

export default function AssignEmployeesDialog({
  constructionSiteId,
  open,
  onClose,
}: Props) {
  const { employeeRows = [], isLoading, isError } = useEmployees();
  const assign = useAssignEmployeesToConstructionSite();

  const [selected, setSelected] = React.useState<number[]>([]);
  const [globalFrom, setGlobalFrom] = React.useState<string>(todayStr());
  const [globalTo, setGlobalTo] = React.useState<string>(todayStr());
  const [ranges, setRanges] = React.useState<Record<number, EmpRange>>({});

  React.useEffect(() => {
    if (!open) {
      setSelected([]);
      setGlobalFrom(todayStr());
      setGlobalTo(todayStr());
      setRanges({});
    }
  }, [open]);

  const toggleEmp = (id: number) => {
    setSelected((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      setRanges((old) => {
        const has = old[id];
        if (next.includes(id) && !has) {
          return {
            ...old,
            [id]: { from: globalFrom, to: globalTo, custom: false },
          };
        }
        return old;
      });

      return next;
    });
  };

  const applyGlobal = (nextFrom: string, nextTo: string) => {
    setRanges((old) => {
      const updated: Record<number, EmpRange> = { ...old };
      selected.forEach((id) => {
        const r = updated[id] ?? {
          from: globalFrom,
          to: globalTo,
          custom: false,
        };
        if (!r.custom) {
          updated[id] = { ...r, from: nextFrom, to: nextTo };
        }
      });
      return updated;
    });
  };

  const onChangeGlobalFrom = (v: string) => {
    setGlobalFrom(v);
    applyGlobal(v, globalTo);
  };
  const onChangeGlobalTo = (v: string) => {
    setGlobalTo(v);
    applyGlobal(globalFrom, v);
  };

  const setEmpFrom = (id: number, v: string) => {
    setRanges((old) => {
      const prev = old[id] ?? { from: globalFrom, to: globalTo, custom: false };
      return { ...old, [id]: { ...prev, from: v, custom: true } };
    });
  };
  const setEmpTo = (id: number, v: string) => {
    setRanges((old) => {
      const prev = old[id] ?? { from: globalFrom, to: globalTo, custom: false };
      return { ...old, [id]: { ...prev, to: v, custom: true } };
    });
  };

  const resetEmpToGlobal = (id: number) => {
    setRanges((old) => {
      const r = old[id] ?? { from: globalFrom, to: globalTo, custom: false };
      return {
        ...old,
        [id]: { ...r, from: globalFrom, to: globalTo, custom: false },
      };
    });
  };

  const isCustom = React.useMemo(
    () => selected.some((id) => ranges[id]?.custom),
    [selected, ranges]
  );

  const allRangesValid = React.useMemo(() => {
    if (!isValidRange(globalFrom, globalTo)) return false;
    for (const id of selected) {
      const r = ranges[id] ?? { from: globalFrom, to: globalTo, custom: false };
      if (!isValidRange(r.from, r.to)) return false;
    }
    return true;
  }, [selected, ranges, globalFrom, globalTo]);

  const handleSave = () => {
    if (selected.length > 0 && !allRangesValid) return;

    const payload = {
      constructionSiteId,
      employees:
        selected.length === 0
          ? []
          : selected.map((employeeId) => {
              const r = ranges[employeeId] ?? {
                from: globalFrom,
                to: globalTo,
                custom: false,
              };
              return {
                employeeId,
                dateFrom: r.from,
                dateTo: r.to,
              };
            }),
    };

    assign.mutate(payload, { onSuccess: onClose });
  };

  const DETAIL_GRID_MD = "minmax(220px,1fr) 180px 180px 48px";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: { border: (t) => `1px solid ${t.palette.primary.main}` },
      }}
    >
      <DialogTitle>Dodjela zaposlenika</DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">
              Neuspjelo učitavanje zaposlenika.
            </Typography>
          </Box>
        ) : employeeRows.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">
              Nema dostupnih zaposlenika.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
              minHeight: 420,
            }}
          >
            <Box
              sx={{
                borderRight: (t) => ({
                  md: `1px solid ${t.palette.divider}`,
                }),
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
                  Zaposlenici ({employeeRows.length})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Odabrano: {selected.length}
                </Typography>
              </Stack>
              <Divider sx={{ mb: 1 }} />

              <Stack spacing={0.5}>
                {employeeRows.map((e: any) => {
                  const id = Number(e.id);
                  const full = `${e.firstName ?? ""} ${
                    e.lastName ?? ""
                  }`.trim();
                  const checked = selected.includes(id);

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
                        onChange={() => toggleEmp(id)}
                        sx={{ mr: 1 }}
                      />
                      <Box
                        onClick={() => toggleEmp(id)}
                        sx={{ cursor: "pointer", minWidth: 0, flex: 1 }}
                        title={full || `ID ${id}`}
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
                          {full || `ID ${id}`}
                        </Typography>
                        {e.oib && (
                          <Typography variant="caption" color="text.secondary">
                            OIB: {e.oib}
                          </Typography>
                        )}
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
                <TextField
                  label="Početak (globalno)"
                  type="date"
                  size="small"
                  value={globalFrom}
                  onChange={(e) => onChangeGlobalFrom(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Završetak (globalno)"
                  type="date"
                  size="small"
                  value={globalTo}
                  onChange={(e) => onChangeGlobalTo(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <Chip
                  label={isCustom ? "Raspon: Prilagođeno" : "Raspon: Globalno"}
                  color={isCustom ? "warning" : "default"}
                  sx={{ ml: { sm: "auto" } }}
                />
              </Stack>

              {selected.length > 0 && (
                <Box
                  sx={{
                    display: { xs: "none", md: "grid" },
                    gridTemplateColumns: DETAIL_GRID_MD,
                    gap: 1,
                    px: 1,
                    pb: 1,
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                >
                  <Box> Zaposlenik </Box>
                  <Box> Početak </Box>
                  <Box> Završetak </Box>
                  <Box> Reset </Box>
                </Box>
              )}

              {selected.length === 0 ? (
                <Typography color="text.secondary">
                  Odaberite zaposlenike s lijeve strane.
                </Typography>
              ) : (
                <Stack spacing={1} sx={{ maxHeight: 420, overflowY: "auto" }}>
                  {selected.map((id) => {
                    const e = employeeRows.find(
                      (x: any) => Number(x.id) === id
                    );
                    const full = e
                      ? `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim()
                      : `ID ${id}`;
                    const r = ranges[id] ?? {
                      from: globalFrom,
                      to: globalTo,
                      custom: false,
                    };

                    return (
                      <Box
                        key={id}
                        sx={{
                          p: 1,
                          border: (t) => `1px solid ${t.palette.divider}`,
                          borderRadius: 1,
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: DETAIL_GRID_MD,
                          },
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        {/* Name */}
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={full}
                          >
                            {full}
                          </Typography>
                          {e?.oib && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.25 }}
                            >
                              OIB: {e.oib}
                            </Typography>
                          )}
                        </Box>

                        {/* From */}
                        <TextField
                          label="Početak"
                          type="date"
                          size="small"
                          value={r.from}
                          onChange={(ev) => setEmpFrom(id, ev.target.value)}
                          InputLabelProps={{ shrink: true }}
                          error={!isValidRange(r.from, r.to)}
                        />

                        <TextField
                          label="Završetak"
                          type="date"
                          size="small"
                          value={r.to}
                          onChange={(ev) => setEmpTo(id, ev.target.value)}
                          InputLabelProps={{ shrink: true }}
                          error={!isValidRange(r.from, r.to)}
                        />

                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Tooltip title="Vrati na globalni raspon">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => resetEmpToGlobal(id)}
                                disabled={!r.custom}
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

      <DialogActions sx={{ p: 2 }}>
        {!allRangesValid && selected.length > 0 && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mr: "auto", pl: 1 }}
          >
            Provjerite datume (Početak ≤ Završetak).
          </Typography>
        )}

        <Button
          onClick={onClose}
          disabled={assign.isPending}
          variant="outlined"
          sx={{
            color: (t) => t.palette.grey[700],
            borderColor: (t) => t.palette.grey[400],
            "&:hover": {
              backgroundColor: (t) => t.palette.grey[100],
              borderColor: (t) => t.palette.grey[500],
            },
          }}
        >
          Odustani
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={
            assign.isPending ||
            isLoading ||
            isError ||
            (selected.length > 0 && !allRangesValid)
          }
        >
          {assign.isPending ? "Spremanje..." : "Spremi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
