import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type Option = { label: string; value: string };

export type CertificationStatus = "PASSED" | "FAILED";

export function useCertificationStatusOptions() {
  const { t } = useTranslation();

  const options: Option[] = useMemo(
    () => [
      { value: "PASSED", label: t("certifications.status.passed") },
      { value: "FAILED", label: t("certifications.status.failed") },
    ],
    [t]
  );

  return { options };
}
