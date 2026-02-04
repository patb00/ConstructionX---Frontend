import { NAV_ITEMS, type NavItem } from "../../../app/routes/navigation";
import { getModuleIdFromNavItem } from "../../../utils/navigationUtils";
import { REPORTS } from "../config/reports.config";

export function getReportModules(): NavItem[] {
  const reportModuleIds = new Set(REPORTS.map((r) => r.moduleId));

  return NAV_ITEMS.filter((item) =>
    reportModuleIds.has(getModuleIdFromNavItem(item)),
  );
}
