import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

import { PermissionGate } from "../../../lib/permissions";
import CertificationTable from "./CertificationTable";
import { useCertificationTypes } from "../../certification_types/hooks/useCertificationTypes";
import FilterSelect, {
  type SelectOption,
} from "../../../components/ui/select/FilterSelect";

type FilterValue = "all" | "byEmployee" | number;

const CertificationsListPage = () => {
  const { t } = useTranslation();
  const { certificationTypesRows, isLoading: typesLoading } =
    useCertificationTypes();

  const [filter, setFilter] = useState<FilterValue>("all");

  const isByEmployee = filter === "byEmployee";

  const selectedCertificationTypeId = useMemo(() => {
    if (filter === "all" || filter === "byEmployee") return null;
    return filter;
  }, [filter]);

  const selectValue = useMemo(() => {
    if (filter === "all") return "";
    if (filter === "byEmployee") return "byEmployee";
    return String(filter);
  }, [filter]);

  // NOTE: Don't include value "" in options, because FilterSelect already renders placeholder as value=""
  const options: SelectOption[] = useMemo(
    () => [
      {
        value: "byEmployee",
        label: t("employees.byEmployee", "By employee"),
      },
      ...(certificationTypesRows ?? []).map((x: any) => ({
        value: String(x.id),
        label: x.certificationTypeName ?? String(x.id),
        disabled: typesLoading,
      })),
    ],
    [certificationTypesRows, t, typesLoading]
  );

  const handleChange = (value: string) => {
    if (!value) {
      setFilter("all");
      return;
    }

    if (value === "byEmployee") {
      setFilter("byEmployee");
      return;
    }

    const id = Number(value);
    if (!Number.isNaN(id)) {
      setFilter(id);
    }
  };

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("certifications.list.title")}
        </Typography>

        <PermissionGate
          guard={{ permission: "Permission.Certifications.Create" }}
        >
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("certifications.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <Stack direction="row" alignItems="center">
        <FilterSelect
          label={t("common.filter", "Filter")}
          placeholder={t("common.allTypes", "All types")}
          options={options}
          value={selectValue}
          onChange={handleChange}
          disabled={typesLoading}
          showDotInValue={false}
          showDotInMenu={false}
        />
      </Stack>

      <CertificationTable
        certificationTypeId={selectedCertificationTypeId}
        groupByEmployee={isByEmployee}
      />
    </Stack>
  );
};

export default CertificationsListPage;
