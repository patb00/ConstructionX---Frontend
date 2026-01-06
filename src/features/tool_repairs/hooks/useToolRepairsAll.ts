import { useQuery } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { PagedResult, ToolRepair } from "..";
import { ToolRepairsApi } from "../api/tool-repairs.api";
import { toolRepairsKeys } from "../api/tool-repairs.keys";

interface UseToolRepairsAllResult {
  repairs: ToolRepair[];
  total: number;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: Dispatch<SetStateAction<{ page: number; pageSize: number }>>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useToolRepairsAll(): UseToolRepairsAllResult {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const { data, error, isLoading, isError } = useQuery<PagedResult<ToolRepair>>({
    queryKey: toolRepairsKeys.listAll(
      paginationModel.page,
      paginationModel.pageSize
    ),
    queryFn: () =>
      ToolRepairsApi.getAll(paginationModel.page + 1, paginationModel.pageSize),
    placeholderData: (prev) => prev,
  });

  return {
    repairs: data?.items ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    isLoading,
    isError,
    error: error ?? null,
  };
}
