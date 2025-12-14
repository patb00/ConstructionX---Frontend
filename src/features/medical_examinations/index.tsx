export interface MedicalExamination {
  id: number;
  employeeId: number;
  examinationTypeId: number;
  examinationTypeName: string;
  examinationDate: string;
  nextExaminationDate: string;
  result: string;
  note: string | null;
  certificatePath: string | null;
  createdDate: string;
  createdBy: string;
  modifiedDate: string | null;
  modifiedBy: string | null;
}

export interface NewMedicalExaminationRequest {
  employeeId: number;
  examinationTypeId: number;
  examinationDate: string;
  nextExaminationDate: string;
  result: string;
  note: string;
}

export interface UpdateMedicalExaminationRequest {
  id: number;
  examinationTypeId: number;
  examinationDate: string;
  nextExaminationDate: string;
  result: string;
  note: string;
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
