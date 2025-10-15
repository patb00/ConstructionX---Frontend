import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import CompanyForm from "./CompanyForm";
import { useCompany } from "../hooks/useCompany";
import { useUpdateCompany } from "../hooks/useUpdateCompany";

export default function CompanyEditPage() {
  const { id } = useParams<{ id: string }>();
  const companyId = Number(id);
  if (!Number.isFinite(companyId)) return <div>Neispravan URL (id)</div>;

  const navigate = useNavigate();
  const { data: company, isLoading, error } = useCompany(companyId);
  const { mutateAsync: updateCompany, isPending } = useUpdateCompany();

  const defaultValues = company && {
    name: company.name,
    dateOfCreation: company.dateOfCreation?.slice(0, 10),
  };

  const handleSubmit = async (values: any) => {
    await updateCompany({ id: companyId, ...values });
  };

  if (error) {
    return <div>Neuspjelo učitavanje tvrtki.</div>;
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
          Uredi tvrtku
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/companies")}
          sx={{
            color: "primary.main",
          }}
        >
          Natrag
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
