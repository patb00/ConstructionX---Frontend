import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type StatusOption = {
  value: number;
  label: string;
};

type StatusChangeDialogProps = {
  open: boolean;
  title?: string;
  currentStatus?: number | null;
  options: StatusOption[];
  loading?: boolean;
  onClose: () => void;
  onSave: (status: number) => void;
  saveLabel?: string;
  cancelLabel?: string;
  disableBackdropClose?: boolean;
};

export function ChangeStatusDialog({
  open,
  title,
  currentStatus,
  options,
  loading = false,
  onClose,
  onSave,
  saveLabel,
  cancelLabel,
  disableBackdropClose = false,
}: StatusChangeDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const dialogTitle = title ? title : t("constructionSites.status.dialogTitle");
  const saveText = saveLabel ? saveLabel : t("constructionSites.form.submit");
  const cancelText = cancelLabel
    ? cancelLabel
    : t("constructionSites.delete.cancel");
  const statusLabel = t("constructionSites.status.dialogFieldLabel");

  const [selected, setSelected] = useState<number | null>(
    currentStatus ? currentStatus : null
  );

  useEffect(() => {
    if (open) setSelected(currentStatus ? currentStatus : null);
  }, [open, currentStatus]);

  const handleDialogClose = () => {
    if (loading || disableBackdropClose) return;
    onClose();
  };

  const handleExplicitClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSave = () => {
    if (selected === null || loading) return;
    onSave(selected);
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="change-status-dialog-title"
      fullWidth
      maxWidth="xs"
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
        <DialogTitle
          id="change-status-dialog-title"
          sx={{ m: 0, p: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}
        >
          {dialogTitle}
        </DialogTitle>

        <IconButton
          onClick={handleExplicitClose}
          disabled={loading}
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
        <FormControl component="fieldset" fullWidth>
          <FormLabel
            component="legend"
            sx={{
              mb: 1,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#6B7280",
            }}
          >
            {statusLabel}
          </FormLabel>

          <RadioGroup
            value={selected === null ? "" : selected}
            onChange={(e) => setSelected(Number(e.target.value))}
          >
            {options.map((opt) => (
              <Box
                key={opt.value}
                sx={{
                  border: "1px solid #E5E7EB",
                  mb: 1,
                  px: 1.5,
                  py: 0.75,
                  display: "flex",
                  alignItems: "center",
                  transition: "0.15s",
                  "&:hover": {
                    borderColor: "#C7D2FE",
                    backgroundColor: "#F9FAFB",
                  },
                }}
              >
                <FormControlLabel
                  value={opt.value}
                  control={<Radio size="small" />}
                  label={
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 14, color: "#111827" }}
                    >
                      {opt.label}
                    </Typography>
                  }
                  sx={{ m: 0, flex: 1 }}
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions
        sx={{ p: 0, mt: 1, display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          onClick={handleExplicitClose}
          disabled={loading}
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
          {cancelText}
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || selected === null}
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            backgroundColor: theme.palette.primary.main,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          }}
        >
          {saveText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
