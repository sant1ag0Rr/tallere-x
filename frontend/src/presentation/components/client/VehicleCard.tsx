import React from 'react';
import type { Vehicle } from '@/domain/models';
import { Car, Settings } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle & { statusText?: string };
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center">
          <Car className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{vehicle.brand} {vehicle.model}</h3>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400">{vehicle.plate}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-1">Año</p>
          <p className="font-semibold text-gray-900 dark:text-white">{vehicle.year}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-1">Tipo</p>
          <p className="font-semibold text-gray-900 dark:text-white">Auto</p>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
        <Settings className="w-4 h-4 text-blue-500 mt-0.5" />
        <p className="text-sm text-blue-800 dark:text-blue-400">
          {vehicle.statusText || 'Sin historial reciente registrado.'}
        </p>
      </div>
    </div>
  );
};
