import { authFetch } from "../../../../lib/authFetch";

const base = "/api/Constants";

export const ToolConstantsApi = {
  getToolStatuses: async (): Promise<string[]> => {
    return authFetch<string[]>(`${base}/tool-statuses`);
  },

  getToolConditions: async (): Promise<string[]> => {
    return authFetch<string[]>(`${base}/tool-conditions`);
  },
};
