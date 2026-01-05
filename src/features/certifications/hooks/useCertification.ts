import { useQuery } from "@tanstack/react-query";
import type { Certification } from "..";
import { certificationsKeys } from "../api/certifications.keys";
import { CertificationsApi } from "../api/certifications.api";

export function useCertification(certificationId: number) {
  return useQuery<Certification>({
    queryKey: certificationsKeys.detail(certificationId),
    queryFn: () => CertificationsApi.getById(certificationId),
    enabled: !!certificationId,
  });
}
