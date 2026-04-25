import React, { useState } from 'react';
import type { Vehicle } from '@/domain/models';
import { Calendar, Clock, Car, Wrench, Loader2 } from 'lucide-react';

interface AppointmentFormProps {
  vehicles: Vehicle[];
  onSubmit: (data: { vehiclePlate: string, date: string, time: string, serviceType: string, notes: string }) => Promise<void>;
  onCancel: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ vehicles, onSubmit, onCancel }) => {
  const [vehiclePlate, setVehiclePlate] = useState(vehicles[0]?.plate || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceType, setServiceType] = useState('Mantenimiento Preventivo');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ vehiclePlate, date, time, serviceType, notes });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Agendar Nueva Cita</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
            <Car className="w-4 h-4 mr-2" /> Vehículo
          </label>
          <select required value={vehiclePlate} onChange={e => setVehiclePlate(e.target.value)} className="block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2.5">
            {vehicles.map(v => (
              <option key={v.plate} value={v.plate}>{v.brand} {v.model} ({v.plate})</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
            <Wrench className="w-4 h-4 mr-2" /> Tipo de Servicio
          </label>
          <select required value={serviceType} onChange={e => setServiceType(e.target.value)} className="block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2.5">
            <option>Mantenimiento Preventivo</option>
            <option>Revisión General</option>
            <option>Cambio de Aceite</option>
            <option>Reparación Específica</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
            <Calendar className="w-4 h-4 mr-2" /> Fecha
          </label>
          <input required type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2.5" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
            <Clock className="w-4 h-4 mr-2" /> Hora
          </label>
          <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2.5" />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notas Adicionales (Opcional)</label>
        <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2.5" placeholder="Cuéntanos más sobre el problema..." />
      </div>
      
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition-colors">
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Agendar Cita
        </button>
      </div>
    </form>
  );
};
