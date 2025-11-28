import { ReportsApi } from "../api/reports.api";
import type { ReportId } from "./reports.config";

export type ReportHandlerContext = {
  culture: string;
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
};
