import { httpGet, httpPost, httpPut, httpDelete } from "../../../../lib/http";
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
    const res = await httpPost<ApiEnvelope<number>>(`${base}/add`, payload);
    return res;
  },

  update: async (payload: UpdateEmployeeRequest) => {
    const res = await httpPut<ApiEnvelope<Employee>>(`${base}/update`, payload);
    return res;
  },

  assignJobPosition: async (payload: AssignJobPositionRequest) => {
    const res = await httpPut<ApiEnvelope<Employee>>(
      `${base}/assign-job-position`,
      payload
    );
    return res;
  },

  delete: async (employeeId: number) => {
    const res = await httpDelete<ApiEnvelope<Employee>>(
      `${base}/${employeeId}`
    );
    return res;
  },

  getById: async (employeeId: number): Promise<Employee> => {
    const res = await httpGet<ApiEnvelope<Employee>>(`${base}/${employeeId}`);
    return res.data;
  },

  getAll: async (): Promise<Employee[]> => {
    const res = await httpGet<ApiEnvelope<Employee[]>>(`${base}/get-all`);
    return res.data;
  },

  getByMachineryLicense: async (hasLicense: boolean): Promise<Employee[]> => {
    const res = await httpGet<ApiEnvelope<Employee[]>>(
      `${base}/all-machinery-license?hasLicense=${encodeURIComponent(
        hasLicense
      )}`
    );
    return res.data;
  },
};
