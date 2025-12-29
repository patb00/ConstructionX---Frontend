import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { PermissionGate } from "../../../lib/permissions";
import CondosTable from "./CondosTable";

const CondosListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("condos.list.title")}
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Condos.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("condos.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <CondosTable />
    </Stack>
  );
};

export default CondosListPage;
