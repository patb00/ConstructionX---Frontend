export const medicalExaminationsKeys = {
  all: ["medical-examinations"] as const,
  list: () => [...medicalExaminationsKeys.all, "list"] as const,
  detail: (id: number) =>
    [...medicalExaminationsKeys.all, "detail", id] as const,
  byEmployee: (employeeId: number) =>
    [...medicalExaminationsKeys.all, "by-employee", employeeId] as const,
};
