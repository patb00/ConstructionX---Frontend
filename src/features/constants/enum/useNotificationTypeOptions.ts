import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type NotificationTypeOption = {
  value: number;
  label: string;
};

export function useNotificationTypeOptions(): NotificationTypeOption[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      // 0–999
      {
        value: 0,
        label: t("notifications.type.unknown", "Unknown"),
      },

      // 1000–1999: ConstructionSites
      {
        value: 1000,
        label: t(
          "notifications.type.constructionSiteStatusChanged",
          "Construction site status changed",
        ),
      },
      {
        value: 1001,
        label: t(
          "notifications.type.constructionSiteAssigned",
          "Construction site assigned",
        ),
      },
      {
        value: 1002,
        label: t(
          "notifications.type.constructionSiteUnassigned",
          "Construction site unassigned",
        ),
      },
      {
        value: 1003,
        label: t(
          "notifications.type.constructionSiteDeadlineChanged",
          "Construction site deadline changed",
        ),
      },

      // 2000–2999: Vehicles
      {
        value: 2000,
        label: t("notifications.type.vehicleAssigned", "Vehicle assigned"),
      },
      {
        value: 2001,
        label: t("notifications.type.vehicleServiceDue", "Vehicle service due"),
      },
      {
        value: 2002,
        label: t(
          "notifications.type.vehicleRegistrationTaskAssigned",
          "Vehicle registration task assigned",
        ),
      },
      {
        value: 2003,
        label: t(
          "notifications.type.vehicleBusinessTripApprovalRequested",
          "Vehicle business trip approval requested",
        ),
      },
      {
        value: 2004,
        label: t(
          "notifications.type.vehicleBusinessTripApproved",
          "Vehicle business trip approved",
        ),
      },
      {
        value: 2005,
        label: t(
          "notifications.type.vehicleBusinessTripRejected",
          "Vehicle business trip rejected",
        ),
      },
      {
        value: 2006,
        label: t(
          "notifications.type.vehicleBusinessTripCancelled",
          "Vehicle business trip cancelled",
        ),
      },

      // 3000–3999: Tools
      {
        value: 3000,
        label: t("notifications.type.toolAssigned", "Tool assigned"),
      },
      {
        value: 3001,
        label: t(
          "notifications.type.toolMaintenanceDue",
          "Tool maintenance due",
        ),
      },

      // 4000–4999: MedicalExaminations
      {
        value: 4000,
        label: t(
          "notifications.type.medicalExaminationExpiresSoon",
          "Medical examination expires soon",
        ),
      },
      {
        value: 4001,
        label: t(
          "notifications.type.medicalExaminationExpired",
          "Medical examination expired",
        ),
      },

      // 9000–9999: System
      {
        value: 9000,
        label: t(
          "notifications.type.systemAnnouncement",
          "System announcement",
        ),
      },
    ],
    [t],
  );
}
