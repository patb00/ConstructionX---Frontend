import { authFetchBlob } from "../../../lib/authFetch";

const base = "/api/Reports";

export const ReportsApi = {
  getEmployeesEmployeeListFile: async (culture: string): Promise<Blob> => {
    const url = `${base}/employees/employee-list?culture=${encodeURIComponent(
      culture,
    )}`;
    return authFetchBlob(url, { method: "GET" });
  },

  getVehiclesVehicleListFile: async (culture: string): Promise<Blob> => {
    const url = `${base}/vehicles/vehicle-list?culture=${encodeURIComponent(
      culture,
    )}`;
    return authFetchBlob(url, { method: "GET" });
  },

  getToolsToolListFile: async (culture: string): Promise<Blob> => {
    const url = `${base}/tools/tool-list?culture=${encodeURIComponent(culture)}`;
    return authFetchBlob(url, { method: "GET" });
  },

  getConstructionSitesConstructionSiteListFile: async (
    culture: string,
    startDate?: string,
    plannedEndDate?: string,
    siteManagerId?: number | null,
    status?: string,
  ): Promise<Blob> => {
    let url =
      `${base}/construction-sites/construction-site-list` +
      `?culture=${encodeURIComponent(culture)}`;

    if (startDate) url += `&startDate=${encodeURIComponent(startDate)}`;
    if (plannedEndDate)
      url += `&plannedEndDate=${encodeURIComponent(plannedEndDate)}`;
    if (siteManagerId != null) url += `&siteManagerId=${siteManagerId}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;

    return authFetchBlob(url, { method: "GET" });
  },

  getConstructionSitesTotalHoursFile: async (
    culture: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<Blob> => {
    let url =
      `${base}/construction-sites/total-hours` +
      `?culture=${encodeURIComponent(culture)}`;

    if (dateFrom) url += `&dateFrom=${encodeURIComponent(dateFrom)}`;
    if (dateTo) url += `&dateTo=${encodeURIComponent(dateTo)}`;

    return authFetchBlob(url, { method: "GET" });
  },
};
