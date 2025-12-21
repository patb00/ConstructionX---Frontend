import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import CompanyForm from "./CompanyForm";
import { useCompany } from "../hooks/useCompany";
import { useUpdateCompany } from "../hooks/useUpdateCompany";
import { useTranslation } from "react-i18next";

export default function CompanyEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const companyId = Number(id);
  if (!Number.isFinite(companyId))
    return <div>{t("companies.edit.invalidUrlId")}</div>;

  const navigate = useNavigate();
  const { data: company, isLoading, error } = useCompany(companyId);
  const { mutateAsync: updateCompany, isPending } = useUpdateCompany();

  const defaultValues = company && {
    name: company.name,
    dateOfCreation: company.dateOfCreation?.slice(0, 16),
  };

  const handleSubmit = async (values: any) => {
    await updateCompany({ id: companyId, ...values });
  };

  if (error) {
    return <div>{t("companies.edit.loadError")}</div>;
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("companies.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/companies")}
          sx={{ color: "primary.main" }}
        >
          {t("companies.edit.back")}
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
        <CompanyForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={isPending || isLoading}
        />
      </Paper>
    </Stack>
  );
}
