import { useQuery } from "@tanstack/react-query";
import type { CertificationType } from "..";
import { certificationTypesKeys } from "../api/certification-types.keys";
import { CertificationTypesApi } from "../api/certification-types.api";

export function useCertificationType(certificationTypeId: number) {
  return useQuery<CertificationType>({
    queryKey: certificationTypesKeys.detail(certificationTypeId),
    queryFn: () => CertificationTypesApi.getById(certificationTypeId),
    enabled: !!certificationTypeId,
  });
}
