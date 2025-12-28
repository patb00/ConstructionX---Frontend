import { useQuery } from "@tanstack/react-query";
import { toolsKeys } from "../api/tools.keys";
import { ToolsApi } from "../api/tools.api";
import type { PagedResult, ToolHistoryItem } from "..";

export const toolHistoryQuery = {
  key: (toolId: number, page0: number, pageSize: number) =>
    toolsKeys.history(toolId, page0, pageSize),
  fetch: (toolId: number, page0: number, pageSize: number) =>
    ToolsApi.history(toolId, page0 + 1, pageSize),
};

export function useToolHistoryPage(
  toolId: number,
  page0: number,
  pageSize: number
) {
  return useQuery<PagedResult<ToolHistoryItem>>({
    queryKey: toolHistoryQuery.key(toolId, page0, pageSize),
    queryFn: () => toolHistoryQuery.fetch(toolId, page0, pageSize),
  });
}
