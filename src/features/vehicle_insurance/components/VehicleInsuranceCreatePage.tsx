import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useState } from "react";
import VehicleInsuranceForm from "./VehicleInsuranceForm";
import { useAddVehicleInsurance } from "../hooks/useAddVehicleInsurance";
import { useUploadVehicleInsuranceDocument } from "../hooks/useUploadVehicleInsuranceDocument";

export default function VehicleInsuranceCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: createInsurance, isPending: creating } =
    useAddVehicleInsurance();
  const { mutateAsync: uploadDocument, isPending: uploading } =
    useUploadVehicleInsuranceDocument();

  const [docFile, setDocFile] = useState<File | null>(null);

  const handleSubmit = async (values: any) => {
    const result = await createInsurance(values);
    const newId = (result as any)?.data?.id || (result as any)?.data;

    if (newId && docFile) {
      await uploadDocument({
        insuranceId: Number(newId),
        file: docFile,
      });
    }

    navigate("/app/vehicle-insurances");
  };

  const busy = creating || uploading;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleInsurances.create.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/vehicle-insurances")}
          sx={{ color: "primary.main" }}
        >
          {t("vehicleInsurances.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (th) => `1px solid ${th.palette.divider}`, p: 2 }}
      >
        <VehicleInsuranceForm
          onSubmit={handleSubmit}
          busy={busy}
          docFile={docFile}
          onDocFileChange={setDocFile}
        />
      </Paper>
    </Stack>
  );
}
