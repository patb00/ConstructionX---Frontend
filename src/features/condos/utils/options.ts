export type SelectOption = { label: string; value: any };

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

export function toCurrencyOptions(): SelectOption[] {
  return [
    { label: "EUR", value: "EUR" },
    { label: "USD", value: "USD" },
    { label: "GBP", value: "GBP" },
  ];
}
