import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import type { NewVehicleRegistrationRequest } from "..";
import { useVehicleRegistration } from "../hooks/useVehicleRegistration";
import { useUpdateVehicleRegistration } from "../hooks/useUpdateVehicleRegistration";
import { useUploadVehicleRegistrationDocument } from "../hooks/useUploadVehicleRegistrationDocument";
import { useDownloadVehicleRegistrationDocument } from "../hooks/useDownloadVehicleRegistrationDocument";
import { vehicleRegistrationToDefaultValues } from "../utils/vehcileRegistrationForm";
import VehicleRegistrationForm from "./VehicleRegistrationForm";
import { downloadBlob } from "../../../utils/downloadBlob";

export default function VehicleRegistrationEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const registrationId = Number(id);

  if (!Number.isFinite(registrationId)) {
    return <div>{t("vehicleRegistrations.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const {
    data: registration,
    isLoading: loadingRegistration,
    error,
  } = useVehicleRegistration(registrationId);

  const { mutateAsync: updateRegistration, isPending: updating } =
    useUpdateVehicleRegistration();
  const { mutateAsync: uploadDocument, isPending: uploading } =
    useUploadVehicleRegistrationDocument();
  const { mutateAsync: downloadDocument } =
    useDownloadVehicleRegistrationDocument();

  const [docFile, setDocFile] = useState<File | null>(null);

  if (error) return <div>{t("vehicleRegistrations.edit.loadError")}</div>;

  const defaultValues: NewVehicleRegistrationRequest | undefined =
    vehicleRegistrationToDefaultValues(registration);

  const handleSubmit = async (values: NewVehicleRegistrationRequest) => {
    const idForUpdate =
      typeof (registration as any)?.id === "number"
        ? (registration as any).id
        : registrationId;

    await updateRegistration({ id: idForUpdate, ...values } as any);

    if (docFile) {
      await uploadDocument({
        registrationId: idForUpdate,
        file: docFile,
      });
    }

    navigate("/app/vehicle-registrations");
  };

  const handleDownload = async () => {
    const blob = await downloadDocument(registrationId);
    if (blob) {
      const fileName = registration?.documentPath?.split("/").pop() || "document.pdf";
      downloadBlob(blob, fileName);
    }
  };

  const busy = loadingRegistration || updating || uploading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleRegistrations.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-registrations")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleRegistrations.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleRegistrationForm
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
