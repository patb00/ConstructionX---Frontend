import { authFetch } from "../../../../lib/authFetch";
import type {
  AssignedConstructionSite,
  AssignedTool,
  AssignedVehicle,
  AssignJobPositionRequest,
  Employee,
  NewEmployeeRequest,
  UpdateEmployeeRequest,
} from "..";
import type { ApiEnvelope } from "../../tenants";

const base = "/api/Employees";

export const EmployeesApi = {
  add: async (payload: NewEmployeeRequest) => {
    return authFetch<ApiEnvelope<number>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateEmployeeRequest) => {
    return authFetch<ApiEnvelope<Employee>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  assignJobPosition: async (payload: AssignJobPositionRequest) => {
    return authFetch<ApiEnvelope<Employee>>(`${base}/assign-job-position`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (employeeId: number) => {
    return authFetch<ApiEnvelope<Employee>>(`${base}/${employeeId}`, {
      method: "DELETE",
    });
  },

  getById: async (employeeId: number): Promise<Employee> => {
    const res = await authFetch<ApiEnvelope<Employee>>(`${base}/${employeeId}`);
    return res.data;
  },

  getAll: async (): Promise<Employee[]> => {
    const res = await authFetch<ApiEnvelope<Employee[]>>(`${base}/get-all`);
    return res.data;
  },

  getByMachineryLicense: async (hasLicense: boolean): Promise<Employee[]> => {
    const res = await authFetch<ApiEnvelope<Employee[]>>(
      `${base}/all-machinery-license?hasLicense=${encodeURIComponent(
        hasLicense
      )}`
    );
    return res.data;
  },

  getAssignedConstructionSites: async (): Promise<
    AssignedConstructionSite[]
  > => {
    const res = await authFetch<ApiEnvelope<AssignedConstructionSite[]>>(
      `${base}/assigned-construction-sites`
    );
    return res.data;
  },

  getAssignedVehicles: async (): Promise<AssignedVehicle[]> => {
    const res = await authFetch<ApiEnvelope<AssignedVehicle[]>>(
      `${base}/assigned-vehicles`
    );
    return res.data;
  },

  getAssignedTools: async (): Promise<AssignedTool[]> => {
    const res = await authFetch<ApiEnvelope<AssignedTool[]>>(
      `${base}/assigned-tools`
    );
    return res.data;
  },
};
