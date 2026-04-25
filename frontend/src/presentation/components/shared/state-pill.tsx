"use client";

interface StatusBadgeProps {
  status: string;
  type?: "status" | "priority" | "payment";
}

const STATUS_COLORS: Record<string, string> = {
  // Appointment & Vehicle statuses
  available: "bg-emerald-100 text-emerald-700",
  maintenance: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700",
  completed: "bg-emerald-100 text-emerald-700",

  // Work order statuses
  pending: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-700",

  // Invoice statuses
  draft: "bg-slate-100 text-slate-700",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",

  // Priorities
  low: "bg-slate-100 text-slate-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700"
};

const STATUS_LABELS: Record<string, string> = {
  available: "Disponible",
  maintenance: "Mantenimiento",
  scheduled: "Programado",
  in_progress: "En Progreso",
  completed: "Completado",
  pending: "Pendiente",
  cancelled: "Cancelado",
  draft: "Borrador",
  sent: "Enviado",
  paid: "Pagado",
  overdue: "Vencido",
  low: "Bajo",
  medium: "Medio",
  high: "Alto"
};

export function StatePill({ status, type = "status" }: StatusBadgeProps) {
  const backgroundColor = STATUS_COLORS[status] || "bg-gray-100 text-gray-700";
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${backgroundColor}`}>
      {label}
    </span>
  );
}
