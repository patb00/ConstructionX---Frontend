import { HistoryPanel } from "../../../components/ui/history/HistoryPanel";
import type { ToolHistoryItem } from "..";
import { toolHistoryQuery } from "../hooks/useToolHistory";
import { useTranslation } from "react-i18next";

function formatRange(from: string, to: string | null) {
  return to ? `${from} → ${to}` : `${from} → (ongoing)`;
}

export function ToolHistoryDetails({ toolId }: { toolId: number }) {
  const { t } = useTranslation();

  return (
    <HistoryPanel<ToolHistoryItem>
      title={t("history.tool.title")}
      pageSize={5}
      queryKey={(page0, pageSize) =>
        toolHistoryQuery.key(toolId, page0, pageSize)
      }
      queryFn={(page0, pageSize) =>
        toolHistoryQuery.fetch(toolId, page0, pageSize)
      }
      mapItem={(it) => {
        const from = it.dateFrom ?? it.changedAt ?? "";

        return {
          title:
            it.constructionSiteName ??
            `${t("common.columns.constructionSiteName")} #${
              it.constructionSiteId
            }`,
          subtitle: it.constructionSiteLocation ?? "",
          badge: it.action ?? t("history.common.assigned"),
          date: from,
          meta: [
            { label: t("history.meta.siteId"), value: it.constructionSiteId },
            {
              label: t("history.meta.employee"),
              value: String(it.responsibleEmployeeName ?? ""),
            },
            {
              label: t("history.meta.employeeId"),
              value: String(it.responsibleEmployeeId ?? ""),
            },
            {
              label: t("history.meta.dateRange"),
              value: formatRange(from, it.dateTo),
            },
          ],
        };
      }}
      loadMoreLabel={t("history.common.loadMore")}
    />
  );
}
