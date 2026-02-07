import type { PropsWithChildren } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTranslation } from "react-i18next";
import { enUS, hr, de } from "date-fns/locale";

const locales: Record<string, any> = {
  en: enUS,
  hr: hr,
  de: de,
};

export function MuiDateProvider({ children }: PropsWithChildren) {
  const { t, i18n } = useTranslation();
  
  const languageKey = i18n.language.split('-')[0];
  const currentLocale = locales[languageKey] ?? locales.hr;

  return (
    <LocalizationProvider 
      dateAdapter={AdapterDateFns} 
      adapterLocale={currentLocale}
      localeText={{
        cancelButtonLabel: t("common.cancel"),
        okButtonLabel: t("common.ok"),
      }}
    >
      {children}
    </LocalizationProvider>
  );
}
