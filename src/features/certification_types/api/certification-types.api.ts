import type {
  CertificationType,
  NewCertificationTypeRequest,
  UpdateCertificationTypeRequest,
} from "..";
import { authFetch, authFetchBlob } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/CertificationTypes";

export const CertificationTypesApi = {
  add: async (payload: NewCertificationTypeRequest) => {
    return authFetch<ApiEnvelope<CertificationType>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateCertificationTypeRequest) => {
    return authFetch<ApiEnvelope<CertificationType>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (certificationTypeId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${certificationTypeId}`, {
      method: "DELETE",
    });
  },

  getById: async (
    certificationTypeId: number
  ): Promise<CertificationType> => {
    const res = await authFetch<ApiEnvelope<CertificationType>>(
      `${base}/${certificationTypeId}`
    );
    return res.data;
  },

  getAll: async (): Promise<CertificationType[]> => {
    const res = await authFetch<ApiEnvelope<CertificationType[]>>(
      `${base}/get-all`
    );
    return res.data;
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
