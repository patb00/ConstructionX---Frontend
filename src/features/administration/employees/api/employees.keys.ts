export const employeesKeys = {
  all: ["employees"] as const,
  list: () => [...employeesKeys.all, "list"] as const,
  detail: (id: number | string) =>
    [...employeesKeys.all, "detail", id] as const,
  byMachineryLicense: (hasLicense: boolean) =>
    [...employeesKeys.all, "machinery-license", hasLicense] as const,
  assignedConstructionSites: () =>
    [...employeesKeys.all, "assigned-construction-sites"] as const,
  assignedVehicles: () => [...employeesKeys.all, "assigned-vehicles"] as const,
  assignedTools: () => [...employeesKeys.all, "assigned-tools"] as const,
};
