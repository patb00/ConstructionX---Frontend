import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";

export type Option = { label: string; value: number | null };

export function useConstructionSiteManagerOptions() {
  const { t } = useTranslation();
  const { employeeRows = [], isLoading, isError, error } = useEmployees();

  const options: Option[] = useMemo(
    () => [
      {
        label: t("constructionSites.form.manager.none"),
        value: null,
      },
      ...(employeeRows ?? []).map((e: any) => ({
        value: e?.id ?? null,
        label:
          `${e?.firstName ?? ""} ${e?.lastName ?? ""}`.trim() ||
          `#${e?.id ?? ""}`,
      })),
    ],
    [employeeRows, t]
  );

  return { options, isLoading, isError, error };
}
