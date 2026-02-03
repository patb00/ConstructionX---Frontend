import type {
  MedicalExamination,
  NewMedicalExaminationRequest,
  PagedResult,
  UpdateMedicalExaminationRequest,
} from "..";
import { authFetch, authFetchBlob } from "../../../lib/authFetch";
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

  getAll: async (page: number, pageSize: number) => {
    const res = await authFetch<ApiEnvelope<PagedResult<MedicalExamination>>>(
      `${base}/get-all?Page=${page}&PageSize=${pageSize}`
    );
    return res.data;
  },

  getByEmployee: async (employeeId: number): Promise<MedicalExamination[]> => {
    const res = await authFetch<ApiEnvelope<MedicalExamination[]>>(
      `${base}/by-employee/${employeeId}`
    );
    return res.data;
  },

  getByExaminationType: async (
    examinationTypeId: number
  ): Promise<MedicalExamination[]> => {
    const res = await authFetch<ApiEnvelope<MedicalExamination[]>>(
      `${base}/by-examination-type/${examinationTypeId}`
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

  downloadCertificate: async (medicalExaminationId: number) => {
    return authFetchBlob(
      `${base}/${medicalExaminationId}/download-certificate`,
      {
        method: "GET",
      }
    );
  },

  export: async () => {
    return authFetchBlob(`${base}/export`, { method: "GET" });
  },

  import: async (file: File) => {
    const formData = new FormData();
    formData.append("UploadFile", file);
    return authFetchBlob(`${base}/import`, {
      method: "POST",
      body: formData,
    });
  },
};
