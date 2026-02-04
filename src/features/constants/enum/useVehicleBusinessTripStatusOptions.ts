import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type VehicleBusinessTripStatusOption = {
  value: number;
  label: string;
};

export function useVehicleBusinessTripStatusOptions(): VehicleBusinessTripStatusOption[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      { value: 0, label: t("vehicleBusinessTrips.status.pending", "Pending") },
      {
        value: 1,
        label: t("vehicleBusinessTrips.status.approved", "Approved"),
      },
      {
        value: 2,
        label: t("vehicleBusinessTrips.status.rejected", "Rejected"),
      },
      {
        value: 3,
        label: t("vehicleBusinessTrips.status.completed", "Completed"),
      },
      {
        value: 4,
        label: t("vehicleBusinessTrips.status.inProgress", "In progress"),
      },
      {
        value: 5,
        label: t("vehicleBusinessTrips.status.cancelled", "Cancelled"),
      },
    ],
    [t]
  );
}
