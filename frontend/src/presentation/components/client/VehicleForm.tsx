"use client";

import React, { useState } from 'react';
import { Car, Check } from 'lucide-react';
import type { Vehicle } from '@/domain/models';

interface VehicleFormProps {
  onSubmit: (data: Partial<Vehicle>) => Promise<void>;
  onCancel: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Car className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500" />
        Registrar Nuevo Vehículo
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Placa</label>
            <input 
              required
              type="text" 
              placeholder="Ej: ABC-123"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors uppercase"
              value={formData.plate}
              onChange={e => setFormData({...formData, plate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marca</label>
            <input 
              required
              type="text" 
              placeholder="Ej: Toyota, Yamaha..."
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={formData.brand}
              onChange={e => setFormData({...formData, brand: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modelo</label>
            <input 
              required
              type="text" 
              placeholder="Ej: Corolla, MT-07..."
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={formData.model}
              onChange={e => setFormData({...formData, model: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Año</label>
            <input 
              required
              type="number" 
              min="1950"
              max={new Date().getFullYear() + 1}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={formData.year}
              onChange={e => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : <><Check className="w-4 h-4 mr-1.5" /> Registrar Vehículo</>}
          </button>
        </div>
      </form>
    </div>
  );
};
