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

export type NewEmployeeRequest = Omit<Employee, "id">;

export type UpdateEmployeeRequest = Employee;
