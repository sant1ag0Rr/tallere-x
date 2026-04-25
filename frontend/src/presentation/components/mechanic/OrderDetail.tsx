import React, { useState } from 'react';
import type { WorkOrder, UsedPart } from '@/domain/models';
import { PartsSelector } from './PartsSelector';
import { TimeTracker } from './TimeTracker';
import { ImageUploader } from './ImageUploader';
import { Car, User, Clock, FileText, Wrench, Image as ImageIcon, Save, CheckCircle, Package } from 'lucide-react';

interface OrderDetailProps {
  order: WorkOrder;
  onUpdateOrder: (updates: Partial<WorkOrder>) => Promise<void>;
  onAddPart: (part: UsedPart) => Promise<void>;
  onAddWorkedTime: (minutes: number) => Promise<void>;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, onUpdateOrder, onAddPart, onAddWorkedTime }) => {
  const [status, setStatus] = useState<WorkOrderStatus>(order.status);
  const [diagnosis, setDiagnosis] = useState<string>(order.diagnosis || '');
  const [repairs, setRepairs] = useState<string>(order.repairs || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTextInfo = async () => {
    setIsSaving(true);
    await onUpdateOrder({ status, diagnosis, repairs });
    setIsSaving(false);
  };

  const handleAddImage = async (url: string) => {
    await onUpdateOrder({ images: [...order.images, url] });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              Orden {order.id.split('-')[1]}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as WorkOrderStatus)}
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="pending">Pendiente</option>
              <option value="in-progress">En Proceso</option>
              <option value="waiting">En Espera</option>
              <option value="finished">Finalizado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Car className="w-5 h-5 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Vehículo</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {order.vehicle.brand} {order.vehicle.model} ({order.vehicle.year})
              </p>
              <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-0.5">{order.vehicle.plate}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Cliente</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{order.clientName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Descriptions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Detalles del Problema
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm">{order.reportedProblem}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Diagnóstico del Mecánico
                </label>
                <textarea
                  rows={3}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Describe lo que encontraste..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reparaciones Realizadas
                </label>
                <textarea
                  rows={3}
                  value={repairs}
                  onChange={(e) => setRepairs(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Describe las acciones tomadas..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveTextInfo}
                  disabled={isSaving || (status === order.status && diagnosis === order.diagnosis && repairs === order.repairs)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>

          {/* Evidence / Images */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
              Evidencia Fotográfica
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {order.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                  <img src={img} alt={`Evidencia ${idx + 1}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
            <ImageUploader onAddImage={handleAddImage} />
          </div>
        </div>

        {/* Right Column: Actions & Stats */}
        <div className="space-y-6">
          {/* Time Tracking */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Tiempo
              </div>
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 text-xs font-bold px-2.5 py-1 rounded-full">
                {formatTime(order.workedMinutes)}
              </span>
            </h2>
            <TimeTracker onAddTime={onAddWorkedTime} />
          </div>

          {/* Inventory / Parts */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-500" />
              Repuestos Usados
            </h2>
            
            {order.usedParts.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-800 mb-6">
                {order.usedParts.map((part, idx) => (
                  <li key={idx} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center mr-3">
                        <Wrench className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{part.item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Ref: {part.item.code}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      x{part.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                No se han registrado repuestos
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <PartsSelector onAddPart={(item, qty) => onAddPart({ item, quantity: qty })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
