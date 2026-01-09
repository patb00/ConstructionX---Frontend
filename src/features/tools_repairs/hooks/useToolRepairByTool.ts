import { useQuery } from "@tanstack/react-query";
import type { PagedResult, ToolRepair } from "..";
import { toolRepairsKeys } from "../api/tools-repairs.keys";
import { ToolRepairsApi } from "../api/tools-repairs.api";

export function useToolRepairsByTool(toolId: number, page = 1, pageSize = 10) {
  return useQuery<PagedResult<ToolRepair>>({
    queryKey: toolRepairsKeys.byTool(toolId, page, pageSize),
    queryFn: () => ToolRepairsApi.getByToolId(toolId, page, pageSize),
    enabled: !!toolId,
  });
}
