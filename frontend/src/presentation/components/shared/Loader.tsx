import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">{text}</p>
    </div>
  );
};
