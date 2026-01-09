import type { ToolRepair, NewToolRepairRequest } from "..";

export function toolRepairToDefaultValues(
  r?: ToolRepair
): NewToolRepairRequest | undefined {
  if (!r) return undefined;

  return {
    toolId: r.toolId,
    repairDate: r.repairDate,
    cost: r.cost,
    condition: r.condition ?? null,
    description: r.description ?? null,
  };
}
