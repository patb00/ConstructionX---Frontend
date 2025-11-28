import { authFetchBlob } from "../../../lib/authFetch";

const base = "/api/Reports";

export const ReportsApi = {
  getEmployeesEmployeeListFile: async (culture: string): Promise<Blob> => {
    const url = `${base}/employees/employee-list?culture=${encodeURIComponent(
      culture
    )}`;

    return authFetchBlob(url, {
      method: "GET",
    });
  },
};
