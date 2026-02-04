// src/features/examination_types/index.ts

export interface ExaminationType {
  id: number;
  examinationTypeName: string;
  monthsToNextExamination: number;
}

export interface NewExaminationTypeRequest {
  examinationTypeName: string;
  monthsToNextExamination: number;
}

export interface UpdateExaminationTypeRequest {
  id: number;
  examinationTypeName: string;
  monthsToNextExamination: number;
}
