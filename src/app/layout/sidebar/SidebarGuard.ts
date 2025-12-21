export type SidebarGuard = { tenant?: "root" | "any"; permission?: string };

export function canSeeItem(
  guard: SidebarGuard | undefined,
  tenant: string | null,
  permissions: string[]
) {
  if (!guard) return true;
  if (guard.tenant === "root" && tenant !== "root") return false;
  if (guard.permission && !permissions.includes(guard.permission)) return false;
  return true;
}
