import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useState } from "react";
import { useAddVehicleRegistration } from "../hooks/useAddVehicleRegistration";
import { useUploadVehicleRegistrationDocument } from "../hooks/useUploadVehicleRegistrationDocument";
import VehicleRegistrationForm from "./VehicleRegistrationForm";

export default function VehicleRegistrationCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: createRegistration, isPending: creating } =
    useAddVehicleRegistration();
  const { mutateAsync: uploadDocument, isPending: uploading } =
    useUploadVehicleRegistrationDocument();

  const [docFile, setDocFile] = useState<File | null>(null);

  const handleSubmit = async (values: any) => {
    const result = await createRegistration(values);
    const newId = (result as any)?.data?.id || (result as any)?.data;

    if (newId && docFile) {
      await uploadDocument({
        registrationId: Number(newId),
        file: docFile,
      });
    }

    navigate("/app/vehicle-registrations");
  };

  const busy = creating || uploading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleRegistrations.create.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-registrations")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleRegistrations.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleRegistrationForm
          onSubmit={handleSubmit}
          busy={busy}
          docFile={docFile}
          onDocFileChange={setDocFile}
        />
      </Paper>
    </Stack>
  );
}
