import React from 'react';
import type { WorkOrder } from '@/domain/models';
import { Check, Clock, AlertCircle, Wrench, CheckCircle2 } from 'lucide-react';

interface OrderStatusTrackerProps {
  status: WorkOrder['status'];
}

const steps: { key: WorkOrder['status'], label: string, icon: any }[] = [
  { key: 'pending', label: 'Recibido', icon: Clock },
  { key: 'in_progress', label: 'En Reparación', icon: Wrench },
  { key: 'completed', label: 'Listo', icon: CheckCircle2 }
];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
  const currentStepIndex = steps.findIndex(s => s.key === status) === -1 ? 0 : steps.findIndex(s => s.key === status);

  return (
    <div className="py-6">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
        {/* Progress Line */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-500 rounded transition-all duration-500" 
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const StepIcon = isCompleted && !isCurrent ? Check : step.icon;
          
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 transition-colors duration-300 ${isCompleted ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                <StepIcon className="w-5 h-5" />
              </div>
              <span className={`absolute top-12 text-xs font-semibold whitespace-nowrap ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
