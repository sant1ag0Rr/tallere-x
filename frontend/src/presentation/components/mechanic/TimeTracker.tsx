import React, { useState } from 'react';
import { Clock, Plus } from 'lucide-react';

interface TimeTrackerProps {
  onAddTime: (minutes: number) => void;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ onAddTime }) => {
  const [minutes, setMinutes] = useState<number>(30);

  const handleAdd = () => {
    if (minutes > 0) {
      onAddTime(minutes);
      setMinutes(30);
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minutos Trabajados</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="number"
            min="1"
            step="15"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <button
        onClick={handleAdd}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors"
      >
        <Plus className="w-4 h-4 mr-1" />
        Registrar
      </button>
    </div>
  );
};
