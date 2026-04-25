"use client";

import React, { useEffect, useState } from 'react';
import type { WorkOrder } from '@/domain/models';
import { getClientOrdersUseCase } from '@/application/useCases/getClientOrders';
import { OrderStatusTracker } from '@/presentation/components/client/OrderStatusTracker';
import { EmptyState } from '@/presentation/components/shared/EmptyState';
import { Loader } from '@/presentation/components/shared/Loader';
import { Activity, Car, FileText, Wrench, Image as ImageIcon } from 'lucide-react';

const MOCK_CLIENT_ID = 'client-1';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getClientOrdersUseCase(MOCK_CLIENT_ID);
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="mt-20"><Loader text="Cargando estado de tus vehículos..." /></div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Servicios en Curso</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sigue el progreso de tu vehículo en tiempo real.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="No hay servicios en curso" description="Actualmente no tenemos ningún vehículo tuyo en reparación." />
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                <div className="flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mr-4">
                    <Car className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{order.vehicle.brand} {order.vehicle.model}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.vehicle.plate} • Orden #{order.id.split('-')[1]}</p>
                  </div>
                </div>
              </div>

              {/* Status Tracker */}
              <OrderStatusTracker status={order.status} />

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" /> Reporte del Mecánico
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                    <p className="mb-2"><span className="font-semibold">Problema inicial:</span> {order.reportedProblem}</p>
                    {order.diagnosis && <p><span className="font-semibold">Diagnóstico:</span> {order.diagnosis}</p>}
                    {!order.diagnosis && <p className="text-gray-400 italic">Esperando diagnóstico del mecánico...</p>}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Wrench className="w-4 h-4 mr-2 text-blue-500" /> Reparaciones y Repuestos
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                    {order.repairs && <p className="mb-2"><span className="font-semibold">Trabajo:</span> {order.repairs}</p>}
                    {order.usedParts.length > 0 ? (
                      <div>
                        <span className="font-semibold">Repuestos:</span>
                        <ul className="list-disc pl-5 mt-1">
                          {order.usedParts.map((p, i) => <li key={i}>{p.quantity}x {p.item.name}</li>)}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No se han registrado repuestos aún.</p>
                    )}
                  </div>
                </div>
              </div>

              {order.images && order.images.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2 text-blue-500" /> Evidencias
                  </h4>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {order.images.map((img, i) => (
                      <img key={i} src={img} alt="Evidencia" className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
