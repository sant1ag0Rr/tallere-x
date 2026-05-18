"use client";

import React, { useEffect, useState } from 'react';
import type { Vehicle } from '@/domain/models';
import { getClientVehiclesUseCase } from '@/application/useCases/getClientVehicles';
import { addClientVehicleUseCase } from '@/application/useCases/addClientVehicle';
import { VehicleCard } from '@/presentation/components/client/VehicleCard';
import { VehicleForm } from '@/presentation/components/client/VehicleForm';
import { EmptyState } from '@/presentation/components/shared/EmptyState';
import { Loader } from '@/presentation/components/shared/Loader';
import { Car, Plus } from 'lucide-react';

const MOCK_CLIENT_ID = 'client-1';

export const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getClientVehiclesUseCase(MOCK_CLIENT_ID);
        setVehicles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleCreateVehicle = async (data: Partial<Vehicle>) => {
    try {
      const newVehicle = await addClientVehicleUseCase({
        ...data,
        clientId: MOCK_CLIENT_ID,
      });
      setVehicles([...vehicles, newVehicle]);
      setShowForm(false);
      alert('Vehículo registrado con éxito');
    } catch (err: any) {
      alert(err.message || 'Error al registrar vehículo');
    }
  };

  if (loading) return <div className="mt-20"><Loader text="Cargando tus vehículos..." /></div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Vehículos</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona los vehículos registrados en tu cuenta.</p>
          </div>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" /> Agregar
          </button>
        )}
      </div>

      {showForm && (
        <VehicleForm 
          onSubmit={handleCreateVehicle} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      {!showForm && vehicles.length === 0 ? (
        <EmptyState 
          title="Aún no tienes vehículos" 
          description="Agrega tu primer vehículo para comenzar a agendar citas y llevar su historial." 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v.plate} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  );
};
