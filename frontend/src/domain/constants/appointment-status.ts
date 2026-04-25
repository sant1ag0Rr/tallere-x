export const APPOINTMENT_STATUSES = ["scheduled", "in_progress", "completed", "cancelled"] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
