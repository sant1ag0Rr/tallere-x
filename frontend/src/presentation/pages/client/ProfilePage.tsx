"use client";

import React, { useEffect, useState } from 'react';
import type { User } from '@/domain/models';
import { getClientProfileUseCase } from '@/application/useCases/getClientProfile';
import { Loader } from '@/presentation/components/shared/Loader';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getClientProfileUseCase();
        setProfile(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await updateClientProfileUseCase(formData);
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) return <div className="mt-20"><Loader text="Cargando perfil..." /></div>;
  if (!profile) return <div>Error cargando perfil</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
              <p className="text-gray-500 dark:text-gray-400">Cliente desde {new Date(profile.joinDate).getFullYear()}</p>
            </div>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {isEditing ? <><Save className="w-4 h-4 mr-2" /> Guardar</> : 'Editar Perfil'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4 mr-2" /> Nombre Completo
            </label>
            <input 
              type="text" 
              disabled={!isEditing} 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-70 p-2.5" 
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="w-4 h-4 mr-2" /> Correo Electrónico
            </label>
            <input 
              type="email" 
              disabled={!isEditing} 
              value={formData.email || ''} 
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-70 p-2.5" 
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="w-4 h-4 mr-2" /> Teléfono
            </label>
            <input 
              type="tel" 
              disabled={!isEditing} 
              value={formData.phone || ''} 
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-70 p-2.5" 
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 mr-2" /> Dirección
            </label>
            <input 
              type="text" 
              disabled={!isEditing} 
              value={formData.address || ''} 
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-70 p-2.5" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
