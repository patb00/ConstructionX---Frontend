import { useMemo } from "react";

export type Option = { label: string; value: string };

export function useGloveSizeOptions() {
  return useMemo<Option[]>(
    () => ["6", "7", "8", "9", "10", "11"].map((x) => ({ label: x, value: x })),
    []
  );
}
