import type {
  Certification,
  NewCertificationRequest,
  PagedResult,
  UpdateCertificationRequest,
} from "..";
import { authFetch, authFetchBlob } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/Certifications";

export const CertificationsApi = {
  add: async (payload: NewCertificationRequest) => {
    return authFetch<ApiEnvelope<Certification>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateCertificationRequest) => {
    return authFetch<ApiEnvelope<Certification>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (certificationId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${certificationId}`, {
      method: "DELETE",
    });
  },

  getById: async (certificationId: number): Promise<Certification> => {
    const res = await authFetch<ApiEnvelope<Certification>>(
      `${base}/${certificationId}`
    );
    return res.data;
  },

  getAll: async (page: number, pageSize: number) => {
    const res = await authFetch<ApiEnvelope<PagedResult<Certification>>>(
      `${base}/get-all?Page=${page}&PageSize=${pageSize}`
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
