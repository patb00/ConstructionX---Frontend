import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type StatusOption = { value: number; label: string };

export function useConstructionSiteStatusOptions(): StatusOption[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      { value: 1, label: t("constructionSites.status.planned", "Planned") },
      {
        value: 2,
        label: t("constructionSites.status.inProgress", "In progress"),
      },
      { value: 3, label: t("constructionSites.status.onHold", "On hold") },
      { value: 4, label: t("constructionSites.status.completed", "Completed") },
      { value: 5, label: t("constructionSites.status.cancelled", "Cancelled") },
    ],
    [t]
  );
}
