import { NAV_ITEMS, type ModuleId, type NavItem } from "./navigation";

export const getModuleIdFromNavItem = (item: NavItem): ModuleId =>
  item.labelKey.replace(/^nav\./, "") as ModuleId;

export const getNavItemByModuleId = (moduleId: ModuleId): NavItem | undefined =>
  NAV_ITEMS.find((item) => getModuleIdFromNavItem(item) === moduleId);
