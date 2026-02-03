import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { constructionSitesKeys } from "../api/construction-site.keys";

export function useImportConstructionSites() {
  const queryClient = useQueryClient();

  return useCallback(
    async (file: File) => {
      const result = await ConstructionSiteApi.import(file);
      await queryClient.invalidateQueries({ queryKey: constructionSitesKeys.all });
      return result;
    },
    [queryClient]
  );
}
