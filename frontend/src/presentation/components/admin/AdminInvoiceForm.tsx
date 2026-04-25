"use client";

import React, { useState } from "react";
import { Receipt, Check } from "lucide-react";
import type { Invoice } from "@/domain/models";

interface AdminInvoiceFormProps {
  onSubmit: (data: Partial<Invoice>) => Promise<void>;
  onCancel: () => void;
}

export function AdminInvoiceForm({ onSubmit, onCancel }: AdminInvoiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    vehicleId: "",
    total: 0,
    status: "draft" as any,
    dueDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0] // Default 7 days
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
      <h2 className="mb-6 flex items-center text-xl font-bold text-slate-900 dark:text-white">
        <Receipt className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-500" />
        Registrar Nueva Factura
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">ID del Cliente</label>
            <input
              required
              type="text"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">ID del Vehículo</label>
            <input
              required
              type="text"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Monto Total ($)</label>
            <input
              required
              type="number"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={formData.total}
              onChange={(e) => setFormData({ ...formData, total: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Estado de Pago</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="draft">Borrador</option>
              <option value="sent">Enviado</option>
              <option value="paid">Pagado</option>
              <option value="overdue">Vencido</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Fecha de Vencimiento</label>
            <input
              required
              type="date"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : <><Check className="mr-1.5 h-4 w-4" /> Guardar Factura</>}
          </button>
        </div>
      </form>
    </div>
  );
}
