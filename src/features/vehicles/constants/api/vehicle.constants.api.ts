import { authFetch } from "../../../../lib/authFetch";
import type { ApiEnvelope } from "../../../administration/tenants";

const base = "/api/Constants";

export const VehicleConstantsApi = {
  getStatuses: async (): Promise<string[]> => {
    const res = await authFetch<ApiEnvelope<string[]>>(
      `${base}/vehicle-statuses`
    );

    return (res as any)?.data ?? (res as any);
  },

  getConditions: async (): Promise<string[]> => {
    const res = await authFetch<ApiEnvelope<string[]>>(
      `${base}/vehicle-conditions`
    );
    return (res as any)?.data ?? (res as any);
  },

  getTypes: async (): Promise<string[]> => {
    const res = await authFetch<ApiEnvelope<string[]>>(`${base}/vehicle-types`);
    return (res as any)?.data ?? (res as any);
  },
};
