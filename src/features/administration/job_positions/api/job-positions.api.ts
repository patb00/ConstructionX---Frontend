import { httpGet, httpPost, httpPut, httpDelete } from "../../../../lib/http";
import type {
  JobPosition,
  NewJobPositionRequest,
  UpdateJobPositionRequest,
} from "..";
import type { ApiEnvelope } from "../../tenants";

const base = "/api/JobPositions";

export const JobPositionsApi = {
  add: async (payload: NewJobPositionRequest) => {
    const res = await httpPost<ApiEnvelope<JobPosition>>(
      `${base}/add`,
      payload
    );
    return res;
  },

  update: async (payload: UpdateJobPositionRequest) => {
    const res = await httpPut<ApiEnvelope<JobPosition>>(
      `${base}/update`,
      payload
    );
    return res;
  },

  delete: async (jobPositionId: number) => {
    // The spec shows a string body on 200 for DELETE; type accordingly.
    const res = await httpDelete<ApiEnvelope<string>>(
      `${base}/${jobPositionId}`
    );
    return res;
  },

  getById: async (jobPositionId: number): Promise<JobPosition> => {
    const res = await httpGet<ApiEnvelope<JobPosition>>(
      `${base}/${jobPositionId}`
    );
    return res.data;
  },

  getAll: async (): Promise<JobPosition[]> => {
    const res = await httpGet<ApiEnvelope<JobPosition[]>>(`${base}/get-all`);
    return res.data;
  },
};
