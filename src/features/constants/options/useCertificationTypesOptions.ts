import { useMemo } from "react";
import { useCertificationTypes } from "../../certification_types/hooks/useCertificationTypes";

export type Option = { label: string; value: number };

export function useCertificationTypeOptions() {
  const { certificationTypesRows, isLoading, error } =
    useCertificationTypes();

  const options: Option[] = useMemo(() => {
    return (certificationTypesRows ?? [])
      .filter((x: any) => typeof x?.id === "number")
      .map((x: any) => ({
        label: x.certificationTypeName,
        value: x.id,
      }));
  }, [certificationTypesRows]);

  return { options, isLoading, error };
}
