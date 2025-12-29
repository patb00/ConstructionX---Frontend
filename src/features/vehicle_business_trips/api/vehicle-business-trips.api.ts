import type {
  VehicleBusinessTrip,
  NewVehicleBusinessTripRequest,
  UpdateVehicleBusinessTripRequest,
  PagedResult,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/VehicleBusinessTrips";

export const VehicleBusinessTripsApi = {
  add: async (payload: NewVehicleBusinessTripRequest) => {
    return authFetch<ApiEnvelope<VehicleBusinessTrip>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateVehicleBusinessTripRequest) => {
    return authFetch<ApiEnvelope<VehicleBusinessTrip>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (businessTripId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${businessTripId}`, {
      method: "DELETE",
    });
  },

  getById: async (businessTripId: number): Promise<VehicleBusinessTrip> => {
    const res = await authFetch<ApiEnvelope<VehicleBusinessTrip>>(
      `${base}/${businessTripId}`
    );
    return res.data;
  },

  getAll: async (page: number, pageSize: number) => {
    const res = await authFetch<ApiEnvelope<PagedResult<VehicleBusinessTrip>>>(
      `${base}/get-all?Page=${page}&PageSize=${pageSize}`
    );
    return res.data;
  },

  getByVehicle: async (vehicleId: number) => {
    const res = await authFetch<ApiEnvelope<VehicleBusinessTrip[]>>(
      `${base}/by-vehicle/${vehicleId}`
    );
    return res.data;
  },

  getByEmployee: async (employeeId: number) => {
    const res = await authFetch<ApiEnvelope<VehicleBusinessTrip[]>>(
      `${base}/by-employee/${employeeId}`
    );
    return res.data;
  },

  hasOpenTrip: async (vehicleId: number) => {
    const res = await authFetch<ApiEnvelope<boolean>>(
      `${base}/has-open-trip/${vehicleId}`
    );
    return res.data;
  },
};
