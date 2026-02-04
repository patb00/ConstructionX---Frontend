export const normalizeText = (s?: string | null): string =>
  (s ?? "")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
