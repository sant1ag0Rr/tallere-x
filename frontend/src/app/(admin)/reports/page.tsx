"use client";

import { useEffect, useState } from "react";
import { FileText, TrendingUp, Download, Calendar } from "lucide-react";
import { toast } from "sonner";
import { vehicleRepository } from "@/infrastructure/repositories/vehicle-repository-impl";
import { workOrderRepository } from "@/infrastructure/repositories/work-order-repository-impl";
import { inventoryRepository } from "@/infrastructure/repositories/inventory-repository-impl";
import { invoiceRepository } from "@/infrastructure/repositories/invoice-repository-impl";

interface ReportStats {
  vehicles: { total: number; available: number; maintenance: number };
  workOrders: { total: number; pending: number; inProgress: number; completed: number; totalRevenue: number };
  inventory: { totalItems: number; lowStockItems: number; totalValue: number };
  invoices: { totalRevenue: number; pendingAmount: number; overdueAmount: number };
}

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("month");

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [vehicles, workOrdersStats, inventoryStats, invoicesStats] = await Promise.all([
          vehicleRepository.listVehicles(),
          workOrderRepository.getWorkOrdersStats(),
          inventoryRepository.getInventoryStats(),
          invoiceRepository.getInvoiceStats()
        ]);

        setStats({
          vehicles: {
            total: vehicles.length,
            available: vehicles.filter((v) => v.status === "available").length,
            maintenance: vehicles.filter((v) => v.status === "maintenance").length
          },
          workOrders: workOrdersStats as any,
          inventory: inventoryStats as any,
          invoices: invoicesStats as any
        });

        toast.success("Reportes generados");
      } catch {
        toast.error("Error al generar reportes");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchStats();
  }, []);

  const handleDownloadReport = () => {
    if (!stats) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `reporte-erp-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Reporte descargado");
  };

  if (isLoading || !stats) {
    return (
      <section>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reportes</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Genera y consulta reportes del sistema.</p>
        <div className="mt-8 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Reportes</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Genera y consulta reportes del sistema.</p>
          </div>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Download className="h-5 w-5" />
          Descargar Reporte
        </button>
      </div>

      <div className="mb-8 flex gap-3">
        <button
          onClick={() => setDateRange("week")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            dateRange === "week"
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Calendar className="mr-2 inline h-4 w-4" />
          Esta Semana
        </button>
        <button
          onClick={() => setDateRange("month")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            dateRange === "month"
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Calendar className="mr-2 inline h-4 w-4" />
          Este Mes
        </button>
        <button
          onClick={() => setDateRange("year")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            dateRange === "year"
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Calendar className="mr-2 inline h-4 w-4" />
          Este Año
        </button>
      </div>

      <div className="space-y-8">
        {/* Flota de Vehículos */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Flota de Vehículos</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-5">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Vehículos</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stats.vehicles.total}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Flota completa</p>
            </div>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-5">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Disponibles</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-500">{stats.vehicles.available}</p>
              <div className="mt-3 h-2.5 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(stats.vehicles.available / stats.vehicles.total) * 100}%` }}
                />
              </div>
            </div>
            <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 p-5">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-500">En Mantenimiento</p>
              <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-500">{stats.vehicles.maintenance}</p>
              <div className="mt-3 h-2.5 w-full rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${(stats.vehicles.maintenance / stats.vehicles.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Órdenes de Trabajo */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Órdenes de Trabajo</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-5">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Órdenes</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stats.workOrders.total}</p>
            </div>
            <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 p-5">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-500">Pendientes</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-500">{stats.workOrders.pending}</p>
            </div>
            <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 p-5">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">En Progreso</p>
              <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.workOrders.inProgress}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-5">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Completadas</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-500">{stats.workOrders.completed}</p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Ingresos Generados</p>
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-500">
              ${stats.workOrders.totalRevenue.toLocaleString("es-CO")}
            </p>
          </div>
        </div>

        {/* Inventario */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Inventario</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-5">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Artículos</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stats.inventory.totalItems}</p>
            </div>
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-5">
              <p className="text-sm font-medium text-red-600 dark:text-red-500">Bajo Stock</p>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-500">{stats.inventory.lowStockItems}</p>
            </div>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-5">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-500">Valor Total</p>
              <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-500">
                ${stats.inventory.totalValue.toLocaleString("es-CO")}
              </p>
            </div>
          </div>
        </div>

        {/* Facturación */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Facturación</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-5">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Ingresos Totales</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                ${stats.invoices.totalRevenue.toLocaleString("es-CO")}
              </p>
            </div>
            <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 p-5">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-500">Pendiente de Cobro</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                ${stats.invoices.pendingAmount.toLocaleString("es-CO")}
              </p>
            </div>
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-5">
              <p className="text-sm font-medium text-red-600 dark:text-red-500">Vencidas</p>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-500">
                ${stats.invoices.overdueAmount.toLocaleString("es-CO")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
