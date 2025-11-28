export type SelectOption = { label: string; value: any };

export function mapEmployeeToOption(e: any): SelectOption {
  return {
    value: e.id,
    label: `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() || `#${e.id}`,
  };
}

export function toEmployeeOptions(rows: any[] | undefined | null) {
  return (rows ?? []).map(mapEmployeeToOption);
}
