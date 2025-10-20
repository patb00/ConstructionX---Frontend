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
  Autocomplete,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useTranslation } from "react-i18next";

import { useEmployees } from "../../administration/employees/hooks/useEmployees";
// if you have a hook for vehicles:

import { useConstructionSite } from "../hooks/useConstructionSite";

import { isValidRange, todayStr } from "../utils/dates";
import { useAssignVehiclesToConstructionSite } from "../hooks/useAssignVehiclesToConstructionSite";
import { fullName } from "../utils/name";
import { useVehicles } from "../../vehicles/hooks/useVehicles";

type VehRange = {
  from: string;
  to: string;
  custom: boolean;
  responsibleEmployeeId?: number | null;
};

type Props = {
  constructionSiteId: number;
  open: boolean;
  onClose: () => void;
};

export default function AssignVehiclesDialog({
  constructionSiteId,
  open,
  onClose,
}: Props) {
  const { t } = useTranslation();

  const { data: site } = useConstructionSite(constructionSiteId);
  const {
    employeeRows = [],
    isLoading: empLoading,
    isError: empError,
  } = useEmployees();
  const {
    vehiclesRows,
    isLoading: vehLoading,
    isError: vehError,
  } = useVehicles();
  const assign = useAssignVehiclesToConstructionSite();

  const [selected, setSelected] = React.useState<number[]>([]);
  const [globalFrom, setGlobalFrom] = React.useState<string>(todayStr());
  const [globalTo, setGlobalTo] = React.useState<string>(todayStr());
  const [ranges, setRanges] = React.useState<Record<number, VehRange>>({});
  const [touched, setTouched] = React.useState(false);

  const DETAIL_GRID_MD = "minmax(220px,1fr) 180px 180px minmax(220px,1fr) 48px";

  React.useEffect(() => {
    if (!open) {
      setSelected([]);
      setGlobalFrom(todayStr());
      setGlobalTo(todayStr());
      setRanges({});
      setTouched(false);
    }
  }, [open]);

  // preselect from site
  const preselected = React.useMemo(() => {
    const prior = site?.constructionSiteVehicles ?? [];
    const resultIds: number[] = [];
    const resultMap: Record<number, VehRange> = {};

    if (!prior.length) return { ids: resultIds, map: resultMap };

    const byName = new Map(
      employeeRows.map((e: any) => [
        fullName(e.firstName, e.lastName),
        Number(e.id),
      ])
    );

    for (const v of prior) {
      const id = Number((v as any).id);
      if (!Number.isFinite(id)) continue;
      resultIds.push(id);
      const respId = v.responsibleEmployeeName
        ? byName.get(v.responsibleEmployeeName)
        : undefined;
      resultMap[id] = {
        from: v.dateFrom ?? todayStr(),
        to: v.dateTo ?? todayStr(),
        custom: true,
        responsibleEmployeeId: respId ?? null,
      };
    }
    return { ids: resultIds, map: resultMap };
  }, [site, employeeRows]);

  React.useEffect(() => {
    if (!open || touched) return;
    setSelected(preselected.ids);
    setRanges(preselected.map);
  }, [open, preselected, touched]);

  React.useEffect(() => {
    if (!open || selected.length === 0) return;
    const existing = new Set(vehiclesRows.map((x: any) => Number(x.id)));
    const filtered = selected.filter((id) => existing.has(id));
    if (filtered.length !== selected.length) {
      setSelected(filtered);
      setRanges((old) => {
        const next: Record<number, VehRange> = {};
        filtered.forEach((id) => {
          if (old[id]) next[id] = old[id];
        });
        return next;
      });
    }
  }, [vehiclesRows, open, selected]);

  const markTouched = () => setTouched(true);

  const toggleVehicle = (id: number) => {
    markTouched();
    setSelected((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      setRanges((old) => {
        const has = old[id];
        if (next.includes(id) && !has) {
          return {
            ...old,
            [id]: {
              from: globalFrom,
              to: globalTo,
              custom: false,
              responsibleEmployeeId: null,
            },
          };
        }
        return old;
      });
      return next;
    });
  };

  const applyGlobal = (nextFrom: string, nextTo: string) => {
    setRanges((old) => {
      const updated: Record<number, VehRange> = { ...old };
      selected.forEach((id) => {
        const r = updated[id] ?? {
          from: globalFrom,
          to: globalTo,
          custom: false,
          responsibleEmployeeId: null,
        };
        if (!r.custom) updated[id] = { ...r, from: nextFrom, to: nextTo };
      });
      return updated;
    });
  };

  const onChangeGlobalFrom = (v: string) => {
    markTouched();
    setGlobalFrom(v);
    applyGlobal(v, globalTo);
  };
  const onChangeGlobalTo = (v: string) => {
    markTouched();
    setGlobalTo(v);
    applyGlobal(globalFrom, v);
  };

  const setVehFrom = (id: number, v: string) => {
    markTouched();
    setRanges((old) => {
      const prev = old[id] ?? {
        from: globalFrom,
        to: globalTo,
        custom: false,
        responsibleEmployeeId: null,
      };
      return { ...old, [id]: { ...prev, from: v, custom: true } };
    });
  };
  const setVehTo = (id: number, v: string) => {
    markTouched();
    setRanges((old) => {
      const prev = old[id] ?? {
        from: globalFrom,
        to: globalTo,
        custom: false,
        responsibleEmployeeId: null,
      };
      return { ...old, [id]: { ...prev, to: v, custom: true } };
    });
  };
  const resetVehToGlobal = (id: number) => {
    markTouched();
    setRanges((old) => {
      const r = old[id] ?? {
        from: globalFrom,
        to: globalTo,
        custom: false,
        responsibleEmployeeId: null,
      };
      return {
        ...old,
        [id]: { ...r, from: globalFrom, to: globalTo, custom: false },
      };
    });
  };

  const setResponsible = (id: number, employeeId: number | null) => {
    markTouched();
    setRanges((old) => {
      const prev = old[id] ?? {
        from: globalFrom,
        to: globalTo,
        custom: false,
        responsibleEmployeeId: null,
      };
      return { ...old, [id]: { ...prev, responsibleEmployeeId: employeeId } };
    });
  };

  const allRangesValid = React.useMemo(() => {
    if (!isValidRange(globalFrom, globalTo)) return false;
    for (const id of selected) {
      const r = ranges[id] ?? { from: globalFrom, to: globalTo };
      if (!isValidRange(r.from, r.to)) return false;
    }
    return true;
  }, [selected, ranges, globalFrom, globalTo]);

  const handleSave = () => {
    if (selected.length > 0 && !allRangesValid) return;

    const payload = {
      constructionSiteId,
      vehicles:
        selected.length === 0
          ? []
          : selected.map((vehicleId) => {
              const r = ranges[vehicleId] ?? {
                from: globalFrom,
                to: globalTo,
                responsibleEmployeeId: null,
              };
              return {
                vehicleId,
                dateFrom: r.from,
                dateTo: r.to,
                responsibleEmployeeId: r.responsibleEmployeeId ?? 0,
              };
            }),
    };
    // optional: filter out entries without responsible
    // payload.vehicles = payload.vehicles.filter(x => x.responsibleEmployeeId)

    assign.mutate(payload as any, { onSuccess: onClose });
  };

  const loading = empLoading || vehLoading;
  const hasError = empError || vehError;

  const isCustom = React.useMemo(() => {
    if (selected.length === 0) return false;
    return selected.some((id) => {
      const r = ranges[id] ?? { from: globalFrom, to: globalTo };
      return r.from !== globalFrom || r.to !== globalTo;
    });
  }, [selected, ranges, globalFrom, globalTo]);

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
      <DialogTitle>
        {t("constructionSites.assign.vehiclesTitle", {
          defaultValue: "Dodjela vozila",
        })}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : hasError ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">
              {t("constructionSites.assign.loadError")}
            </Typography>
          </Box>
        ) : vehiclesRows.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">
              {t("constructionSites.assign.noVehicles", {
                defaultValue: "Nema dostupnih vozila.",
              })}
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
            {/* LEFT: vehicles list */}
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
                  {t("constructionSites.assign.left.vehiclesCount", {
                    defaultValue: "Vozila: {{count}}",
                    count: vehiclesRows.length,
                  })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("constructionSites.assign.left.selectedCount", {
                    count: selected.length,
                  })}
                </Typography>
              </Stack>
              <Divider sx={{ mb: 1 }} />

              <Stack spacing={0.5}>
                {vehiclesRows.map((v: any) => {
                  const id = Number(v.id);
                  const checked = selected.includes(id);
                  const name = v.name ?? `ID ${id}`;
                  const reg = v.registrationNumber
                    ? ` • ${v.registrationNumber}`
                    : "";

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
                        onChange={() => toggleVehicle(id)}
                        sx={{ mr: 1 }}
                      />
                      <Box
                        onClick={() => toggleVehicle(id)}
                        sx={{ cursor: "pointer", minWidth: 0, flex: 1 }}
                        title={name}
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
                          {name}
                        </Typography>
                        {reg && (
                          <Typography variant="caption" color="text.secondary">
                            {reg}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            {/* RIGHT: global + per-item details */}
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
                  label={t("constructionSites.assign.global.startLabel")}
                  type="date"
                  size="small"
                  value={globalFrom}
                  onChange={(e) => onChangeGlobalFrom(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label={t("constructionSites.assign.global.endLabel")}
                  type="date"
                  size="small"
                  value={globalTo}
                  onChange={(e) => onChangeGlobalTo(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <Chip
                  label={
                    isCustom
                      ? t("constructionSites.assign.chip.custom")
                      : t("constructionSites.assign.chip.global")
                  }
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
                  <Box>
                    {t("constructionSites.assign.grid.vehicle", {
                      defaultValue: "Vozilo",
                    })}
                  </Box>
                  <Box>{t("constructionSites.assign.grid.start")}</Box>
                  <Box>{t("constructionSites.assign.grid.end")}</Box>
                  <Box>
                    {t("constructionSites.assign.grid.responsible", {
                      defaultValue: "Odgovorna osoba",
                    })}
                  </Box>
                  <Box>{t("constructionSites.assign.grid.reset")}</Box>
                </Box>
              )}

              {selected.length === 0 ? (
                <Typography color="text.secondary">
                  {t("constructionSites.assign.pickVehicleHint", {
                    defaultValue: "Odaberite vozilo(a) s lijeve strane.",
                  })}
                </Typography>
              ) : (
                <Stack spacing={1} sx={{ maxHeight: 420, overflowY: "auto" }}>
                  {selected.map((id) => {
                    const v = vehiclesRows.find(
                      (x: any) => Number(x.id) === id
                    );
                    const title = v?.name ?? `ID ${id}`;
                    const r = ranges[id] ?? {
                      from: globalFrom,
                      to: globalTo,
                      custom: false,
                      responsibleEmployeeId: null,
                    };
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
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: DETAIL_GRID_MD,
                          },
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
                            title={title}
                          >
                            {title}
                          </Typography>
                          {v?.registrationNumber && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.25 }}
                            >
                              Reg.: {v.registrationNumber}
                            </Typography>
                          )}
                        </Box>

                        <TextField
                          label={t("constructionSites.assign.grid.start")}
                          type="date"
                          size="small"
                          value={r.from}
                          onChange={(ev) => setVehFrom(id, ev.target.value)}
                          InputLabelProps={{ shrink: true }}
                          error={!isValidRange(r.from, r.to)}
                        />
                        <TextField
                          label={t("constructionSites.assign.grid.end")}
                          type="date"
                          size="small"
                          value={r.to}
                          onChange={(ev) => setVehTo(id, ev.target.value)}
                          InputLabelProps={{ shrink: true }}
                          error={!isValidRange(r.from, r.to)}
                        />

                        <Autocomplete
                          size="small"
                          options={employeeRows as any[]}
                          getOptionLabel={(e: any) =>
                            fullName(e.firstName, e.lastName) || `ID ${e.id}`
                          }
                          value={
                            r.responsibleEmployeeId
                              ? (employeeRows as any[]).find(
                                  (e) =>
                                    Number(e.id) === r.responsibleEmployeeId
                                ) ?? null
                              : null
                          }
                          onChange={(_, val: any | null) =>
                            setResponsible(id, val ? Number(val.id) : null)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t(
                                "constructionSites.assign.grid.responsible",
                                { defaultValue: "Odgovorna osoba" }
                              )}
                            />
                          )}
                        />

                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Tooltip
                            title={t(
                              "constructionSites.assign.tooltip.resetToGlobal"
                            )}
                          >
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => resetVehToGlobal(id)}
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

      <DialogActions sx={{ p: 2 }}>
        {selected.length > 0 && !allRangesValid && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mr: "auto", pl: 1 }}
          >
            {t("constructionSites.assign.validation.invalidRange")}
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
          {t("constructionSites.assign.actions.cancel")}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={
            assign.isPending ||
            empLoading ||
            vehLoading ||
            empError ||
            vehError ||
            (selected.length > 0 && !allRangesValid)
          }
        >
          {assign.isPending
            ? t("constructionSites.assign.actions.saving")
            : t("constructionSites.assign.actions.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
