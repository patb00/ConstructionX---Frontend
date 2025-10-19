import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateToolCategoryRequest } from "..";
import { ToolCategoriesApi } from "../api/tool-category.api";
import { toolCategoriesKeys } from "../api/tool-category.keys";

export function useUpdateToolCategory() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateToolCategoryRequest) =>
      ToolCategoriesApi.update(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: toolCategoriesKeys.list() });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/tool-categories");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
