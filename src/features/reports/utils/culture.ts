export function languageToCulture(language?: string | null): string {
  const lng = language?.split("-")[0] ?? "en";

  const map: Record<string, string> = {
    en: "en-GB",
    hr: "hr-HR",
    de: "de-DE",
  };

  return map[lng] ?? "en-GB";
}
