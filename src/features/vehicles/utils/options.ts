export type SelectOption = { label: string; value: any };

export function toStringOptions(
  arr: string[] | undefined | null
): SelectOption[] {
  return (arr ?? []).map((x) => ({ value: x, label: x }));
}
