export const reportsKeys = {
  all: ["reports"] as const,

  employees: () => [...reportsKeys.all, "employees"] as const,
  vehicles: () => [...reportsKeys.all, "vehicles"] as const,
  constructionSites: () => [...reportsKeys.all, "construction-sites"] as const,

  employeesEmployeeList: (culture: string = "en-GB") =>
    [...reportsKeys.employees(), "employee-list", culture] as const,

  vehiclesVehicleList: (culture: string = "en-GB") =>
    [...reportsKeys.vehicles(), "vehicle-list", culture] as const,

  constructionSitesConstructionSiteList: (culture: string = "en-GB") =>
    [
      ...reportsKeys.constructionSites(),
      "construction-site-list",
      culture,
    ] as const,
};
