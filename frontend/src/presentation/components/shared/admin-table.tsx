"use client";

import { Trash2, Edit2 } from "lucide-react";

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface AdminTableProps<T extends { id: string }> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-6 py-4 font-semibold">
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-6 py-4 font-semibold">Acciones</th>}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800/50">
          {data.map((row) => (
            <tr key={row.id} className="text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-6 py-4">
                  {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="rounded-lg p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="rounded-lg p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No hay datos disponibles
        </div>
      )}
    </div>
  );
}
