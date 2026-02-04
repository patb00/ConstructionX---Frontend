type NameLike = { firstName?: string | null; lastName?: string | null };

export function getUserInitials(user: NameLike | null | undefined) {
  if (!user) return "";
  const first = (user.firstName ?? "").trim();
  const last = (user.lastName ?? "").trim();
  return `${first ? first[0] : ""}${last ? last[0] : ""}`.toUpperCase();
}
