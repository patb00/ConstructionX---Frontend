import type {
  VehicleRepair,
  CreateVehicleRepairRequest,
  UpdateVehicleRepairRequest,
  PagedResult,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/VehicleRepairs";

export const VehicleRepairsApi = {
  add: async (payload: CreateVehicleRepairRequest) => {
    return authFetch<ApiEnvelope<VehicleRepair>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateVehicleRepairRequest) => {
    return authFetch<ApiEnvelope<VehicleRepair>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (repairId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${repairId}`, {
      method: "DELETE",
    });
  },

  getById: async (repairId: number): Promise<VehicleRepair> => {
    const res = await authFetch<ApiEnvelope<VehicleRepair>>(`${base}/${repairId}`);
    return res.data;
  },

  getByVehicle: async (
    vehicleId: number,
    page: number,
    pageSize: number
  ): Promise<PagedResult<VehicleRepair>> => {
    const res = await authFetch<ApiEnvelope<PagedResult<VehicleRepair>>>(
      `${base}/vehicle/${vehicleId}?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },
};
