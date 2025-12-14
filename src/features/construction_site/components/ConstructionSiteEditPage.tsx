import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ConstructionSiteForm from "./ConstructionSiteForm";

import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useConstructionSite } from "../hooks/useConstructionSite";
import { useUpdateConstructionSite } from "../hooks/useUpdateConstructionSite";
import type { ConstructionSiteFormValues } from "..";

export default function ConstructionSiteEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const siteId = Number(id);

  if (!Number.isFinite(siteId)) {
    return <div>{t("constructionSites.edit.invalidUrlId")}</div>;
  }

  const navigate = useNavigate();

  const {
    data: site,
    isLoading: siteLoading,
    error,
  } = useConstructionSite(siteId);

  const { mutate: updateSite, isPending } = useUpdateConstructionSite();
  const { employeeRows = [], isLoading: employeesLoading } = useEmployees();

  const managerOptions = [
    { value: null, label: t("constructionSites.form.manager.none") },
    ...employeeRows.map((e: any) => ({
      value: e.id,
      label: `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim(),
    })),
  ];

  const defaultValues: Partial<ConstructionSiteFormValues> | undefined =
    site && {
      name: site.name ?? "",
      location: site.location ?? "",
      startDate: site.startDate ?? "",
      plannedEndDate: site.plannedEndDate ?? "",
      siteManagerId: site.siteManagerId ?? null,
      description: site.description ?? null,
    };

  const handleSubmit = (values: ConstructionSiteFormValues) => {
    updateSite(
      {
        id: siteId,
        ...values,
      } as any,
      {
        onSuccess: () => navigate("/app/constructionSites"),
      }
    );
  };

  if (error) {
    return <div>{t("constructionSites.edit.loadError")}</div>;
  }

  const busy = siteLoading || isPending || employeesLoading;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("constructionSites.edit.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/constructionSites")}
          sx={{ color: "primary.main" }}
        >
          {t("constructionSites.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <ConstructionSiteForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
          managerOptions={managerOptions}
          showStatus={false}
        />
      </Paper>
    </Stack>
  );
}
