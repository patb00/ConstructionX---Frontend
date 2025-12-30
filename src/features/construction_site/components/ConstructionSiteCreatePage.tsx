import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ConstructionSiteForm from "./ConstructionSiteForm";
import { useAddConstructionSite } from "../hooks/useAddConstructionSite";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useConstructionSiteStatusOptions } from "../../constants/enum/useConstructionSiteStatusOptions";
import type { ConstructionSiteFormValues } from "..";
import { useMemo } from "react";
import { buildEmployeeSelectOptions } from "../utils/options";

export default function ConstructionSiteCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: createSite, isPending } = useAddConstructionSite();
  const { employeeRows = [] } = useEmployees();
  const statusOptions = useConstructionSiteStatusOptions();

  const managerOptions = useMemo(
    () =>
      buildEmployeeSelectOptions(
        employeeRows,
        t("constructionSites.form.manager.none")
      ),
    [employeeRows, t]
  );

  const handleSubmit = async (values: ConstructionSiteFormValues) => {
    await createSite(values as any);
    navigate("/app/constructionSites");
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("constructionSites.create.title")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/constructionSites")}
          sx={{ color: "primary.main" }}
        >
          {t("constructionSites.create.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          p: 2,
        }}
      >
        <ConstructionSiteForm
          onSubmit={handleSubmit}
          busy={isPending}
          managerOptions={managerOptions}
          statusOptions={statusOptions}
          showStatus
        />
      </Paper>
    </Stack>
  );
}
