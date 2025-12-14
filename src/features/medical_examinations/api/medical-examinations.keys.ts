export const medicalExaminationsKeys = {
  all: ["medical-examinations"] as const,
  list: (page: number, pageSize: number) =>
    [...medicalExaminationsKeys.all, "list", { page, pageSize }] as const,
  detail: (id: number) =>
    [...medicalExaminationsKeys.all, "detail", id] as const,
  byEmployee: (employeeId: number) =>
    [...medicalExaminationsKeys.all, "by-employee", employeeId] as const,
};
