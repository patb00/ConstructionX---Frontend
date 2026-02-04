type Option = { value: any; label: string };

export function buildEmployeeSelectOptions(
  employees: any[],
  noneLabel: string
): Option[] {
  return [
    { value: null, label: noneLabel },
    ...(employees ?? []).map((e) => ({
      value: e.id,
      label: `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() || `#${e.id}`,
    })),
  ];
}
