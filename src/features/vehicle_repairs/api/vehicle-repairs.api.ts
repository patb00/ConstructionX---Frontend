import type {
  VehicleRepair,
  CreateVehicleRepairRequest,
  UpdateVehicleRepairRequest,
  PagedResult,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/VehicleRepairs";

const normalizeVehicleRepair = (repair: any): VehicleRepair =>
  ({
    ...repair,
    id: repair.id ?? repair.Id,
    vehicleId: repair.vehicleId ?? repair.VehicleId,
    name: repair.name ?? repair.Name,
    registrationNumber: repair.registrationNumber ?? repair.RegistrationNumber,
    model: repair.model ?? repair.Model,
    yearOfManufacturing:
      repair.yearOfManufacturing ?? repair.YearOfManufacturing,
    vehicleType:
      repair.vehicleType ??
      repair.VehicleType ??
      repair.vehicle?.vehicleType ??
      repair.vehicle?.VehicleType ??
      null,
    horsePower:
      repair.horsePower ??
      repair.HorsePower ??
      repair.vehicle?.horsePower ??
      repair.vehicle?.HorsePower ??
      null,
    repairDate: repair.repairDate ?? repair.RepairDate,
    cost: repair.cost ?? repair.Cost,
    condition: repair.condition ?? repair.Condition,
    description: repair.description ?? repair.Description ?? null,
  }) as VehicleRepair;

const normalizePagedVehicleRepairs = (
  result: PagedResult<VehicleRepair>
): PagedResult<VehicleRepair> => ({
  ...result,
  items: (result.items ?? []).map((item) => normalizeVehicleRepair(item)),
});

export const VehicleRepairsApi = {
  add: async (payload: CreateVehicleRepairRequest) => {
    const res = await authFetch<ApiEnvelope<VehicleRepair>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { ...res, data: normalizeVehicleRepair(res.data) };
  },

  update: async (payload: UpdateVehicleRepairRequest) => {
    const res = await authFetch<ApiEnvelope<VehicleRepair>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return { ...res, data: normalizeVehicleRepair(res.data) };
  },

  delete: async (repairId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${repairId}`, {
      method: "DELETE",
    });
  },

  getById: async (repairId: number): Promise<VehicleRepair> => {
    const res = await authFetch<ApiEnvelope<VehicleRepair>>(`${base}/${repairId}`);
    return normalizeVehicleRepair(res.data);
  },

  getByVehicle: async (
    vehicleId: number,
    page: number,
    pageSize: number
  ): Promise<PagedResult<VehicleRepair>> => {
    const res = await authFetch<ApiEnvelope<PagedResult<VehicleRepair>>>(
      `${base}/vehicle/${vehicleId}?page=${page}&pageSize=${pageSize}`
    );
    return normalizePagedVehicleRepairs(res.data);
  },

  getAll: async (page: number, pageSize: number) => {
    const res = await authFetch<ApiEnvelope<PagedResult<VehicleRepair>>>(
      `${base}/get-all?Page=${page}&PageSize=${pageSize}`
    );
    return normalizePagedVehicleRepairs(res.data);
  },
};
