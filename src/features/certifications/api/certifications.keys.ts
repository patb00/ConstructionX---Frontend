export const certificationsKeys = {
  all: ["certifications"] as const,
  list: (page: number, pageSize: number) =>
    [...certificationsKeys.all, "list", { page, pageSize }] as const,
  lists: () => [...certificationsKeys.all, "list"] as const,
  detail: (id: number) =>
    [...certificationsKeys.all, "detail", id] as const,
  byEmployee: (employeeId: number) =>
    [...certificationsKeys.all, "by-employee", employeeId] as const,
  byCertificationType: (certificationTypeId: number) =>
    [
      ...certificationsKeys.all,
      "by-certification-type",
      certificationTypeId,
    ] as const,
};
