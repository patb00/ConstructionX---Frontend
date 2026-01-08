import type { ListViewStatusTag } from "../../components/ui/views/ListView";

export const isVehicleRegistrationFinalStatus = (status?: number | null) =>
  status === 3 || status === 4;

export function getVehicleRegistrationStatusTag(
  status?: number | null
): ListViewStatusTag {
  if (status === 4) return { label: "Cancelled", color: "default" };
  if (status === 3) return { label: "Done", color: "success" };
  if (status === 2) return { label: "In progress", color: "warning" };
  return { label: "New", color: "default" };
}
