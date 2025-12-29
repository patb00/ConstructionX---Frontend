import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

import { PermissionGate } from "../../../lib/permissions";
import MedicalExaminationsTable from "./MedicalExaminationTable";
import { useExaminationTypes } from "../../examination_types/hooks/useExaminationTypes";
import { Tabs } from "../../../components/ui/tabs/Tabs";

type TabValue = "all" | "byEmployee" | number;

const MedicalExaminationsListPage = () => {
  const { t } = useTranslation();
  const { examinationTypesRows, isLoading: typesLoading } =
    useExaminationTypes();

  const [tab, setTab] = useState<TabValue>("all");

  const isByEmployee = tab === "byEmployee";

  const selectedExaminationTypeId = useMemo(() => {
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

      ...(examinationTypesRows ?? []).map((x: any) => ({
        value: x.id as number,
        label: x.examinationTypeName ?? String(x.id),
        disabled: typesLoading,
      })),
    ],
    [examinationTypesRows, t, typesLoading]
  );

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("medicalExaminations.list.title")}
        </Typography>

        <PermissionGate
          guard={{ permission: "Permission.MedicalExaminations.Create" }}
        >
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("medicalExaminations.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <Tabs
        value={tab}
        onChange={setTab}
        items={tabItems}
        ariaLabel="Medical examinations tabs"
      />

      <MedicalExaminationsTable
        examinationTypeId={selectedExaminationTypeId}
        groupByEmployee={isByEmployee}
      />
    </Stack>
  );
};

export default MedicalExaminationsListPage;
