import type {
  VehicleInsurance,
  NewVehicleInsuranceRequest,
  UpdateVehicleInsuranceRequest,
  PagedResult,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/VehicleInsurances";

export const VehicleInsurancesApi = {
  add: async (payload: NewVehicleInsuranceRequest) => {
    return authFetch<ApiEnvelope<VehicleInsurance>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateVehicleInsuranceRequest) => {
    return authFetch<ApiEnvelope<VehicleInsurance>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (insuranceId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${insuranceId}`, {
      method: "DELETE",
    });
  },

  getById: async (insuranceId: number): Promise<VehicleInsurance> => {
    const res = await authFetch<ApiEnvelope<VehicleInsurance>>(
      `${base}/${insuranceId}`
    );
    return res.data;
  },

  getAll: async (page: number, pageSize: number) => {
    const res = await authFetch<ApiEnvelope<PagedResult<VehicleInsurance>>>(
      `${base}/get-all?Page=${page}&PageSize=${pageSize}`
    );
    return res.data;
  },

  getByVehicle: async (vehicleId: number) => {
    const res = await authFetch<ApiEnvelope<VehicleInsurance[]>>(
      `${base}/by-vehicle/${vehicleId}`
    );
    return res.data;
  },
};
