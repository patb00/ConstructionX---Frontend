import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { PermissionGate } from "../../../lib/permissions";
import { useTranslation } from "react-i18next";
import ExaminationTypesTable from "./ExaminationTypesTable";

const ExaminationTypesListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("examinationTypes.list.title")}
        </Typography>

        <PermissionGate
          guard={{ permission: "Permission.ExaminationTypes.Create" }}
        >
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("examinationTypes.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
        <ExaminationTypesTable />
      </Paper>
    </Stack>
  );
};

export default ExaminationTypesListPage;
