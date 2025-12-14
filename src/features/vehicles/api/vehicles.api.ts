import type {
  Vehicle,
  NewVehicleRequest,
  UpdateVehicleRequest,
  PagedResult,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/Vehicles";

export const VehiclesApi = {
  add: async (payload: NewVehicleRequest) => {
    return authFetch<ApiEnvelope<Vehicle>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateVehicleRequest) => {
    return authFetch<ApiEnvelope<Vehicle>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (vehicleId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${vehicleId}`, {
      method: "DELETE",
    });
  },

  getById: async (vehicleId: number): Promise<Vehicle> => {
    const res = await authFetch<ApiEnvelope<Vehicle>>(`${base}/${vehicleId}`);
    return res.data;
  },

  getAll: async (page: number, pageSize: number) => {
    const res = await authFetch<ApiEnvelope<PagedResult<Vehicle>>>(
      `${base}/get-all?Page=${page}&PageSize=${pageSize}`
    );
    return res.data;
  },
};
