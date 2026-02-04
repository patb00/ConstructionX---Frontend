import type { NewVehicleInsuranceRequest, VehicleInsurance } from "..";

export function vehicleInsuranceToDefaultValues(
  insurance?: VehicleInsurance | null
): Partial<NewVehicleInsuranceRequest> | undefined {
  if (!insurance) return undefined;

  return {
    vehicleId: insurance.vehicleId,
    insurer: insurance.insurer ?? "",
    policyNumber: insurance.policyNumber ?? "",
    policyType: insurance.policyType ?? undefined,
    costAmount: insurance.costAmount ?? 0,
    costCurrency: insurance.costCurrency ?? "",
    validFrom: insurance.validFrom,
    validTo: insurance.validTo,
    documentPath: insurance.documentPath ?? "",
  };
}
