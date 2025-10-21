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

import { useTools } from "../../tools/hooks/useTools";
import { useConstructionSite } from "../hooks/useConstructionSite";

import { isValidRange, todayStr } from "../utils/dates";
import { useAssignToolsToConstructionSite } from "../hooks/useAssignToolsToConstructionSite";
import { fullName } from "../utils/name";

type ToolRange = {
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

export default function AssignToolsDialog({
  constructionSiteId,
  open,
  onClose,
}: Props) {
  const { t } = useTranslation();

  const { data: site } = useConstructionSite(constructionSiteId);
  const {
    employeeRows,
    isLoading: empLoading,
    isError: empError,
  } = useEmployees();
  const { toolsRows, isLoading: toolLoading, isError: toolError } = useTools();

  const assign = useAssignToolsToConstructionSite();

  const [selected, setSelected] = React.useState<number[]>([]);
  const [globalFrom, setGlobalFrom] = React.useState<string>(todayStr());
  const [globalTo, setGlobalTo] = React.useState<string>(todayStr());
  const [ranges, setRanges] = React.useState<Record<number, ToolRange>>({});
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

  const preselected = React.useMemo(() => {
    const prior = site?.constructionSiteTools ?? [];
    const resultIds: number[] = [];
    const resultMap: Record<number, ToolRange> = {};
    if (!prior.length) return { ids: resultIds, map: resultMap };

    const norm = (s: string) =>
      s
        ?.normalize?.("NFKD")
        ?.replace(/\p{Diacritic}/gu, "")
        ?.trim()
        ?.toLowerCase?.() ?? "";
    const byName = new Map(
      (employeeRows ?? []).map((e: any) => [
        norm(fullName(e.firstName, e.lastName)),
        Number(e.id),
      ])
    );

    for (const t of prior) {
      const toolId = Number((t as any).id);
      if (!Number.isFinite(toolId)) continue;
      resultIds.push(toolId);

      let respId: number | null | undefined = t.responsibleEmployeeId;
      if (respId == null && t.responsibleEmployeeName) {
        respId = byName.get(norm(t.responsibleEmployeeName));
      }

      resultMap[toolId] = {
        from: t.dateFrom ?? todayStr(),
        to: t.dateTo ?? todayStr(),
        custom: true,
        responsibleEmployeeId: Number.isFinite(Number(respId))
          ? Number(respId)
          : null,
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
    const existing = new Set(toolsRows.map((t: any) => Number(t.id)));
    const filtered = selected.filter((id) => existing.has(id));
    if (filtered.length !== selected.length) {
      setSelected(filtered);
      setRanges((old) => {
        const next: Record<number, ToolRange> = {};
        filtered.forEach((id) => {
          if (old[id]) next[id] = old[id];
        });
        return next;
      });
    }
  }, [toolsRows, open, selected]);

  const markTouched = () => setTouched(true);

  const toggleTool = (id: number) => {
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
      const updated: Record<number, ToolRange> = { ...old };
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

  const setToolFrom = (id: number, v: string) => {
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
  const setToolTo = (id: number, v: string) => {
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
  const resetToolToGlobal = (id: number) => {
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
      tools:
        selected.length === 0
          ? []
          : selected.map((toolId) => {
              const r = ranges[toolId] ?? {
                from: globalFrom,
                to: globalTo,
                responsibleEmployeeId: null,
              };
              return {
                toolId,
                dateFrom: r.from,
                dateTo: r.to,
                responsibleEmployeeId: r.responsibleEmployeeId ?? 0,
              };
            }),
    };

    assign.mutate(payload as any, { onSuccess: onClose });
  };

  const loading = empLoading || toolLoading;
  const hasError = empError || toolError;

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
        {t("constructionSites.assign.toolsTitle", {
          defaultValue: "Dodjela alata",
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
        ) : toolsRows.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">
              {t("constructionSites.assign.noTools", {
                defaultValue: "Nema dostupnih alata.",
              })}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
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
                  {t("constructionSites.assign.left.toolsCount", {
                    defaultValue: "Alati: {{count}}",
                    count: toolsRows.length,
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
                {toolsRows.map((tool: any) => {
                  const id = Number(tool.id);
                  const checked = selected.includes(id);
                  const name = tool.name ?? `ID ${id}`;
                  const inv = tool.inventoryNumber
                    ? ` • ${tool.inventoryNumber}`
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
                        onChange={() => toggleTool(id)}
                        sx={{ mr: 1 }}
                      />
                      <Box
                        onClick={() => toggleTool(id)}
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
                        {inv && (
                          <Typography variant="caption" color="text.secondary">
                            {inv}
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
                    {t("constructionSites.assign.grid.tool", {
                      defaultValue: "Alat",
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
                  {t("constructionSites.assign.pickToolHint", {
                    defaultValue: "Odaberite alat(e) s lijeve strane.",
                  })}
                </Typography>
              ) : (
                <Stack spacing={1} sx={{ maxHeight: 420, overflowY: "auto" }}>
                  {selected.map((id) => {
                    const tool = toolsRows.find(
                      (x: any) => Number(x.id) === id
                    );
                    const title = tool?.name ?? `ID ${id}`;
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
                          {tool?.inventoryNumber && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.25 }}
                            >
                              Inv. br.: {tool.inventoryNumber}
                            </Typography>
                          )}
                        </Box>

                        <TextField
                          //label={t("constructionSites.assign.grid.start")}
                          type="date"
                          size="small"
                          value={r.from}
                          onChange={(ev) => setToolFrom(id, ev.target.value)}
                          InputLabelProps={{ shrink: true }}
                          error={!isValidRange(r.from, r.to)}
                        />
                        <TextField
                          //label={t("constructionSites.assign.grid.end")}
                          type="date"
                          size="small"
                          value={r.to}
                          onChange={(ev) => setToolTo(id, ev.target.value)}
                          InputLabelProps={{ shrink: true }}
                          error={!isValidRange(r.from, r.to)}
                        />

                        <Autocomplete
                          size="small"
                          options={(employeeRows as any[]) ?? []}
                          getOptionLabel={(e: any) =>
                            e ? fullName(e.firstName, e.lastName) : ""
                          }
                          isOptionEqualToValue={(opt: any, val: any) =>
                            Number(opt?.id) === Number(val?.id)
                          }
                          value={
                            r.responsibleEmployeeId != null
                              ? (employeeRows as any[]).find(
                                  (e) =>
                                    Number(e.id) ===
                                    Number(r.responsibleEmployeeId)
                                ) ?? null
                              : null
                          }
                          onChange={(_, val: any | null) =>
                            setResponsible(id, val ? Number(val.id) : null)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              /*  label={t(
                                "constructionSites.assign.grid.responsible",
                                {
                                  defaultValue: "Odgovorna osoba",
                                }
                              )} */
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
                                onClick={() => resetToolToGlobal(id)}
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
            loading ||
            hasError ||
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
