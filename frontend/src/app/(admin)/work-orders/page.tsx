"use client";

import { useEffect, useMemo, useState } from "react";
import { Wrench, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { WorkOrder } from "@/domain/models";
import { workOrderRepository } from "@/infrastructure/repositories/work-order-repository-impl";
import { AdminTable } from "@/presentation/components/shared/admin-table";
import { StatePill } from "@/presentation/components/shared/state-pill";
import { AdminWorkOrderForm } from "@/presentation/components/admin/AdminWorkOrderForm";

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkOrder["status"] | "all">("all");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await workOrderRepository.listWorkOrders();
        setWorkOrders(data);
        toast.success("Órdenes de trabajo cargadas");
      } catch {
        toast.error("Error al cargar órdenes de trabajo");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  const filteredOrders = useMemo(() => {
    return workOrders.filter((order) => {
      const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
      const matchesSearch = search === "" || order.title.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [workOrders, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: workOrders.length,
      pending: workOrders.filter((w) => w.status === "pending").length,
      inProgress: workOrders.filter((w) => w.status === "in_progress").length,
      completed: workOrders.filter((w) => w.status === "completed").length
    };
  }, [workOrders]);

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Órdenes de Trabajo</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestiona las órdenes de trabajo y mantenimiento.</p>
          </div>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nueva Orden
          </button>
        )}
      </div>

      {showForm && (
        <AdminWorkOrderForm 
          onSubmit={async (newOrder) => {
            const created = await workOrderRepository.createWorkOrder(newOrder);
            setWorkOrders([created, ...workOrders]);
            setShowForm(false);
            toast.success("Orden creada exitosamente");
          }} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Órdenes</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-500">{stats.pending}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">En Progreso</p>
          <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-500">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completadas</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-500">{stats.completed}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WorkOrder["status"] | "all")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <AdminTable<WorkOrder>
          columns={[
            { 
              key: "title", 
              label: "Título",
              render: (title) => <span className="font-semibold text-slate-900 dark:text-white">{title as string}</span> 
            },
            {
              key: "priority",
              label: "Prioridad",
              render: (priority) => <StatePill status={priority as string} type="priority" />
            },
            {
              key: "status",
              label: "Estado",
              render: (status) => <StatePill status={status as string} />
            },
            {
              key: "estimatedCost",
              label: "Costo Estimado",
              render: (cost) => <span className="font-medium text-slate-700 dark:text-slate-300">${Number(cost).toLocaleString("es-CO")}</span>
            },
            {
              key: "actualCost",
              label: "Costo Real",
              render: (cost) => <span className="font-bold text-slate-900 dark:text-white">{cost ? `$${Number(cost).toLocaleString("es-CO")}` : "-"}</span>
            }
          ]}
          data={filteredOrders}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
