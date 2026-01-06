import {
  Alert,
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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type ResolveVehicleRegistrationTaskDialogProps = {
  open: boolean;
  title?: string;
  question?: string;

  helperText?: string;

  saveText?: string;
  createRegistrationText?: string;
  cancelText?: string;

  loading?: boolean;
  disableBackdropClose?: boolean;

  onClose: () => void;
  onSave: () => void;
  onCreateRegistration: () => void;
};

export default function ResolveVehicleRegistrationTaskDialog({
  open,
  title = "Potvrda",
  question = "Da li ste kreirali novu registraciju?",
  helperText = "Ukoliko niste, kliknite na “Kreiraj registraciju”. Nakon kreiranja registracije, vratite se ovdje i kliknite “Spremi” kako biste označili zadatak kao završen.",
  saveText = "Spremi",
  createRegistrationText = "Kreiraj registraciju",
  cancelText = "Odustani",
  loading = false,
  disableBackdropClose = false,
  onClose,
  onSave,
  onCreateRegistration,
}: ResolveVehicleRegistrationTaskDialogProps) {
  const handleDialogClose = () => {
    if (loading || disableBackdropClose) return;
    onClose();
  };

  const handleExplicitClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="resolve-task-dialog-title"
      aria-describedby="resolve-task-dialog-description"
      fullWidth
      maxWidth="xs"
      keepMounted
      PaperProps={{
        sx: {
          position: "relative",
          p: 2.75,
          pt: 2.5,
          pb: 2.5,
          backgroundColor: "#ffffff",

          boxShadow: "0px 12px 30px rgba(17,24,39,0.12)",
          border: "1px solid",
          borderColor: "#EEF2FF",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <DialogTitle
            id="resolve-task-dialog-title"
            sx={{
              m: 0,
              p: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            {title}
          </DialogTitle>

          <Typography
            id="resolve-task-dialog-description"
            sx={{
              mt: 1,
              fontSize: 14,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {question}
          </Typography>
        </Box>

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
            bgcolor: "#F9FAFB",
            border: "1px solid",
            borderColor: "#E5E7EB",
            "&:hover": { backgroundColor: "#EFF6FF", borderColor: "#D9DCF5" },
          }}
        >
          <CloseIcon sx={{ fontSize: 16, color: "#111827" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, mb: 2 }}>
        <Alert
          icon={<InfoOutlinedIcon fontSize="inherit" />}
          severity="info"
          sx={{
            alignItems: "flex-start",
            borderRadius: 1.5,
            bgcolor: "#F4F6FF",
            color: "#111827",
            border: "1px solid",
            borderColor: "#D9DCF5",
            "& .MuiAlert-icon": { mt: "2px", color: "#6F7295" },
            "& .MuiAlert-message": { width: "100%" },
          }}
        >
          <Typography variant="body2" sx={{ color: "#374151" }}>
            {helperText}
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions
        sx={{
          p: 0,
          mt: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={handleExplicitClose}
          disabled={loading}
          size="small"
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 600,
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
          onClick={onCreateRegistration}
          disabled={loading}
          size="small"
          variant="contained"
          startIcon={<InfoOutlinedIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            backgroundColor: "#4F46E5",
            "&:hover": { backgroundColor: "#4338CA" },
          }}
        >
          {createRegistrationText}
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
          disabled={loading}
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
          }}
        >
          {saveText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
