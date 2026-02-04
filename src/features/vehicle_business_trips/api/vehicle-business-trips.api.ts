import type {
  VehicleBusinessTrip,
  NewVehicleBusinessTripRequest,
  UpdateVehicleBusinessTripRequest,
  ApproveVehicleBusinessTripRequest,
  RejectVehicleBusinessTripRequest,
  CancelVehicleBusinessTripRequest,
  CompleteVehicleBusinessTripRequest,
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

  approve: async (payload: ApproveVehicleBusinessTripRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/approve`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  reject: async (payload: RejectVehicleBusinessTripRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/reject`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  cancel: async (payload: CancelVehicleBusinessTripRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/cancel`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  complete: async (payload: CompleteVehicleBusinessTripRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/complete`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  getById: async (businessTripId: number): Promise<VehicleBusinessTrip> => {
    const res = await authFetch<ApiEnvelope<VehicleBusinessTrip>>(
      `${base}/${businessTripId}`
    );
    return res.data;
  },

  getAll: async (page: number, pageSize: number, tripStatus?: number) => {
    const params = new URLSearchParams({
      Page: String(page),
      PageSize: String(pageSize),
    });

    if (tripStatus !== undefined) {
      params.set("TripStatus", String(tripStatus));
    }

    const res = await authFetch<ApiEnvelope<PagedResult<VehicleBusinessTrip>>>(
      `${base}/get-all?${params.toString()}`
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

  isVehicleAvailable: async (args: {
    vehicleId: number;
    startAt: string;
    endAt: string;
    excludeTripId?: number;
  }) => {
    const params = new URLSearchParams({
      VehicleId: String(args.vehicleId),
      StartAt: args.startAt,
      EndAt: args.endAt,
    });

    if (args.excludeTripId !== undefined) {
      params.set("ExcludeTripId", String(args.excludeTripId));
    }

    const res = await authFetch<ApiEnvelope<boolean>>(
      `${base}/is-vehicle-available?${params.toString()}`
    );
    return res.data;
  },
};
