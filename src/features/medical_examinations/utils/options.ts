import type { SelectOption } from "./types";

export function mapEmployeeToOption(e: any): SelectOption {
  return {
    value: e.id,
    label: `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() || `#${e.id}`,
  };
}

export function toEmployeeOptions(
  rows: any[] | undefined | null
): SelectOption[] {
  return (rows ?? []).map(mapEmployeeToOption);
}

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
