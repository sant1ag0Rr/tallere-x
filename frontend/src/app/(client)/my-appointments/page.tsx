"use client";

import { useEffect, useState } from "react";
import type { Appointment } from "@/domain/models";
import { useAuth } from "@/application/hooks/use-auth";
import { appointmentRepository } from "@/infrastructure/repositories/appointment-repository-impl";
import { SkeletonTable } from "@/presentation/components/shared/skeleton-table";
import { StatusBadge } from "@/presentation/components/shared/status-badge";

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) {
        setAppointments([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await appointmentRepository.getAppointmentsByClientId(user.id);
        setAppointments(data);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAppointments();
  }, [user?.id]);

  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-900">Mis Citas</h1>
      <p className="mt-2 text-sm text-slate-600">Seguimiento de servicios agendados para tus vehiculos.</p>

      <div className="mt-6">
        {isLoading ? (
          <SkeletonTable rows={4} columns={3} />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {appointments.map((appointment) => (
              <article key={appointment.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{appointment.serviceType}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Fecha: {appointment.date} {appointment.time}
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </div>
                {appointment.notes ? <p className="mt-3 text-sm text-slate-600">{appointment.notes}</p> : null}
              </article>
            ))}
            {appointments.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 lg:col-span-2">
                Aun no tienes citas registradas.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
