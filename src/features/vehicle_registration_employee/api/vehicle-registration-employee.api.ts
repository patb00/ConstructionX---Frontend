import type {
  AddVehicleRegistrationEmployeeRequest,
  GetVehicleRegistrationEmployeesQuery,
  UpdateVehicleRegistrationEmployeeRequest,
  VehicleRegistrationEmployee,
  PagedResult,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/VehicleRegistrationEmployees";

export const VehicleRegistrationEmployeesApi = {
  add: async (payload: AddVehicleRegistrationEmployeeRequest) => {
    return authFetch<ApiEnvelope<VehicleRegistrationEmployee>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateVehicleRegistrationEmployeeRequest) => {
    return authFetch<ApiEnvelope<VehicleRegistrationEmployee>>(
      `${base}/update`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },

  delete: async (taskId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${taskId}`, {
      method: "DELETE",
    });
  },

  getById: async (taskId: number): Promise<VehicleRegistrationEmployee> => {
    const res = await authFetch<ApiEnvelope<VehicleRegistrationEmployee>>(
      `${base}/${taskId}`
    );
    return res.data;
  },

  getAll: async (
    query?: GetVehicleRegistrationEmployeesQuery
  ): Promise<PagedResult<VehicleRegistrationEmployee>> => {
    const params = new URLSearchParams();

    params.append("Page", String(query?.page ?? 1));
    params.append("PageSize", String(query?.pageSize ?? 20));

    const qs = params.toString();
    const url = qs ? `${base}/get-all?${qs}` : `${base}/get-all`;

    const res = await authFetch<
      ApiEnvelope<PagedResult<VehicleRegistrationEmployee>>
    >(url);

    return res.data;
  },

  byVehicle: async (
    vehicleId: number
  ): Promise<VehicleRegistrationEmployee[]> => {
    const res = await authFetch<ApiEnvelope<VehicleRegistrationEmployee[]>>(
      `${base}/by-vehicle/${vehicleId}`
    );
    return res.data;
  },

  byEmployee: async (
    employeeId: number
  ): Promise<VehicleRegistrationEmployee[]> => {
    const res = await authFetch<ApiEnvelope<VehicleRegistrationEmployee[]>>(
      `${base}/by-employee/${employeeId}`
    );
    return res.data;
  },
};
