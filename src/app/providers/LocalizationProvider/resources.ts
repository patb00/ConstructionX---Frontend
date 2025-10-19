import en from "../../../assets/locales/en/common.json";
import hr from "../../../assets/locales/hr/common.json";
import de from "../../../assets/locales/de/common.json";

export const resources = {
  en: { common: en },
  hr: { common: hr },
  de: { common: de },
} as const;

export type AppLanguages = keyof typeof resources;
export const defaultNS = "common";
export const supportedLngs: AppLanguages[] = ["en", "hr", "de"];
