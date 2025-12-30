import type { NewToolRequest } from "..";

const toYMD = (s?: string | null) => (s ? s.slice(0, 10) : "");

export function toolToDefaultValues(
  tool: any | null | undefined
): Partial<NewToolRequest> | undefined {
  if (!tool) return undefined;

  return {
    name: tool.name ?? "",
    inventoryNumber: tool.inventoryNumber ?? null,
    serialNumber: tool.serialNumber ?? null,
    manufacturer: tool.manufacturer ?? null,
    model: tool.model ?? null,
    purchaseDate: toYMD(tool.purchaseDate),
    purchasePrice:
      typeof tool.purchasePrice === "number" ? tool.purchasePrice : 0,
    status: tool.status ?? null,
    condition: tool.condition ?? null,
    description: tool.description ?? null,
    toolCategoryId: tool.toolCategoryId ?? null,
    responsibleEmployeeId: tool.responsibleEmployeeId ?? null,
  };
}
