import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Skeleton,
  Checkbox,
  ListItemText,
  Box,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AssignTaskDialog } from "../../../components/ui/assign-dialog/AssignTaskDialog";
import { useUpsertConstructionSiteEmployeeWorkLogsBulk } from "../../construction_site/hooks/useUpsertConstructionSiteEmployeeWorkLogsBulk";
import { useCurrentEmployeeContext } from "../../auth/hooks/useCurrentEmployeeContext";
import { useConstructionSiteOptions } from "../../constants/options/useConstructionSiteOptions";
import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";
import { format } from "date-fns";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultDate?: Date;
};

export default function WorkHoursCreateDialog({
  open,
  onClose,
  defaultDate,
}: Props) {
  const { t, i18n } = useTranslation();
  const { mutateAsync: upsertBulk, isPending } =
    useUpsertConstructionSiteEmployeeWorkLogsBulk();
  const { isAdmin, employeeId } = useCurrentEmployeeContext();

  const { options: siteOptions, isLoading: sitesLoading } =
    useConstructionSiteOptions();
  const { options: employeeOptions, isLoading: employeesLoading } =
    useEmployeeOptions();

  const [constructionSiteId, setConstructionSiteId] = useState<number | "">("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);

  const [workDate, setWorkDate] = useState<Date | null>(
    defaultDate ?? new Date(),
  );

  const [startTime, setStartTime] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });
  const [endTime, setEndTime] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(16, 0, 0, 0);
    return d;
  });

  const resetForm = () => {
    setConstructionSiteId("");
    if (isAdmin) {
      setSelectedEmployeeIds([]);
    }
    setWorkDate(defaultDate ?? new Date());
    const start = new Date();
    start.setHours(8, 0, 0, 0);
    setStartTime(start);
    const end = new Date();
    end.setHours(16, 0, 0, 0);
    setEndTime(end);
  };

  useEffect(() => {
    if (open) {
      if (employeeId && selectedEmployeeIds.length === 0 && !isAdmin) {
        setSelectedEmployeeIds([employeeId]);
      }
      if (defaultDate) {
        setWorkDate(defaultDate);
      }
    }
  }, [open, employeeId, selectedEmployeeIds.length, defaultDate, isAdmin]);

  const handleSubmit = async () => {
    if (
      constructionSiteId === "" ||
      selectedEmployeeIds.length === 0 ||
      !workDate ||
      !startTime ||
      !endTime
    ) {
      return;
    }

    try {
      await upsertBulk({
        entries: selectedEmployeeIds.map((empId) => ({
          constructionSiteId: Number(constructionSiteId),
          employeeId: empId,
          workLogs: [
            {
              workDate: format(workDate, "yyyy-MM-dd"),
              startTime: format(startTime, "HH:mm:ss"),
              endTime: format(endTime, "HH:mm:ss"),
            },
          ],
        })),
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const formLoading = sitesLoading || employeesLoading;
  const submitDisabled =
    constructionSiteId === "" ||
    selectedEmployeeIds.length === 0 ||
    !workDate ||
    !startTime ||
    !endTime;

  const isTwelveHourClock = useMemo(
    () => i18n.language?.startsWith("en"),
    [i18n.language],
  );

  return (
    <AssignTaskDialog
      open={open}
      onClose={onClose}
      onExited={resetForm}
      title={t("workHours.record")}
      subtitle={t("workHours.employee.createSubtitle")}
      submitText={t("common.save")}
      submitting={isPending}
      submitDisabled={submitDisabled || formLoading}
      formLoading={formLoading}
      onSubmit={handleSubmit}
      previewFields={[]}
    >
      <Stack spacing={2}>
        {formLoading ? (
          <Skeleton variant="rounded" height={56} />
        ) : (
          <FormControl fullWidth size="small">
            <InputLabel id="wh-site-label">
              {t("constructionSites.list.filterBySite")}
            </InputLabel>
            <Select
              labelId="wh-site-label"
              value={constructionSiteId}
              label={t("constructionSites.list.filterBySite")}
              onChange={(e) => setConstructionSiteId(Number(e.target.value))}
            >
              {siteOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {formLoading ? (
          <Skeleton variant="rounded" height={56} />
        ) : (
          <FormControl fullWidth size="small">
            <InputLabel id="wh-employee-label">
              {t("assignments.filterByEmployee")}
            </InputLabel>
            <Select
              labelId="wh-employee-label"
              value={selectedEmployeeIds}
              label={t("assignments.filterByEmployee")}
              multiple
              onChange={(e) => {
                const val = e.target.value;
                if (typeof val === "string") {
                  // handle clean or weird case
                  setSelectedEmployeeIds([]);
                } else {
                  setSelectedEmployeeIds(val as number[]);
                }
              }}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const opt = employeeOptions.find((o) => o.value === value);
                    return <Chip key={value} label={opt?.label ?? value} size="small" />;
                  })}
                </Box>
              )}
              disabled={!isAdmin}
            >
              {employeeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Checkbox checked={selectedEmployeeIds.indexOf(opt.value) > -1} />
                  <ListItemText primary={opt.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <DatePicker
          label={t("workHours.date")}
          value={workDate}
          onChange={(newValue) => setWorkDate(newValue)}
          slotProps={{ textField: { size: "small", fullWidth: true } }}
        />

        <Stack direction="row" spacing={2}>
          <TimePicker
            label={t("workHours.startTime")}
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            ampm={isTwelveHourClock}
            ampmInClock={isTwelveHourClock}
            format={isTwelveHourClock ? "hh:mm a" : "HH:mm"}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
          <TimePicker
            label={t("workHours.endTime")}
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            ampm={isTwelveHourClock}
            ampmInClock={isTwelveHourClock}
            format={isTwelveHourClock ? "hh:mm a" : "HH:mm"}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Stack>
      </Stack>
    </AssignTaskDialog>
  );
}
