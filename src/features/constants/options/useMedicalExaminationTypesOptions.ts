import { useMemo } from "react";
import { useExaminationTypes } from "../../examination_types/hooks/useExaminationTypes";

export type Option = { label: string; value: number };

export function useMedicalExaminationTypeOptions() {
  const { examinationTypesRows, isLoading, error } = useExaminationTypes();

  const options: Option[] = useMemo(() => {
    return (examinationTypesRows ?? [])
      .filter((x: any) => typeof x?.id === "number")
      .map((x: any) => ({
        label: x.examinationTypeName,
        value: x.id,
      }));
  }, [examinationTypesRows]);

  return { options, isLoading, error };
}
