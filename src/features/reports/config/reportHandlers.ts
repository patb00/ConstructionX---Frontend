import { ReportsApi } from "../api/reports.api";
import type { ReportId } from "./reports.config";

export type ReportHandlerContext = {
  culture: string;
  params?: {
    startDate?: string;
    plannedEndDate?: string;
    siteManagerId?: number | null;
    status?: string;
  };
};

export type ReportHandler = (ctx: ReportHandlerContext) => Promise<void>;

const openBlobInNewTab = (blob: Blob) => {
  const blobUrl = window.URL.createObjectURL(blob);

  window.open(blobUrl, "_blank", "noopener,noreferrer");

  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 60_000);
};

export const REPORT_HANDLERS: Partial<Record<ReportId, ReportHandler>> = {
  "employee-list": async ({ culture }) => {
    const blob = await ReportsApi.getEmployeesEmployeeListFile(culture);
    openBlobInNewTab(blob);
  },

  "vehicle-list": async ({ culture }) => {
    const blob = await ReportsApi.getVehiclesVehicleListFile(culture);
    openBlobInNewTab(blob);
  },

  "tool-list": async ({ culture }) => {
    const blob = await ReportsApi.getToolsToolListFile(culture);
    openBlobInNewTab(blob);
  },

  "construction-site-list": async ({ culture, params }) => {
    const blob = await ReportsApi.getConstructionSitesConstructionSiteListFile(
      culture,
      params?.startDate,
      params?.plannedEndDate,
      params?.siteManagerId,
      params?.status,
    );

    openBlobInNewTab(blob);
  },
};
