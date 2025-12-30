import { useMemo } from "react";
import { useToolCategories } from "../../tools_category/hooks/useToolCategories";

export type Option = { label: string; value: number };

export function useToolCategoryOptions() {
  const { toolCategoriesRows, isLoading, error } = useToolCategories();

  const options: Option[] = useMemo(() => {
    return (toolCategoriesRows ?? [])
      .filter((c: any) => typeof c?.id === "number")
      .map((c: any) => ({
        label: c.name,
        value: c.id,
      }));
  }, [toolCategoriesRows]);

  return { options, isLoading, error };
}
