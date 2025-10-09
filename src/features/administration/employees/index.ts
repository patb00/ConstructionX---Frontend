export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  oib: string;
  dateOfBirth: string;
  employmentDate: string;
  terminationDate?: string | null;
  hasMachineryLicense: boolean;
  clothingSize: string;
  gloveSize: string;
  shoeSize: number;
}

export type AssignJobPositionRequest = {
  employeeId: number;
  jobPositionId: number;
};

export type NewEmployeeRequest = Omit<Employee, "id">;

export type EmployeeFormValues = NewEmployeeRequest & {
  jobPositionId?: number | "";
};

export type UpdateEmployeeRequest = Employee;
