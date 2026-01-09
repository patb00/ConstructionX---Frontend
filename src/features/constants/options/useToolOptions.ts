import { useMemo } from "react";
import { useTools } from "../../tools/hooks/useTools";

export type Option = { label: string; value: number };

export function useToolOptions() {
  const { toolsRows, isLoading, isError, error } = useTools();

  const options: Option[] = useMemo(() => {
    return (toolsRows ?? [])
      .filter((t: any) => typeof t?.id === "number")
      .map((t: any) => ({
        label: t.code ? `${t.name} (${t.code})` : t.name,
        value: t.id,
      }));
  }, [toolsRows]);

  return { options, isLoading, isError, error };
}
