export const reportsKeys = {
  all: ["reports"] as const,

  employees: () => [...reportsKeys.all, "employees"] as const,

  employeesEmployeeList: (culture: string = "en-GB") =>
    [...reportsKeys.employees(), "employee-list", culture] as const,
};
