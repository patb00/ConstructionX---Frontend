import { authFetch } from "../../../../lib/authFetch";
import type {
  JobPosition,
  NewJobPositionRequest,
  UpdateJobPositionRequest,
} from "..";
import type { ApiEnvelope } from "../../tenants";

const base = "/api/JobPositions";

export const JobPositionsApi = {
  add: async (payload: NewJobPositionRequest) => {
    return authFetch<ApiEnvelope<JobPosition>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateJobPositionRequest) => {
    return authFetch<ApiEnvelope<JobPosition>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (jobPositionId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${jobPositionId}`, {
      method: "DELETE",
    });
  },

  getById: async (jobPositionId: number): Promise<JobPosition> => {
    const res = await authFetch<ApiEnvelope<JobPosition>>(
      `${base}/${jobPositionId}`
    );
    return res.data;
  },

  getAll: async (): Promise<JobPosition[]> => {
    const res = await authFetch<ApiEnvelope<JobPosition[]>>(`${base}/get-all`);
    return res.data;
  },
};
