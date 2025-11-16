import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  disableBackdropClose?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Potvrda",
  description,
  confirmText = "Da",
  cancelText = "Odustani",
  loading = false,
  disableBackdropClose = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  // This is only used by MUI when the user clicks backdrop or presses ESC
  const handleDialogClose = () => {
    if (loading || disableBackdropClose) return;
    onClose();
  };

  // For buttons / close icon we usually only block when loading
  const handleExplicitClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        {title && (
          <DialogTitle
            id="confirm-dialog-title"
            sx={{
              m: 0,
              p: 0,
              fontSize: 16,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {title}
          </DialogTitle>
        )}

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
            "&:hover": {
              backgroundColor: "#EFF6FF",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 16, color: "#111827" }} />
        </IconButton>
      </Box>

      {/* Body */}
      {description && (
        <DialogContent sx={{ p: 0, mb: 2 }}>
          <Typography
            id="confirm-dialog-description"
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>
        </DialogContent>
      )}

      {/* Actions */}
      <DialogActions
        sx={{
          p: 0,
          mt: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
        }}
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
            "&:hover": {
              backgroundColor: "#F9FAFB",
              borderColor: "#D1D5DB",
            },
          }}
        >
          {cancelText}
        </Button>

        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            backgroundColor: "#F43F5E",
            "&:hover": {
              backgroundColor: "#E11D48",
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
