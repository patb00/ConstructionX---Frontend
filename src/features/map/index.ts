import type { LatLngExpression } from "leaflet";

export type TripRow = {
  id: number;
  startLocationText: string | null;
  endLocationText: string | null;
  vehicleId?: number | null;
  employeeId?: number | null;
};

export type CondoRow = {
  id: number;
  address: string | null;
  capacity: number;
  currentlyOccupied: number;
  responsibleEmployeeName?: string | null;
};

export type Point = { lat: number; lon: number };

export type FilterMode = "all" | "vehicle" | "employee";

export type SelectedMarker =
  | { kind: "trip-start"; trip: TripRow }
  | { kind: "trip-end"; trip: TripRow }
  | { kind: "condo"; condo: CondoRow }
  | { kind: "site"; site: any };

export type GeoCache = Record<string, Point>;

export type RouteByTripId = Record<number, LatLngExpression[]>;
