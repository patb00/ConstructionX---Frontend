export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  oib: string;
  dateOfBirth: string;
  employmentDate: string;
  phoneNumber: string;
  terminationDate?: string | null;
  hasMachineryLicense: boolean;
  clothingSize: string;
  gloveSize: string;
  description: string;
  shoeSize: number;
  email: string;
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

export interface AssignedConstructionSite {
  constructionSiteId: number;
  employeeId: number;
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  siteManagerName: string;
  siteManagerPhoneNumber: string | null;
  dateFrom: string;
  dateTo: string;
}

export interface AssignedVehicle {
  constructionSiteId: number;
  constructionSiteLocation: string;
  constructionSiteName: string;
  vehicleId: number;
  registrationNumber: string;
  vin: string;
  brand: string;
  model: string;
  yearOfManufacturing: number;
  vehicleType: string;
  dateFrom: string;
  dateTo: string;
  isActive: boolean;
  responsibleEmployeeId: number;
  responsibleEmployeeFullName: string;
}

export interface AssignedTool {
  constructionSiteId: number;
  constructionSiteLocation: string;
  constructionSiteName: string;
  toolId: number;
  name: string;
  inventoryNumber: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  condition: string;
  dateFrom: string;
  dateTo: string;
  isActive: boolean;
  responsibleEmployeeId: number;
  responsibleEmployeeFullName: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
