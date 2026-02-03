import { useRef, useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
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
        { variant: "warning" }
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
        { variant: "success" }
      );
      handleCloseImport();
    } catch (error: any) {
      enqueueSnackbar(
        error?.message ||
          t("common.importDialog.error", "Failed to import data."),
        { variant: "error" }
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
        { variant: "success" }
      );
    } catch (error: any) {
      enqueueSnackbar(
        error?.message ||
          t("common.exportDialog.error", "Failed to export data."),
        { variant: "error" }
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

      <Dialog open={importOpen} onClose={handleCloseImport} maxWidth="sm" fullWidth>
        <DialogTitle>{t("common.importDialog.title", "Import data")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t(
                "common.importDialog.description",
                "Upload a file to import records into the system."
              )}
            </Typography>
            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle2">
                  {t("common.importDialog.selectFile", "Select a file")}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t("common.fileInput.choose", "Choose file")}
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {selectedFile?.name ??
                      t("common.fileInput.noFile", "No file chosen")}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {t(
                    "common.importDialog.supportedFormats",
                    "Supported formats: .xlsx, .csv"
                  )}
                </Typography>
              </Stack>
            </Box>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              hidden
              onChange={handleFileChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImport} disabled={isImporting}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting
              ? t("common.importDialog.importing", "Importing...")
              : t("common.import", "Import")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
