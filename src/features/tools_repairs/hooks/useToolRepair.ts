import { useQuery } from "@tanstack/react-query";
import type { ToolRepair } from "..";
import { toolRepairsKeys } from "../api/tools-repairs.keys";
import { ToolRepairsApi } from "../api/tools-repairs.api";

export function useToolRepair(repairId: number) {
  return useQuery<ToolRepair>({
    queryKey: toolRepairsKeys.detail(repairId),
    queryFn: () => ToolRepairsApi.getById(repairId),
    enabled: !!repairId,
  });
}
