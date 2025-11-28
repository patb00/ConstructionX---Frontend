import type { ModuleId } from "../../../app/routes/config";

export type ReportId = "employee-list";

export type ReportDefinition = {
  id: ReportId;
  moduleId: ModuleId;
  labelKey: string;
  descriptionKey?: string;
};

export const REPORTS: ReportDefinition[] = [
  {
    id: "employee-list",
    moduleId: "employees",
    labelKey: "reports.items.employeeList.label",
    descriptionKey: "reports.items.employeeList.description",
  },
];

export const getReportsByModuleId = (moduleId: ModuleId): ReportDefinition[] =>
  REPORTS.filter((report) => report.moduleId === moduleId);
