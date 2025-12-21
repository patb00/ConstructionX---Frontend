export function groupPermissions(perms: string[] = []) {
  const groups: Record<string, string[]> = {};
  perms.forEach((p) => {
    const parts = p.split(".");
    const group = parts[1] ?? "Other";
    (groups[group] ??= []).push(p);
  });
  return groups;
}
