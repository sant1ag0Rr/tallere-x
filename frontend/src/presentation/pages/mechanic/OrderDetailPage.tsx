"use client";

import React, { useEffect, useState } from 'react';
import type { WorkOrder, UsedPart } from '@/domain/models';
import { getOrderByIdUseCase } from '@/application/useCases/getOrderById';
import { updateWorkOrderUseCase } from '@/application/useCases/updateWorkOrder';
import { addUsedPartsUseCase } from '@/application/useCases/addUsedParts';
import { registerWorkTimeUseCase } from '@/application/useCases/registerWorkTime';
import { OrderDetail } from '@/presentation/components/mechanic/OrderDetail';
import { Loader } from '@/presentation/components/shared/Loader';
import { EmptyState } from '@/presentation/components/shared/EmptyState';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface OrderDetailPageProps {
  orderId: string;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orderId }) => {
  const [order, setOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderByIdUseCase(orderId);
        if (data) {
          setOrder(data);
        } else {
          setError('Orden no encontrada');
        }
      } catch (err) {
        setError('Error al cargar los detalles de la orden');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleUpdateOrder = async (updates: Partial<WorkOrder>) => {
    if (!order) return;
    try {
      const updatedOrder = await updateWorkOrderUseCase(order.id, updates);
      setOrder(updatedOrder);
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Hubo un error al actualizar la orden');
    }
  };

  const handleAddPart = async (part: UsedPart) => {
    if (!order) return;
    try {
      const updatedOrder = await addUsedPartsUseCase(order.id, part);
      setOrder(updatedOrder);
    } catch (err: any) {
      console.error('Error adding part:', err);
      alert(err.message || 'Hubo un error al agregar el repuesto');
    }
  };

  const handleAddWorkedTime = async (minutes: number) => {
    if (!order) return;
    try {
      const updatedOrder = await registerWorkTimeUseCase(order.id, minutes);
      setOrder(updatedOrder);
    } catch (err) {
      console.error('Error adding time:', err);
      alert('Hubo un error al registrar el tiempo');
    }
  };

  if (loading) return <div className="mt-20"><Loader text="Cargando información de la orden..." /></div>;

  if (error || !order) return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Link href="/mechanic/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a mis órdenes
      </Link>
      <EmptyState title="Oops" description={error || 'Orden no encontrada'} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/mechanic/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a mis órdenes
        </Link>
      </div>
      <OrderDetail 
        order={order} 
        onUpdateOrder={handleUpdateOrder} 
        onAddPart={handleAddPart} 
        onAddWorkedTime={handleAddWorkedTime} 
      />
    </div>
  );
};
