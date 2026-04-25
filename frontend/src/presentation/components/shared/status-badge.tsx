import type { AppointmentStatus, VehicleStatus } from "@/domain/constants";

type StatusValue = VehicleStatus | AppointmentStatus;

interface StatusBadgeProps {
  status: StatusValue;
}

const LABELS: Record<StatusValue, string> = {
  available: "Disponible",
  maintenance: "Mantenimiento",
  scheduled: "Programada",
  in_progress: "En progreso",
  completed: "Completada",
  cancelled: "Cancelada"
};

const STYLES: Record<StatusValue, string> = {
  available: "bg-emerald-100 text-emerald-700",
  maintenance: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-indigo-100 text-indigo-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700"
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={["rounded-full px-2 py-1 text-xs font-medium", STYLES[status]].join(" ")}>
      {LABELS[status]}
    </span>
  );
}
