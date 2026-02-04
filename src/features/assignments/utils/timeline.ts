import type { TFunction } from "i18next";
import type {
  AssignedConstructionSite,
  AssignedTool,
  AssignedVehicle,
  Employee,
} from "../../administration/employees";

import type {
  Lane,
  TimelineItem,
} from "../../../components/ui/views/TimelineView";
import {
  getEmployeeInitials,
  getEmployeeLabel,
} from "../../../utils/employeeUtils";

type Args = {
  construction: AssignedConstructionSite[];
  vehicles: AssignedVehicle[];
  tools: AssignedTool[];
  employees: Employee[];
  t: TFunction;
};

function findEmployee(employees: Employee[], id?: number | null) {
  if (id == null) return null;
  return employees.find((e) => e.id === id) ?? null;
}

function toIsoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function buildAssignmentsTimeline({
  construction,
  vehicles,
  tools,
  employees,
  t,
}: Args): {
  lanes: Lane[];
  items: TimelineItem[];
  startDate: string;
  endDate: string;
} {
  const todayIso = toIsoDay(new Date());

  const lanes: Lane[] = [
    { id: "construction", title: t("assignments.timeline.laneConstruction") },
    { id: "vehicles", title: t("assignments.timeline.laneVehicles") },
    { id: "tools", title: t("assignments.timeline.laneTools") },
  ];

  const items: TimelineItem[] = [];

  const addItem = (item: TimelineItem) => items.push(item);

  construction.forEach((row) => {
    const start =
      row.dateFrom || row.startDate || row.plannedEndDate || todayIso;

    const end =
      row.dateTo ||
      row.plannedEndDate ||
      row.startDate ||
      row.dateFrom ||
      start;

    const employee = findEmployee(employees, row.employeeId);
    const assigneeName = employee ? getEmployeeLabel(employee) : undefined;
    const assigneeInitials = employee
      ? getEmployeeInitials(employee)
      : undefined;

    addItem({
      id: `cs-${row.constructionSiteId}-${
        row.employeeId ?? "x"
      }-${start}-${end}`,
      laneId: "construction",
      title:
        row.name || row.location || t("assignments.timeline.constructionItem"),
      startDate: start,
      endDate: end,
      color: "#F1B103",
      assigneeName,
      assigneeInitials,
    });
  });

  vehicles.forEach((row) => {
    const start = row.dateFrom || todayIso;
    const end = row.dateTo || start;

    const employee = findEmployee(employees, row.responsibleEmployeeId);
    const assigneeName = employee ? getEmployeeLabel(employee) : undefined;
    const assigneeInitials = employee
      ? getEmployeeInitials(employee)
      : undefined;

    const label =
      row.registrationNumber ||
      [row.constructionSiteName, row.constructionSiteLocation]
        .filter(Boolean)
        .join(" · ") ||
      t("assignments.timeline.vehicleItem");

    addItem({
      id: `veh-${row.vehicleId}-${
        row.responsibleEmployeeId ?? "x"
      }-${start}-${end}`,
      laneId: "vehicles",
      title: label,
      startDate: start,
      endDate: end,
      color: "#04befe",
      assigneeName,
      assigneeInitials,
    });
  });

  tools.forEach((row) => {
    const start = row.dateFrom || todayIso;
    const end = row.dateTo || start;

    const employee = findEmployee(employees, row.responsibleEmployeeId);
    const assigneeName = employee ? getEmployeeLabel(employee) : undefined;
    const assigneeInitials = employee
      ? getEmployeeInitials(employee)
      : undefined;

    const label =
      row.name || row.inventoryNumber || t("assignments.timeline.toolItem");

    addItem({
      id: `tool-${row.toolId}-${
        row.responsibleEmployeeId ?? "x"
      }-${start}-${end}`,
      laneId: "tools",
      title: label,
      startDate: start,
      endDate: end,
      color: "#21D191",
      assigneeName,
      assigneeInitials,
    });
  });

  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  for (const it of items) {
    const s = new Date(it.startDate);
    const e = new Date(it.endDate);

    if (!Number.isNaN(s.getTime())) {
      if (!minDate || s < minDate) minDate = s;
    }
    if (!Number.isNaN(e.getTime())) {
      if (!maxDate || e > maxDate) maxDate = e;
    }
  }

  if (!minDate || !maxDate) {
    const today = new Date();
    minDate = today;
    maxDate = today;
  }

  return {
    lanes,
    items,
    startDate: toIsoDay(minDate),
    endDate: toIsoDay(maxDate),
  };
}
