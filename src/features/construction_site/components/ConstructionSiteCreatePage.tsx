import { Button, Paper, Stack, Typography } from "@mui/material";
import ConstructionSiteForm from "./ConstructionSiteForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAddConstructionSite } from "../hooks/useAddConstructionSite";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";

export default function ConstructionSiteCreatePage() {
  const { mutateAsync, isPending } = useAddConstructionSite();
  const navigate = useNavigate();
  const { employeeRows } = useEmployees();

  const managerOptions = [
    { value: null, label: "— Bez voditelja —" },
    ...(employeeRows ?? []).map((e: any) => ({
      value: e.id,
      label: `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim(),
    })),
  ];

  console.log(employeeRows);
  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          Kreiraj gradilište
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/constructionSites")}
          sx={{ color: "primary.main" }}
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
          p: 2,
        }}
      >
        <ConstructionSiteForm
          onSubmit={mutateAsync}
          busy={isPending}
          managerOptions={managerOptions}
        />
      </Paper>
    </Stack>
  );
}
