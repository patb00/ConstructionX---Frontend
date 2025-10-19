import { useQuery } from "@tanstack/react-query";

import { toolsKeys } from "../api/tools.keys";
import { ToolsApi } from "../api/tools.api";
import type { Tool } from "..";

export function useTool(toolId: number) {
  return useQuery<Tool>({
    queryKey: toolsKeys.detail(toolId),
    queryFn: () => ToolsApi.getById(toolId),
  });
}
