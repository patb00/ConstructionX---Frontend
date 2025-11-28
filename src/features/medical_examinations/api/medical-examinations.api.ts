import type {
  MedicalExamination,
  NewMedicalExaminationRequest,
  UpdateMedicalExaminationRequest,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/MedicalExaminations";

export const MedicalExaminationsApi = {
  add: async (payload: NewMedicalExaminationRequest) => {
    return authFetch<ApiEnvelope<MedicalExamination>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateMedicalExaminationRequest) => {
    return authFetch<ApiEnvelope<MedicalExamination>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (medicalExaminationId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${medicalExaminationId}`, {
      method: "DELETE",
    });
  },

  getById: async (
    medicalExaminationId: number
  ): Promise<MedicalExamination> => {
    const res = await authFetch<ApiEnvelope<MedicalExamination>>(
      `${base}/${medicalExaminationId}`
    );
    return res.data;
  },

  getAll: async (): Promise<MedicalExamination[]> => {
    const res = await authFetch<ApiEnvelope<MedicalExamination[]>>(
      `${base}/get-all`
    );
    return res.data;
  },

  getByEmployee: async (employeeId: number): Promise<MedicalExamination[]> => {
    const res = await authFetch<ApiEnvelope<MedicalExamination[]>>(
      `${base}/by-employee/${employeeId}`
    );
    return res.data;
  },

  uploadCertificate: async (medicalExaminationId: number, file: File) => {
    const formData = new FormData();

    formData.append("Id", String(medicalExaminationId));
    formData.append("File", file);

    return authFetch<ApiEnvelope<string>>(
      `${base}/${medicalExaminationId}/upload-certificate`,
      {
        method: "POST",
        body: formData,
      }
    );
  },
};
