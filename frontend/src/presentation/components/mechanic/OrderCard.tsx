import React from 'react';
import type { WorkOrder, WorkOrderStatus } from '@/domain/models';
import { Car, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderCardProps {
  order: WorkOrder;
}

const statusConfig: Record<WorkOrderStatus, { label: string, color: string, icon: React.FC<any> }> = {
  'pending': { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500', icon: AlertCircle },
  'in-progress': { label: 'En Proceso', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500', icon: Clock },
  'in_progress': { label: 'En Proceso', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500', icon: Clock },
  'waiting': { label: 'En Espera', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500', icon: AlertCircle },
  'finished': { label: 'Finalizado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500', icon: CheckCircle2 },
  'completed': { label: 'Completado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500', icon: CheckCircle2 },
  'cancelled': { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500', icon: AlertCircle },
};

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <Link href={`/mechanic/orders/${order.id}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-500/30 dark:hover:border-blue-500/30">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {order.vehicle.brand} {order.vehicle.model}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Car className="w-4 h-4 mr-1.5" />
              <span>{order.vehicle.plate}</span>
              <span className="mx-2">•</span>
              <span>{order.clientName}</span>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            <StatusIcon className="w-3.5 h-3.5 mr-1" />
            {status.label}
          </span>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mt-4 border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            <span className="font-medium text-gray-900 dark:text-white mr-1">Problema:</span>
            {order.reportedProblem}
          </p>
        </div>
      </div>
    </Link>
  );
};
