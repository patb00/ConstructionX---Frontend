import type { SelectOption } from "./employees";

export function mapExaminationTypeToOption(x: any): SelectOption {
  return {
    value: x.id,
    label: x.examinationTypeName ?? `#${x.id}`,
  };
}

export function toExaminationTypeOptions(
  rows: any[] | undefined | null
): SelectOption[] {
  return (rows ?? []).map(mapExaminationTypeToOption);
}
