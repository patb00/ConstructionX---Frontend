import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  alpha,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
  Skeleton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export type AssignTaskPreviewField = {
  label: string;
  value: React.ReactNode;
  minWidth?: number;
};

export type AssignTaskDialogValues = {
  employeeId: number | "";
  note: string;
};

export type AssignTaskEmployeeOption = {
  label: string;
  value: number;
};

type Props = {
  open: boolean;
  onClose: () => void;

  title?: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  referenceText?: string;

  previewTitle?: string;
  previewSubtitle?: string;
  dueLabel?: string;
  dueTone?: "warning" | "info" | "neutral";
  previewFields?: AssignTaskPreviewField[];

  employeeLabel?: string;
  employeeOptions: AssignTaskEmployeeOption[];
  values: AssignTaskDialogValues;
  onChange: (next: AssignTaskDialogValues) => void;

  noteLabel?: string;
  notePlaceholder?: string;
  helperText?: string;

  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
  submitting?: boolean;
  submitDisabled?: boolean;

  submitVariant?: "primary" | "danger";

  formLoading?: boolean;
  formDisabled?: boolean;

  showEdit?: boolean;
  onEdit?: () => void;
  isEditing?: boolean;
};

export function AssignTaskDialog({
  open,
  onClose,

  title,
  subtitle,
  headerIcon,
  referenceText,

  previewTitle,
  previewSubtitle,
  dueLabel,
  dueTone = "warning",
  previewFields = [],

  employeeLabel,
  employeeOptions,
  values,
  onChange,

  noteLabel,
  notePlaceholder,
  helperText,

  submitText,
  cancelText,
  onSubmit,
  submitting = false,
  submitDisabled,

  submitVariant = "primary",

  formLoading = false,
  formDisabled,

  showEdit = false,
  isEditing = false,
  onEdit,
}: Props) {
  const theme = useTheme();

  const { t } = useTranslation();

  const resolvedTitle = title ?? t("vehicleRegistrationEmployees.assign.title");
  const resolvedPreviewTitle =
    previewTitle ?? t("vehicleRegistrationEmployees.assign.previewTitle");
  const resolvedPreviewSubtitle =
    previewSubtitle ?? t("vehicleRegistrationEmployees.assign.previewSubtitle");
  const resolvedEmployeeLabel =
    employeeLabel ?? t("vehicleRegistrationEmployees.assign.employee");
  const resolvedNoteLabel =
    noteLabel ?? t("vehicleRegistrationEmployees.assign.note");
  const resolvedNotePlaceholder =
    notePlaceholder ?? t("vehicleRegistrationEmployees.assign.notePlaceholder");
  const resolvedHelperText =
    helperText ?? t("vehicleRegistrationEmployees.assign.helper");
  const resolvedSubmitText = submitText ?? t("common.submit");
  const resolvedCancelText = cancelText ?? t("common.cancel");

  const chipStyles =
    dueTone === "info"
      ? {
          backgroundColor: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.dark,
          border: `1px solid ${alpha(theme.palette.info.main, 0.18)}`,
          "& .MuiChip-icon": { color: theme.palette.info.dark },
        }
      : dueTone === "neutral"
      ? {
          backgroundColor: "#F3F4F6",
          color: "#111827",
          border: "1px solid #E5E7EB",
          "& .MuiChip-icon": { color: "#111827" },
        }
      : {
          backgroundColor: alpha(theme.palette.warning.main, 0.12),
          color: theme.palette.warning.dark,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.18)}`,
          "& .MuiChip-icon": { color: theme.palette.warning.dark },
        };

  const effectiveSubmitDisabled =
    submitDisabled ?? (values.employeeId === "" || submitting);

  const handleDialogClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleExplicitClose = () => {
    if (submitting) return;
    onClose();
  };

  const submitSx =
    submitVariant === "danger"
      ? {
          textTransform: "none",
          fontWeight: 600,
          px: 2.5,
          backgroundColor: "#F43F5E",
          "&:hover": { backgroundColor: "#E11D48" },
        }
      : {
          textTransform: "none",
          fontWeight: 600,
          px: 2.5,
          backgroundColor: theme.palette.primary.main,
          "&:hover": { backgroundColor: theme.palette.primary.dark },
        };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      keepMounted
      PaperProps={{
        sx: {
          position: "relative",
          p: 2.5,
          pt: 2.25,
          pb: 2.5,
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              display: "grid",
              placeItems: "center",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            }}
          >
            {headerIcon ?? <AssignmentOutlinedIcon sx={{ fontSize: 18 }} />}
          </Box>

          <Box>
            <DialogTitle
              sx={{
                m: 0,
                p: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              {resolvedTitle}
            </DialogTitle>

            {(subtitle || referenceText) && (
              <Typography sx={{ fontSize: 12.5, color: "#6B7280", mt: 0.25 }}>
                {referenceText
                  ? `${referenceText}${subtitle ? " · " : ""}`
                  : ""}
                {subtitle ?? ""}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            onClick={handleExplicitClose}
            disabled={submitting}
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
      </Box>

      <DialogContent sx={{ p: 0, mb: 2 }}>
        <Stack spacing={2}>
          <Box
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 1,
              backgroundColor: "#ffffff",
              p: 1.75,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}
                >
                  {resolvedPreviewTitle}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#6B7280", mt: 0.25 }}>
                  {resolvedPreviewSubtitle}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {dueLabel && (
                  <Chip
                    size="small"
                    icon={<EventOutlinedIcon />}
                    label={dueLabel}
                    sx={{
                      height: 26,
                      fontSize: 12,
                      borderRadius: 999,
                      ...chipStyles,
                    }}
                  />
                )}
                {showEdit && (
                  <Tooltip title={t("common.edit")}>
                    <span>
                      <IconButton
                        size="small"
                        onClick={onEdit}
                        disabled={submitting || formLoading || isEditing}
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1,
                          color: "#6B7280",
                          border: "1px solid #E5E7EB",
                          backgroundColor: "#ffffff",
                          "&:hover": {
                            backgroundColor: "#F9FAFB",
                            color: theme.palette.primary.main,
                          },
                          "&.Mui-disabled": {
                            color: "#9CA3AF",
                            borderColor: "#E5E7EB",
                          },
                        }}
                      >
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Box>
            </Box>

            {previewFields.length > 0 && (
              <>
                <Box sx={{ height: 1, backgroundColor: "#E5E7EB", my: 1.5 }} />
                <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                  {previewFields.map((f, idx) => (
                    <Box
                      key={`${f.label}-${idx}`}
                      sx={{ minWidth: f.minWidth ?? 180 }}
                    >
                      <Typography sx={{ fontSize: 11.5, color: "#6B7280" }}>
                        {f.label}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
                      >
                        {f.value}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </>
            )}
          </Box>

          <Box
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 1,
              backgroundColor: "#ffffff",
              p: 1.75,
            }}
          >
            <Stack spacing={2}>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}
              >
                {t("vehicleRegistrationEmployees.assign.assignmentTitle")}
              </Typography>

              {formLoading ? (
                <Box>
                  <Skeleton variant="text" width={120} />
                  <Skeleton variant="rounded" height={40} />
                </Box>
              ) : (
                <FormControl fullWidth size="small">
                  <InputLabel id="assign-task-employee-label">
                    {resolvedEmployeeLabel}
                  </InputLabel>
                  <Select
                    disabled={formDisabled || submitting}
                    labelId="assign-task-employee-label"
                    value={values.employeeId}
                    label={resolvedEmployeeLabel}
                    onChange={(e) =>
                      onChange({
                        ...values,
                        employeeId: e.target.value as number,
                      })
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
                  <Skeleton variant="text" width={140} />
                  <Skeleton variant="rounded" height={90} />
                </Box>
              ) : (
                <TextField
                  disabled={formDisabled || submitting}
                  size="small"
                  label={resolvedNoteLabel}
                  value={values.note}
                  onChange={(e) =>
                    onChange({ ...values, note: e.target.value })
                  }
                  multiline
                  minRows={3}
                  placeholder={resolvedNotePlaceholder}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 1,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#E5E7EB",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D1D5DB",
                    },
                    "& .MuiInputLabel-root": { color: "#6B7280" },
                  }}
                />
              )}

              {resolvedHelperText && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.25,
                    borderRadius: 1,
                    backgroundColor: alpha(theme.palette.info.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.14)}`,
                  }}
                >
                  <Typography sx={{ fontSize: 12.5, color: "#111827" }}>
                    {resolvedHelperText}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 0,
          mt: 1,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={handleExplicitClose}
          disabled={submitting}
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
          {resolvedCancelText}
        </Button>

        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={effectiveSubmitDisabled}
          size="small"
          sx={submitSx}
        >
          {submitting ? (
            t("common.saving")
          ) : formLoading ? (
            <CircularProgress size={16} />
          ) : (
            resolvedSubmitText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
