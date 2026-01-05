export interface Certification {
  id: number;
  employeeId: number;
  certificationTypeId: number;
  certificationTypeName: string;
  certificationDate: string;
  nextCertificationDate: string;
  status: string;
  certificatePath: string;
  note: string | null;
  reminderSentDate: string | null;
  createdDate: string;
  createdBy: string;
  modifiedDate: string | null;
  modifiedBy: string | null;
}

export interface NewCertificationRequest {
  employeeId: number;
  certificationTypeId: number;
  certificationDate: string;
  nextCertificationDate: string;
  status: string;
  certificatePath: string;
  note: string;
  reminderSentDate: string;
}

export interface UpdateCertificationRequest {
  id: number;
  employeeId: number;
  certificationTypeId: number;
  certificationDate: string;
  nextCertificationDate: string;
  status: string;
  certificatePath: string;
  note: string;
  reminderSentDate: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
