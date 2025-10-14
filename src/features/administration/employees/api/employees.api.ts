import { authFetch } from "../../../../lib/authFetch";
import type {
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
};
