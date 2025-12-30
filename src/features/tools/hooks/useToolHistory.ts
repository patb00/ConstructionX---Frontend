import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { PagedResult, ToolHistoryItem } from "..";
import { toolsKeys } from "../api/tools.keys";
import { ToolsApi } from "../api/tools.api";

export const useToolHistory = (toolId: number) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const { data, error, isLoading, isError, isFetching } = useQuery<
    PagedResult<ToolHistoryItem>
  >({
    queryKey: toolsKeys.history(
      toolId,
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      ToolsApi.history(
        toolId,
        paginationModel.page + 1,
        paginationModel.pageSize
      ),
    enabled: Number.isFinite(toolId) && toolId > 0,
    placeholderData: (prev) => prev,
  });

  return {
    historyRows: data?.items ?? [],
    total: data?.total ?? 0,

    paginationModel,
    setPaginationModel,

    error,
    isLoading,
    isFetching,
    isError,
  };
};
