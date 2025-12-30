import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type CurrencyOption = {
  value: string;
  label: string;
};

export function useCurrencyOptions(): CurrencyOption[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      { value: "EUR", label: t("currency.eur", "EUR") },
      { value: "USD", label: t("currency.usd", "USD") },
      { value: "HRK", label: t("currency.hrk", "HRK") },
      { value: "GBP", label: t("currency.gbp", "GBP") },
    ],
    [t]
  );
}
