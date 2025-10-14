import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import CompanyForm from "./CompanyForm";
import { useCompany } from "../hooks/useCompany";
import { useUpdateCompany } from "../hooks/useUpdateCompany";

export default function CompanyEditPage() {
  const { id } = useParams<{ id: string }>();
  const companyId = Number(id);
  console.log("🔹 useParams id:", id, "→ companyId:", companyId);
  if (!Number.isFinite(companyId)) return <div>Neispravan URL (id)</div>;

  const navigate = useNavigate();
  const { data: company, isLoading, error } = useCompany(companyId);
  const { mutateAsync: updateCompany, isPending } = useUpdateCompany();

  console.log("🔹 useCompany result:", { company, isLoading, error });

  const defaultValues = company && {
    name: company.name,
    dateOfCreation: company.dateOfCreation?.slice(0, 10),
  };

  console.log("🔹 Computed defaultValues:", defaultValues);

  const handleSubmit = async (values: any) => {
    console.log("✅ Submitting form values:", values);
    await updateCompany({ id: companyId, ...values });
  };

  if (error) {
    console.error("❌ Error loading company:", error);
    return <div>Neuspjelo učitavanje tvrtki.</div>;
  }

  console.log("🔹 Render CompanyEditPage with busy:", isPending || isLoading);

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
          key={companyId}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={isPending || isLoading}
        />
      </Paper>
    </Stack>
  );
}
