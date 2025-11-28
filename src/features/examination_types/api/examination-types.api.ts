import type {
  ExaminationType,
  NewExaminationTypeRequest,
  UpdateExaminationTypeRequest,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/ExaminationTypes";

export const ExaminationTypesApi = {
  add: async (payload: NewExaminationTypeRequest) => {
    return authFetch<ApiEnvelope<ExaminationType>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateExaminationTypeRequest) => {
    return authFetch<ApiEnvelope<ExaminationType>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (examinationTypeId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${examinationTypeId}`, {
      method: "DELETE",
    });
  },

  getById: async (examinationTypeId: number): Promise<ExaminationType> => {
    const res = await authFetch<ApiEnvelope<ExaminationType>>(
      `${base}/${examinationTypeId}`
    );
    return res.data;
  },

  getAll: async (): Promise<ExaminationType[]> => {
    const res = await authFetch<ApiEnvelope<ExaminationType[]>>(
      `${base}/get-all`
    );
    return res.data;
  },
};
