import { REPORT_HANDLERS } from "../config/reportHandlers";

type OpenReportArgs = {
  culture: string;
  params?: {
    startDate?: string;
    plannedEndDate?: string;
    siteManagerId?: number | null;
    status?: string;
  };
};

export async function openReport(reportId: string, args: OpenReportArgs) {
  const handler = REPORT_HANDLERS[reportId as keyof typeof REPORT_HANDLERS];
  if (!handler) {
    throw new Error(`Missing report handler for reportId=${reportId}`);
  }
  return handler(args as any);
}
