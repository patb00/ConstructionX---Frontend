import type {
  VehicleRegistration,
  NewVehicleRegistrationRequest,
  UpdateVehicleRegistrationRequest,
  PagedResult,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/VehicleRegistrations";

export const VehicleRegistrationsApi = {
  add: async (payload: NewVehicleRegistrationRequest) => {
    return authFetch<ApiEnvelope<VehicleRegistration>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateVehicleRegistrationRequest) => {
    return authFetch<ApiEnvelope<VehicleRegistration>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (registrationId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${registrationId}`, {
      method: "DELETE",
    });
  },

  getById: async (registrationId: number): Promise<VehicleRegistration> => {
    const res = await authFetch<ApiEnvelope<VehicleRegistration>>(
      `${base}/${registrationId}`
    );
    return res.data;
  },

  getAll: async (page: number, pageSize: number) => {
    const res = await authFetch<ApiEnvelope<PagedResult<VehicleRegistration>>>(
      `${base}/get-all?Page=${page}&PageSize=${pageSize}`
    );
    return res.data;
  },

  getByVehicleId: async (vehicleId: number): Promise<VehicleRegistration[]> => {
    const res = await authFetch<ApiEnvelope<VehicleRegistration[]>>(
      `${base}/by-vehicle/${vehicleId}`
    );
    return res.data;
  },
};
