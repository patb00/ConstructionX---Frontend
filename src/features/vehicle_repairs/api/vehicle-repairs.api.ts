import type {
  VehicleRepair,
  CreateVehicleRepairRequest,
  UpdateVehicleRepairRequest,
  PagedResult,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/VehicleRepairs";

const normalizeVehicleRepair = (repair: any): VehicleRepair => {
  const vehicle = repair?.vehicle ?? repair?.Vehicle ?? repair?.vehicleData ?? null;
  const repairDetails =
    repair?.repair ?? repair?.Repair ?? repair?.vehicleRepair ?? repair?.VehicleRepair;

  return {
    ...repair,
    id: repair.id ?? repair.Id,
    vehicleId: repair.vehicleId ?? repair.VehicleId ?? vehicle?.id ?? vehicle?.Id,
    name:
      repair.name ??
      repair.Name ??
      vehicle?.name ??
      vehicle?.Name ??
      "",
    registrationNumber:
      repair.registrationNumber ??
      repair.RegistrationNumber ??
      vehicle?.registrationNumber ??
      vehicle?.RegistrationNumber ??
      "",
    model:
      repair.model ??
      repair.Model ??
      vehicle?.model ??
      vehicle?.Model ??
      "",
    yearOfManufacturing:
      repair.yearOfManufacturing ??
      repair.YearOfManufacturing ??
      vehicle?.yearOfManufacturing ??
      vehicle?.YearOfManufacturing ??
      null,
    vehicleType:
      repair.vehicleType ??
      repair.VehicleType ??
      vehicle?.vehicleType ??
      vehicle?.VehicleType ??
      null,
    horsePower:
      repair.horsePower ??
      repair.HorsePower ??
      vehicle?.horsePower ??
      vehicle?.HorsePower ??
      null,
    repairDate:
      repair.repairDate ??
      repair.RepairDate ??
      repairDetails?.repairDate ??
      repairDetails?.RepairDate ??
      "",
    cost:
      repair.cost ??
      repair.Cost ??
      repairDetails?.cost ??
      repairDetails?.Cost ??
      null,
    condition:
      repair.condition ??
      repair.Condition ??
      repairDetails?.condition ??
      repairDetails?.Condition ??
      "",
    description:
      repair.description ??
      repair.Description ??
      repairDetails?.description ??
      repairDetails?.Description ??
      null,
  } as VehicleRepair;
};

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
