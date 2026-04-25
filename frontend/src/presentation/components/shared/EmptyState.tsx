import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl bg-gray-50 border border-gray-100 dark:bg-gray-800/50 dark:border-gray-800">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
        <FileQuestion className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">{description}</p>
    </div>
  );
};
