import { NAV_ITEMS } from "../../../app/routes/navigation";
import { getModuleIdFromNavItem } from "../../../utils/navigationUtils";

export function getReportModules() {
  return NAV_ITEMS.filter(
    (item) => getModuleIdFromNavItem(item) === "employees"
  );
}
