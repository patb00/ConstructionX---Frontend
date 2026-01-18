import type { ModuleId } from "../../../app/routes/navigation";

export type ReportId = "employee-list" | "vehicle-list" | "tool-list";

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
  {
    id: "vehicle-list",
    moduleId: "vehicles",
    labelKey: "reports.items.vehicleList.label",
    descriptionKey: "reports.items.vehicleList.description",
  },
  {
    id: "tool-list",
    moduleId: "tools",
    labelKey: "reports.items.toolList.label",
    descriptionKey: "reports.items.toolList.description",
  },
];

export const getReportsByModuleId = (moduleId: ModuleId): ReportDefinition[] =>
  REPORTS.filter((report) => report.moduleId === moduleId);
