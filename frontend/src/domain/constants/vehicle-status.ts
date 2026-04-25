export const VEHICLE_STATUSES = ["available", "maintenance"] as const;

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];
