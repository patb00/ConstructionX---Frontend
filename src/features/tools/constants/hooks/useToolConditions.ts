import { useQuery } from "@tanstack/react-query";
import { ToolConstantsApi } from "../api/tool-constants.api";
import { toolConstantsKeys } from "../api/tool-constants.keys";

export function useToolConditions() {
  return useQuery<string[]>({
    queryKey: toolConstantsKeys.conditions(),
    queryFn: ToolConstantsApi.getToolConditions,
  });
}
