import type { NewCondoRequest } from "..";

const toYMD = (s?: string | null) => (s ? s.slice(0, 10) : "");

export function condoToDefaultValues(
  condo: any | null | undefined
): Partial<NewCondoRequest> | undefined {
  if (!condo) return undefined;

  return {
    address: condo.address ?? "",
    capacity: typeof condo.capacity === "number" ? condo.capacity : 0,
    currentlyOccupied:
      typeof condo.currentlyOccupied === "number" ? condo.currentlyOccupied : 0,
    leaseStartDate: toYMD(condo.leaseStartDate),
    leaseEndDate: toYMD(condo.leaseEndDate),
    notes: condo.notes ?? null,
    responsibleEmployeeId:
      typeof condo.responsibleEmployeeId === "number"
        ? condo.responsibleEmployeeId
        : 0,
    pricePerDay: typeof condo.pricePerDay === "number" ? condo.pricePerDay : 0,
    pricePerMonth:
      typeof condo.pricePerMonth === "number" ? condo.pricePerMonth : 0,
    currency: condo.currency ?? "EUR",
  };
}
