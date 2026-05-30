"use client";

import React, { useEffect, useState } from 'react';
import type { WorkOrder } from '@/domain/models';
import { getClientHistoryUseCase } from '@/application/useCases/getClientHistory';
import { submitFeedbackUseCase } from '@/application/useCases/submitFeedback';
import { HistoryTable } from '@/presentation/components/client/HistoryTable';
import { FeedbackForm } from '@/presentation/components/client/FeedbackForm';
import { EmptyState } from '@/presentation/components/shared/EmptyState';
import { Loader } from '@/presentation/components/shared/Loader';
import { Archive } from 'lucide-react';
import { useAuth } from '@/application/hooks/use-auth';

export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackSuccess, setFeedbackSuccess] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await getClientHistoryUseCase(user.id);
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user?.id]);

  const handleFeedback = async (orderId: string, rating: number, comment: string) => {
    if (!user?.id) return;
    await submitFeedbackUseCase({ clientId: user.id, workOrderId: orderId, rating, comment });
    setFeedbackSuccess(prev => ({ ...prev, [orderId]: true }));
  };

  if (loading) return <div className="mt-20"><Loader text="Cargando historial de servicios..." /></div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
          <Archive className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Historial y Facturas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Revisa los servicios anteriores, descarga facturas y déjanos tu opinión.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <EmptyState title="No tienes historial aún" description="No se han registrado servicios completados para tus vehículos." />
      ) : (
        <div className="space-y-8">
          <HistoryTable orders={history} />
          
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ayúdanos a mejorar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map(order => !feedbackSuccess[order.id] && (
                <div key={order.id} className="relative">
                  <div className="absolute -top-3 left-4 bg-white dark:bg-gray-900 px-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Servicio a {order.vehicle.plate}
                  </div>
                  <FeedbackForm orderId={order.id} onSubmit={(rating, comment) => handleFeedback(order.id, rating, comment)} />
                </div>
              ))}
            </div>
            {Object.keys(feedbackSuccess).length > 0 && Object.keys(feedbackSuccess).length === history.length && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                ¡Gracias! Has calificado todos tus servicios anteriores.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
