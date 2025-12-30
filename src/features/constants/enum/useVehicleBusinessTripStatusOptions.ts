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
      {
        value: 1,
        label: t("vehicleBusinessTrips.status.open", "Open"),
      },
      {
        value: 2,
        label: t("vehicleBusinessTrips.status.closed", "Closed"),
      },
      {
        value: 3,
        label: t("vehicleBusinessTrips.status.cancelled", "Cancelled"),
      },
    ],
    [t]
  );
}
