"use client";

import React, { useEffect, useState } from 'react';
import type { WorkOrder } from '@/domain/models';
import { getAssignedOrdersUseCase } from '@/application/useCases/getAssignedOrders';
import { OrderCard } from '@/presentation/components/mechanic/OrderCard';
import { EmptyState } from '@/presentation/components/shared/EmptyState';
import { Loader } from '@/presentation/components/shared/Loader';
import { Wrench } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAssignedOrdersUseCase();
        setOrders(data);
      } catch (err) {
        setError('No se pudieron cargar las órdenes. Inténtalo de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="mt-20"><Loader text="Cargando órdenes asignadas..." /></div>;

  if (error) return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
        {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Mis Órdenes Asignadas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona los vehículos que tienes en reparación.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState 
          title="No tienes órdenes asignadas" 
          description="En este momento no hay vehículos esperando por tu revisión. Toma un descanso o consulta con tu supervisor." 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};
