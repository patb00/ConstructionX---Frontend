import type { NewMaterialRequest } from "..";

export function materialToDefaultValues(
  material: any | null | undefined
): NewMaterialRequest | undefined {
  if (!material) return undefined;

  return {
    name: material.name ?? "",
    unitOfMeasure: material.unitOfMeasure ?? "",
    quantity: typeof material.quantity === "number" ? material.quantity : 0,
    unitPrice: typeof material.unitPrice === "number" ? material.unitPrice : 0,
    description: material.description ?? null,
    articleCode: material.articleCode ?? null,
    barcode: material.barcode ?? null,
    weight: typeof material.weight === "number" ? material.weight : 0,
  };
}
