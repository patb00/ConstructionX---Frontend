import type { Employee, EmployeeFormValues } from "..";

const toYMD = (s?: string | null) => (s ? s.slice(0, 10) : "");

const getJobPositionId = (emp: any): number | "" => {
  const raw = emp?.jobPositionId ?? emp?.jobPosition?.id ?? "";
  if (raw === "" || raw == null) return "";
  return typeof raw === "number" ? raw : Number(raw);
};

export function employeeToDefaultValues(
  emp: Employee
): Partial<EmployeeFormValues> {
  return {
    firstName: emp.firstName ?? "",
    lastName: emp.lastName ?? "",
    email: emp.email,
    oib: (emp as any).oib ?? "",
    dateOfBirth: toYMD((emp as any).dateOfBirth),
    employmentDate: toYMD((emp as any).employmentDate),
    terminationDate: toYMD((emp as any).terminationDate),
    hasMachineryLicense: Boolean((emp as any).hasMachineryLicense),
    clothingSize: (emp as any).clothingSize ?? "",
    gloveSize: (emp as any).gloveSize ?? "",
    shoeSize:
      typeof (emp as any).shoeSize === "number"
        ? (emp as any).shoeSize
        : ("" as any),
    jobPositionId: getJobPositionId(emp),
  };
}

export function employeeInitialJobPositionId(emp: Employee): number | "" {
  return getJobPositionId(emp);
}
