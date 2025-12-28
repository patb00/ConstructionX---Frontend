import { HistoryPanel } from "../../../components/ui/history/HistoryPanel";
import type { VehicleHistoryItem } from "..";
import { vehicleHistoryQuery } from "../hooks/useVehicleHistory";
import { useTranslation } from "react-i18next";

function formatRange(from?: string | null, to?: string | null) {
  const f = from ?? "";
  return to ? `${f} → ${to}` : `${f} → (ongoing)`;
}

export function VehicleHistoryDetails({ vehicleId }: { vehicleId: number }) {
  const { t } = useTranslation();

  return (
    <HistoryPanel<VehicleHistoryItem>
      title={t("history.vehicle.title")}
      pageSize={5}
      queryKey={(page0, pageSize) =>
        vehicleHistoryQuery.key(vehicleId, page0, pageSize)
      }
      queryFn={(page0, pageSize) =>
        vehicleHistoryQuery.fetch(vehicleId, page0, pageSize)
      }
      mapItem={(it) => ({
        title: it.constructionSiteName,
        subtitle: it.constructionSiteLocation,
        badge: t("history.common.assigned"),
        date: it.dateFrom ?? "",
        meta: [
          { label: t("history.meta.siteId"), value: it.constructionSiteId },
          {
            label: t("history.meta.employee"),
            value: it.responsibleEmployeeName,
          },
          {
            label: t("history.meta.employeeId"),
            value: it.responsibleEmployeeId,
          },
          {
            label: t("history.meta.dateRange"),
            value: formatRange(it.dateFrom, it.dateTo),
          },
        ],
      })}
      loadMoreLabel={t("history.common.loadMore")}
    />
  );
}
