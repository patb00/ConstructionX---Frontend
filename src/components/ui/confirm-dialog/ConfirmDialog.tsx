import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

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
  return (
    <Dialog
      open={open}
      onClose={disableBackdropClose || loading ? undefined : onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      fullWidth
      maxWidth="xs"
      keepMounted
      PaperProps={{
        sx: {
          border: (theme) => `1px solid ${theme.palette.error.main}`,
        },
      }}
    >
      {title && (
        <DialogTitle
          id="confirm-dialog-title"
          sx={{ fontWeight: 600, color: "error.main" }}
        >
          {title}
        </DialogTitle>
      )}

      {description && (
        <DialogContent>
          <Typography id="confirm-dialog-description" variant="body2">
            {description}
          </Typography>
        </DialogContent>
      )}

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
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
          {cancelText}
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
