import { Button, Paper, Stack, Typography } from "@mui/material";
import { useAddCompany } from "../hooks/useAddCompany";
import CompanyForm from "./CompanyForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CompanyCreatePage() {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useAddCompany();
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("companies.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/companies")}
          sx={{ color: "primary.main" }}
        >
          {t("companies.create.back")}
        </Button>
      </Stack>
      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
        }}
      >
        <CompanyForm onSubmit={mutateAsync} busy={isPending} />
      </Paper>
    </Stack>
  );
}
