import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ConstructionSitesTable from "./ConstructionSitesTable";
import { PermissionGate } from "../../../lib/permissions";
import { useTranslation } from "react-i18next";

import { useConstructionSiteStatusOptions } from "../../constants/enum/useConstructionSiteStatusOptions";
import { useMemo, useState } from "react";
import FilterSelect, {
  type SelectOption,
} from "../../../components/ui/select/FilterSelect";

const ConstructionSitesListPage = () => {
  const { t } = useTranslation();
  const statusOptions = useConstructionSiteStatusOptions();

  const [statusValue, setStatusValue] = useState<string>("");

  const selectOptions: SelectOption[] = useMemo(
    () =>
      (statusOptions ?? []).map((o) => ({
        value: String(o.value),
        label: o.label,
        dotValue: o.value,
      })),
    [statusOptions]
  );

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("constructionSites.list.title")}
        </Typography>

        <PermissionGate
          guard={{ permission: "Permission.ConstructionSites.Create" }}
        >
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("constructionSites.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <Stack direction="row" alignItems="center">
        <FilterSelect
          label={t("constructionSites.status.label")}
          placeholder={t("common.all")}
          options={selectOptions}
          value={statusValue}
          onChange={setStatusValue}
        />
      </Stack>

      <ConstructionSitesTable statusValue={statusValue} />
    </Stack>
  );
};

export default ConstructionSitesListPage;
