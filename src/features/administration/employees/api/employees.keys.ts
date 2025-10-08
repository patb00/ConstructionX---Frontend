export const employeesKeys = {
  all: ["employees"] as const,
  list: () => [...employeesKeys.all, "list"] as const,
  detail: (id: number | string) =>
    [...employeesKeys.all, "detail", id] as const,
  byMachineryLicense: (hasLicense: boolean) =>
    [...employeesKeys.all, "machinery-license", hasLicense] as const,
};
