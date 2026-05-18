"use client";

import React, { useEffect, useState } from 'react';
import type { Appointment, Vehicle } from '@/domain/models';
import { getClientAppointmentsUseCase } from '@/application/useCases/getAppointments';
import { createAppointmentUseCase } from '@/application/useCases/createAppointment';
import { getClientVehiclesUseCase } from '@/application/useCases/getClientVehicles';
import { AppointmentForm } from '@/presentation/components/client/AppointmentForm';
import { EmptyState } from '@/presentation/components/shared/EmptyState';
import { Loader } from '@/presentation/components/shared/Loader';
import { Calendar, Plus, Clock, Car } from 'lucide-react';

const MOCK_CLIENT_ID = 'client-1';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appts, vehs] = await Promise.all([
          getClientAppointmentsUseCase(MOCK_CLIENT_ID),
          getClientVehiclesUseCase(MOCK_CLIENT_ID)
        ]);
        setAppointments(appts);
        setVehicles(vehs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      const newAppt = await createAppointmentUseCase({ ...data, clientId: MOCK_CLIENT_ID });
      setAppointments([...appointments, newAppt]);
      setShowForm(false);
      alert('Cita agendada con éxito');
    } catch (err: any) {
      alert(err.message || 'Error al agendar cita');
    }
  };

  if (loading) return <div className="mt-20"><Loader text="Cargando citas..." /></div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Citas</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Programa y revisa tus próximas visitas al taller.</p>
          </div>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
            <Plus className="w-4 h-4 mr-2" /> Nueva Cita
          </button>
        )}
      </div>

      {showForm ? (
        <AppointmentForm vehicles={vehicles} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      ) : appointments.length === 0 ? (
        <EmptyState title="No hay citas programadas" description="Actualmente no tienes citas. Haz clic en 'Nueva Cita' para agendar una." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map(a => (
            <div key={a.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex items-start shadow-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 p-3 rounded-lg flex flex-col items-center justify-center min-w-[80px] mr-5">
                <span className="text-sm font-semibold uppercase">{new Date(a.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="text-2xl font-bold">{new Date(a.date).getDate()}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{a.serviceType}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <Car className="w-4 h-4 mr-1.5" /> Vehículo: {a.vehiclePlate}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" /> Hora: {a.time}
                </p>
              </div>
              <div>
                <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 text-xs font-medium px-2.5 py-1 rounded-full">Confirmada</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
