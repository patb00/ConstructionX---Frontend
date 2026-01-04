import type i18nType from "i18next";

const LOCALE_MAP: Record<string, string> = {
  en: "en-GB",
  hr: "hr-HR",
  de: "de-DE",
};

export function getIntlLocale(i18n: typeof i18nType): string {
  const lng = i18n.resolvedLanguage ?? i18n.language ?? "hr";
  const base = lng.split("-")[0];
  return LOCALE_MAP[base] ?? "hr-HR";
}
