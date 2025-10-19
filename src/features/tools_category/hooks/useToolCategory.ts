import { useQuery } from "@tanstack/react-query";
import type { ToolCategory } from "..";
import { toolCategoriesKeys } from "../api/tool-category.keys";
import { ToolCategoriesApi } from "../api/tool-category.api";

export function useToolCategory(toolCategoryId: number) {
  return useQuery<ToolCategory>({
    queryKey: toolCategoriesKeys.detail(toolCategoryId),
    queryFn: () => ToolCategoriesApi.getById(toolCategoryId),
  });
}
