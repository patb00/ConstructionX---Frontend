export type SelectOption = { label: string; value: any };

export function toCategoryOptions(
  rows: any[] | undefined | null
): SelectOption[] {
  return (rows ?? []).map((c) => ({
    value: c.id,
    label: c.name ?? `#${c.id}`,
  }));
}

export function toEmployeeOptions(
  rows: any[] | undefined | null,
  extras: SelectOption[] = []
): SelectOption[] {
  const mapped = (rows ?? []).map((e) => ({
    value: e.id,
    label: `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() || `#${e.id}`,
  }));
  return [...extras, ...mapped];
}

export function toStringEnumOptions(
  items: string[] | undefined | null
): SelectOption[] {
  return (items ?? []).map((x) => ({ label: x, value: x }));
}
