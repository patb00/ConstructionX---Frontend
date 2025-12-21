import { REPORT_HANDLERS } from "../config/reportHandlers";

export async function openReport(reportId: string, args: { culture: string }) {
  const handler = REPORT_HANDLERS[reportId as keyof typeof REPORT_HANDLERS];
  if (!handler) {
    throw new Error(`Missing report handler for reportId=${reportId}`);
  }
  return handler(args);
}
