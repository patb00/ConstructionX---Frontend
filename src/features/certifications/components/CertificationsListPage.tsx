import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

import { PermissionGate } from "../../../lib/permissions";
import CertificationTable from "./CertificationTable";
import { useCertificationTypes } from "../../certification_types/hooks/useCertificationTypes";
import { Tabs } from "../../../components/ui/tabs/Tabs";

type TabValue = "all" | "byEmployee" | number;

const CertificationsListPage = () => {
  const { t } = useTranslation();
  const { certificationTypesRows, isLoading: typesLoading } =
    useCertificationTypes();

  const [tab, setTab] = useState<TabValue>("all");

  const isByEmployee = tab === "byEmployee";

  const selectedCertificationTypeId = useMemo(() => {
    if (tab === "all" || tab === "byEmployee") return null;
    return tab;
  }, [tab]);

  const tabItems = useMemo(
    () => [
      { value: "all" as const, label: t("common.all", "All") },

      {
        value: "byEmployee" as const,
        label: t("employees.byEmployee", "By employee"),
      },

      ...(certificationTypesRows ?? []).map((x: any) => ({
        value: x.id as number,
        label: x.certificationTypeName ?? String(x.id),
        disabled: typesLoading,
      })),
    ],
    [certificationTypesRows, t, typesLoading]
  );

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("certifications.list.title")}
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Certifications.Create" }}>
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

      <Tabs
        value={tab}
        onChange={setTab}
        items={tabItems}
        ariaLabel="Certifications tabs"
      />

      <CertificationTable
        certificationTypeId={selectedCertificationTypeId}
        groupByEmployee={isByEmployee}
      />
    </Stack>
  );
};

export default CertificationsListPage;
