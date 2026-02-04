import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Skeleton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AssignTaskDialog } from "../../../components/ui/assign-dialog/AssignTaskDialog";
import { useUpsertConstructionSiteEmployeeWorkLogs } from "../../construction_site/hooks/useUpsertConstructionSiteEmployeeWorkLogs";
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
  const { t } = useTranslation();
  const { mutateAsync: upsert, isPending } =
    useUpsertConstructionSiteEmployeeWorkLogs();
  const { isAdmin, employeeId } = useCurrentEmployeeContext();

  const { options: siteOptions, isLoading: sitesLoading } =
    useConstructionSiteOptions();
  const { options: employeeOptions, isLoading: employeesLoading } =
    useEmployeeOptions();

  const [constructionSiteId, setConstructionSiteId] = useState<number | "">("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">("");

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

  useEffect(() => {
    if (open) {
      if (employeeId && !selectedEmployeeId) {
        setSelectedEmployeeId(employeeId);
      }
      if (defaultDate) {
        setWorkDate(defaultDate);
      }
    }
  }, [open]);

  const handleSubmit = async () => {
    if (
      constructionSiteId === "" ||
      selectedEmployeeId === "" ||
      !workDate ||
      !startTime ||
      !endTime
    ) {
      return;
    }

    try {
      await upsert({
        constructionSiteId: Number(constructionSiteId),
        employeeId: Number(selectedEmployeeId),
        workLogs: [
          {
            workDate: format(workDate, "yyyy-MM-dd"),
            startTime: format(startTime, "HH:mm:ss"),
            endTime: format(endTime, "HH:mm:ss"),
          },
        ],
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const formLoading = sitesLoading || employeesLoading;
  const submitDisabled =
    constructionSiteId === "" ||
    selectedEmployeeId === "" ||
    !workDate ||
    !startTime ||
    !endTime;

  return (
    <AssignTaskDialog
      open={open}
      onClose={onClose}
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
              value={selectedEmployeeId}
              label={t("assignments.filterByEmployee")}
              onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
              disabled={!isAdmin}
            >
              {employeeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
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
            ampm={false}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
          <TimePicker
            label={t("workHours.endTime")}
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            ampm={false}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Stack>
      </Stack>
    </AssignTaskDialog>
  );
}
