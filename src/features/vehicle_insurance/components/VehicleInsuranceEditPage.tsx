import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import type { NewVehicleInsuranceRequest } from "..";
import { useVehicleInsurance } from "../hooks/useVehicleInsurance";
import { useUpdateVehicleInsurance } from "../hooks/useUpdateVehicleInsurance";
import { useUploadVehicleInsuranceDocument } from "../hooks/useUploadVehicleInsuranceDocument";
import { useDownloadVehicleInsuranceDocument } from "../hooks/useDownloadVehicleInsuranceDocument";
import VehicleInsuranceForm from "./VehicleInsuranceForm";
import { vehicleInsuranceToDefaultValues } from "../utils/vehicleInsuranceForm";
import { downloadBlob } from "../../../utils/downloadBlob";

export default function VehicleInsuranceEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const insuranceId = Number(id);

  if (!Number.isFinite(insuranceId)) {
    return <div>{t("vehicleInsurances.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const {
    data: insurance,
    isLoading: loadingInsurance,
    error,
  } = useVehicleInsurance(insuranceId);

  const { mutateAsync: updateInsurance, isPending: updating } =
    useUpdateVehicleInsurance();
  const { mutateAsync: uploadDocument, isPending: uploading } =
    useUploadVehicleInsuranceDocument();
  const { mutateAsync: downloadDocument } =
    useDownloadVehicleInsuranceDocument();

  const [docFile, setDocFile] = useState<File | null>(null);

  if (error) return <div>{t("vehicleInsurances.edit.loadError")}</div>;

  const defaultValues: NewVehicleInsuranceRequest | undefined =
    vehicleInsuranceToDefaultValues(insurance) as any;

  const handleSubmit = async (values: NewVehicleInsuranceRequest) => {
    const idForUpdate =
      typeof (insurance as any)?.id === "number"
        ? (insurance as any).id
        : insuranceId;

    await updateInsurance({ id: idForUpdate, ...values } as any);

    if (docFile) {
      await uploadDocument({
        insuranceId: idForUpdate,
        file: docFile,
      });
    }

    navigate("/app/vehicle-insurances");
  };

  const handleDownload = async () => {
    const blob = await downloadDocument(insuranceId);
    if (blob) {
      const fileName = insurance?.documentPath?.split("/").pop() || "document.pdf";
      downloadBlob(blob, fileName);
    }
  };

  const busy = loadingInsurance || updating || uploading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleInsurances.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-insurances")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleInsurances.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleInsuranceForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
          docFile={docFile}
          onDocFileChange={setDocFile}
          onDownload={handleDownload}
        />
      </Paper>
    </Stack>
  );
}
