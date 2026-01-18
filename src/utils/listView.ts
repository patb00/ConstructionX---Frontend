export function isDownOrEqual(
  bp: "sm" | "md" | "lg",
  flags: { smDown: boolean; mdDown: boolean; lgDown: boolean }
) {
  if (bp === "sm") return flags.smDown;
  if (bp === "md") return flags.mdDown;
  return flags.lgDown;
}
