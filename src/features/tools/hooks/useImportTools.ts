import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ToolsApi } from "../api/tools.api";
import { toolsKeys } from "../api/tools.keys";

export function useImportTools() {
  const queryClient = useQueryClient();

  return useCallback(
    async (file: File) => {
      const result = await ToolsApi.import(file);
      await queryClient.invalidateQueries({ queryKey: toolsKeys.all });
      return result;
    },
    [queryClient]
  );
}
