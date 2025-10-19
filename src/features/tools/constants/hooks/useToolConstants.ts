import { useQuery } from "@tanstack/react-query";
import { ToolConstantsApi } from "../api/tool-constants.api";
import { toolConstantsKeys } from "../api/tool-constants.keys";

export function useToolConstants() {
  return useQuery<string[]>({
    queryKey: toolConstantsKeys.statuses(),
    queryFn: ToolConstantsApi.getToolStatuses,
  });
}
