import { useQuery } from "@tanstack/react-query";
import type { ToolRepair } from "..";
import { ToolRepairsApi } from "../api/tool-repairs.api";
import { toolRepairsKeys } from "../api/tool-repairs.keys";

export function useToolRepair(repairId: number) {
  return useQuery<ToolRepair>({
    queryKey: toolRepairsKeys.detail(repairId),
    queryFn: () => ToolRepairsApi.getById(repairId),
    enabled: !!repairId,
  });
}
