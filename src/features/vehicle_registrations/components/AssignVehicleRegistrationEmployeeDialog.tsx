import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { AssignTaskDialog } from "../../../components/ui/assign-dialog/AssignTaskDialog";

type Option = { label: string; value: number };

export function AssignVehicleRegistrationEmployeeDialog(props: {
  open: boolean;
  onClose: () => void;

  referenceText?: string;
  dueLabel?: string;
  vehicleName?: string;
  registrationNumber?: string;
  vehicleLoading?: boolean;

  employeeOptions: Option[];
  employeesLoading: boolean;
  employeesError: boolean;

  formLoading: boolean;
  existingAssignment?: {
    employeeId?: number | null;
    note?: string | null;
  } | null;

  submitting: boolean;

  onSubmit: (
    values: { employeeId: number; note: string },
    mode: "create" | "update"
  ) => void;
}) {
  const {
    open,
    onClose,
    referenceText,
    dueLabel,
    vehicleName,
    registrationNumber,
    vehicleLoading,

    employeeOptions,
    employeesLoading,
    employeesError,

    formLoading,
    existingAssignment,

    submitting,
    onSubmit,
  } = props;

  const { t } = useTranslation();
  const theme = useTheme();

  const hasExistingAssignment = !!existingAssignment;

  const [values, setValues] = React.useState<{
    employeeId: number | "";
    note: string;
  }>({
    employeeId: "",
    note: "",
  });

  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setIsEditing(false);
    setValues({ employeeId: "", note: "" });
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    if (!existingAssignment) return;
    if (isEditing) return;

    setValues({
      employeeId: existingAssignment.employeeId ?? "",
      note: existingAssignment.note ?? "",
    });
  }, [open, existingAssignment, isEditing]);

  const formDisabled = formLoading || (hasExistingAssignment && !isEditing);

  const submitDisabled =
    formLoading ||
    submitting ||
    employeesLoading ||
    employeesError ||
    values.employeeId === "" ||
    (hasExistingAssignment && !isEditing);

  const mode: "create" | "update" = hasExistingAssignment ? "update" : "create";

  return (
    <AssignTaskDialog
      open={open}
      onClose={onClose}
      formLoading={formLoading}
      formDisabled={formDisabled}
      title={
        hasExistingAssignment
          ? t("vehicleRegistrationEmployees.assign.alreadyAssignedTitle")
          : t("vehicleRegistrationEmployees.assign.title")
      }
      subtitle={t("vehicleRegistrationEmployees.assign.subtitle")}
      referenceText={referenceText}
      previewTitle={t("vehicleRegistrationEmployees.assign.previewTitle")}
      previewSubtitle={t("vehicleRegistrationEmployees.assign.previewSubtitle")}
      dueLabel={dueLabel}
      previewFields={[
        {
          label: t("vehicleRegistrationEmployees.assign.fields.vehicle"),
          value: vehicleName ? vehicleName : vehicleLoading ? t("") : "-",
        },
        {
          label: t("vehicleRegistrationEmployees.assign.fields.registration"),
          value: registrationNumber
            ? registrationNumber
            : vehicleLoading
            ? t("")
            : "-",
        },
      ]}
      headerActions={
        hasExistingAssignment ? (
          <Button
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", fontWeight: 600 }}
            onClick={() => setIsEditing(true)}
            disabled={submitting || formLoading || isEditing}
          >
            {t("common.edit")}
          </Button>
        ) : null
      }
      cancelText={t("common.cancel")}
      submitText={
        hasExistingAssignment
          ? isEditing
            ? t("common.submit")
            : t("vehicleRegistrationEmployees.assign.alreadyAssignedSubmit")
          : t("common.submit")
      }
      submitting={submitting}
      submitDisabled={submitDisabled}
      onSubmit={() => {
        if (values.employeeId === "") return;
        onSubmit(
          { employeeId: values.employeeId as number, note: values.note },
          mode
        );
      }}
    >
      <Stack spacing={2}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
          {t("vehicleRegistrationEmployees.assign.assignmentTitle")}
        </Typography>

        {formLoading ? (
          <Box>
            <Skeleton variant="text" width={140} />
            <Skeleton variant="rounded" height={40} />
          </Box>
        ) : (
          <FormControl
            fullWidth
            size="small"
            disabled={formDisabled || submitting}
          >
            <InputLabel id="vehicle-reg-assign-employee-label">
              {t("vehicleRegistrationEmployees.assign.employee")}
            </InputLabel>
            <Select
              labelId="vehicle-reg-assign-employee-label"
              label={t("vehicleRegistrationEmployees.assign.employee")}
              value={values.employeeId}
              onChange={(e) =>
                setValues((p) => ({
                  ...p,
                  employeeId: e.target.value as number,
                }))
              }
              sx={{
                borderRadius: 1,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E5E7EB",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D1D5DB",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                },
                backgroundColor: "#fff",
              }}
            >
              {employeeOptions.map((emp) => (
                <MenuItem key={emp.value} value={emp.value}>
                  {emp.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {formLoading ? (
          <Box>
            <Skeleton variant="text" width={160} />
            <Skeleton variant="rounded" height={90} />
          </Box>
        ) : (
          <TextField
            disabled={formDisabled || submitting}
            size="small"
            label={t("vehicleRegistrationEmployees.assign.note")}
            value={values.note}
            onChange={(e) => setValues((p) => ({ ...p, note: e.target.value }))}
            multiline
            minRows={3}
            placeholder={t(
              "vehicleRegistrationEmployees.assign.notePlaceholder"
            )}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: 1,
              },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D1D5DB",
              },
              "& .MuiInputLabel-root": { color: "#6B7280" },
            }}
          />
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.25,
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.info.main, 0.08),
            border: `1px solid ${alpha(theme.palette.info.main, 0.14)}`,
            opacity: formDisabled ? 0.7 : 1,
          }}
        >
          <Typography sx={{ fontSize: 12.5, color: "#111827" }}>
            {hasExistingAssignment
              ? t("vehicleRegistrationEmployees.assign.alreadyAssignedHelper")
              : t("vehicleRegistrationEmployees.assign.helper")}
          </Typography>
        </Box>
      </Stack>
    </AssignTaskDialog>
  );
}
