import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAddCertification } from "../hooks/useAddCertification";
import CertificationForm from "./CertificationForm";
import type { NewCertificationRequest } from "..";

export default function CertificationCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: createCertification, isPending: creating } =
    useAddCertification();

  const handleSubmit = async (values: NewCertificationRequest) => {
    await createCertification(values);
    navigate("/app/certifications");
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("certifications.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/certifications")}
        >
          {t("certifications.create.back")}
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", p: 2 }}>
        <CertificationForm
          mode="create"
          onSubmit={handleSubmit}
          busy={creating}
          showEmployeeField
        />
      </Paper>
    </Stack>
  );
}
