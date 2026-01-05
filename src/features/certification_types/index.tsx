export interface CertificationType {
  id: number;
  certificationTypeName: string;
  requiresRenewal: boolean;
  monthsToRenewal: number;
}

export interface NewCertificationTypeRequest {
  certificationTypeName: string;
  requiresRenewal: boolean;
  monthsToRenewal: number;
}

export interface UpdateCertificationTypeRequest {
  id: number;
  certificationTypeName: string;
  requiresRenewal: boolean;
  monthsToRenewal: number;
}
