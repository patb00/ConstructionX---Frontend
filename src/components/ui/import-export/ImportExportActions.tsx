import { useRef, useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { downloadBlob } from "../../../utils/downloadBlob";

type ImportExportActionsProps = {
  onExport: () => Promise<Blob>;
  onImport: (file: File) => Promise<Blob | void>;
  onImportSuccess?: () => void | Promise<void>;
  exportFileName: string;
  importResultFileName?: string;
  accept?: string;
};

export function ImportExportActions({
  onExport,
  onImport,
  onImportSuccess,
  exportFileName,
  importResultFileName = "import-result.xlsx",
  accept = ".xlsx,.csv",
}: ImportExportActionsProps) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [importOpen, setImportOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const theme = useTheme();

  const handleOpenImport = () => setImportOpen(true);

  const handleCloseImport = () => {
    setImportOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      enqueueSnackbar(
        t("common.importDialog.noFile", "Please choose a file to import."),
        { variant: "warning" },
      );
      return;
    }

    setIsImporting(true);
    try {
      const result = await onImport(selectedFile);
      if (result instanceof Blob && result.size > 0) {
        downloadBlob(result, importResultFileName);
      }
      await onImportSuccess?.();
      enqueueSnackbar(
        t("common.importDialog.success", "Import completed successfully."),
        { variant: "success" },
      );
      handleCloseImport();
    } catch (error: any) {
      enqueueSnackbar(
        error?.message ||
          t("common.importDialog.error", "Failed to import data."),
        { variant: "error" },
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await onExport();
      downloadBlob(blob, exportFileName);
      enqueueSnackbar(
        t("common.exportDialog.success", "Export downloaded successfully."),
        { variant: "success" },
      );
    } catch (error: any) {
      enqueueSnackbar(
        error?.message ||
          t("common.exportDialog.error", "Failed to export data."),
        { variant: "error" },
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={handleOpenImport}
          disabled={isImporting}
        >
          {t("common.import", "Import")}
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={isExporting}
        >
          {t("common.export", "Export")}
        </Button>
      </Stack>

      <Dialog
        open={importOpen}
        onClose={isImporting ? undefined : handleCloseImport}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            //borderRadius: 2,
            p: 0,
            boxShadow:
              "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <DialogTitle
            sx={{
              p: 0,
              fontSize: "1rem",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {t("common.import", "Import")}
          </DialogTitle>
          <IconButton
            size="small"
            onClick={handleCloseImport}
            disabled={isImporting}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {!selectedFile ? (
              <Box
                onClick={() => !isImporting && fileInputRef.current?.click()}
                sx={{
                  border: "1px dashed",
                  borderColor: "divider",
                  //borderRadius: 2,
                  py: 6,
                  px: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "grey.50",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <FileUploadIcon
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    opacity: 0.5,
                    fontSize: 32,
                  }}
                />
                <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>
                  {t("common.importDialog.clickToUpload")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("common.importDialog.dragNDrop")}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1.5, display: "block", opacity: 0.7 }}
                >
                  {t("common.importDialog.limitsSimple")}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  border: "1.5px dashed",
                  borderColor: "success.main",
                  py: 6,
                  px: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  backgroundColor: alpha(theme.palette.success.main, 0.04),
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <DescriptionIcon sx={{ color: "success.main", fontSize: 32 }} />
                </Box>
                
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{
                    mb: 0.5,
                    color: "success.dark",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFile.name}
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{ color: alpha(theme.palette.success.dark, 0.7), mb: 2 }}
                >
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => setSelectedFile(null)}
                  disabled={isImporting}
                  sx={{
                    textTransform: "none",
                    color: "error.main",
                    borderColor: alpha(theme.palette.error.main, 0.3),
                    "&:hover": {
                      borderColor: "error.main",
                      backgroundColor: alpha(theme.palette.error.main, 0.04),
                    },
                  }}
                >
                  {t("common.remove", "Remove")}
                </Button>
              </Box>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              hidden
              onChange={handleFileChange}
            />

            <Stack
              direction="row"
              spacing={1.5}
              justifyContent="flex-end"
              sx={{ mt: 1 }}
            >
              <Button
                onClick={handleCloseImport}
                disabled={isImporting}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "text.secondary",
                  px: 2,
                }}
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={isImporting || !selectedFile}
                startIcon={
                  isImporting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  borderRadius: 1.5,
                  backgroundColor: "primary.main",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                {isImporting
                  ? t("common.importDialog.importing", "Importing...")
                  : t("common.import", "Import")}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
