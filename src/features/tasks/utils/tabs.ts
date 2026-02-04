export type RequestsTabKey = "vehicleRegistration" | "businessTrips";

export const TAB_KEYS: RequestsTabKey[] = [
  "vehicleRegistration",
  "businessTrips",
];

export function tabIndexFromKey(key: string | null): number {
  const idx = TAB_KEYS.indexOf((key ?? "") as RequestsTabKey);
  return idx >= 0 ? idx : 0;
}

export function tabKeyFromIndex(index: number): RequestsTabKey {
  return TAB_KEYS[index] ?? "vehicleRegistration";
}
