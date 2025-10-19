import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { toolCategoriesKeys } from "../api/tool-category.keys";
import { ToolCategoriesApi } from "../api/tool-category.api";

export function useDeleteToolCategory() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (toolCategoryId: number) =>
      ToolCategoriesApi.delete(toolCategoryId),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: toolCategoriesKeys.list() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
