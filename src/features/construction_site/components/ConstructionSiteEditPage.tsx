import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import ConstructionSiteForm from "./ConstructionSiteForm";
import type { NewConstructionSiteRequest } from "..";

import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useConstructionSite } from "../hooks/useConstructionSite";
import { useUpdateConstructionSite } from "../hooks/useUpdateConstructionSite";

export default function ConstructionSiteEditPage() {
  const { id } = useParams<{ id: string }>();
  const siteId = Number(id);
  if (!Number.isFinite(siteId)) return <div>Neispravan URL (id)</div>;

  const navigate = useNavigate();
  const {
    data: site,
    isLoading: siteLoading,
    error,
  } = useConstructionSite(siteId);
  const { mutate: updateSite, isPending } = useUpdateConstructionSite();

  const { employeeRows = [], isLoading: employeesLoading } = useEmployees();
  const managerOptions = [
    { value: null, label: "— Bez voditelja —" },
    ...(employeeRows ?? []).map((e: any) => ({
      value: e.id,
      label: `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim(),
    })),
  ];

  const defaultValues: NewConstructionSiteRequest | undefined = site && {
    name: site.name ?? "",
    location: site.location ?? "",
    startDate: site.startDate ?? "",
    plannedEndDate: site.plannedEndDate ?? "",
    siteManagerId: site.siteManagerId ?? 0,
    description: site.description ?? null,
  };

  const handleSubmit = (values: NewConstructionSiteRequest) => {
    const idForUpdate = typeof site?.id === "number" ? site.id : siteId;
    updateSite({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/constructionSites"),
    });
  };

  if (error) return <div>Neuspjelo učitavanje gradilišta.</div>;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          Uredi gradilište
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
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <ConstructionSiteForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={siteLoading || isPending || employeesLoading}
          managerOptions={managerOptions}
        />
      </Paper>
    </Stack>
  );
}
