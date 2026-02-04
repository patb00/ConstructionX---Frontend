import { useMemo } from "react";

export type Option = { label: string; value: string };

export function useClothingSizeOptions() {
  return useMemo<Option[]>(
    () =>
      ["XS", "S", "M", "L", "XL", "XXL"].map((x) => ({ label: x, value: x })),
    []
  );
}
