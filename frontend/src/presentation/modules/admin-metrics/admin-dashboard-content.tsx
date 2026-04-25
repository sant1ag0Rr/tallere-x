"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, Car, DollarSign, Search, Wrench, Package, FileText } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle } from "@/domain/models";
import type { VehicleStatus } from "@/domain/constants";
import { vehicleRepository } from "@/infrastructure/repositories/vehicle-repository-impl";
import { appointmentRepository } from "@/infrastructure/repositories/appointment-repository-impl";
import { workOrderRepository } from "@/infrastructure/repositories/work-order-repository-impl";
import { inventoryRepository } from "@/infrastructure/repositories/inventory-repository-impl";
import { invoiceRepository } from "@/infrastructure/repositories/invoice-repository-impl";
import { MetricCard } from "@/presentation/components/shared/metric-card";
import { SkeletonTable } from "@/presentation/components/shared/skeleton-table";
import { StatusBadge } from "@/presentation/components/shared/status-badge";

const STATUS_FILTERS: Array<{ value: "all" | VehicleStatus; label: string }> = [
  { value: "all", label: "Todos los estados" },
  { value: "available", label: "Disponible" },
  { value: "maintenance", label: "Mantenimiento" }
];

export function AdminDashboardContent() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | VehicleStatus>("all");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [latestVehicles, appointments, workOrderStats, inventoryStats, invoiceStats] = await Promise.all([
          vehicleRepository.getLatestVehicles(8),
          appointmentRepository.getAppointmentsToday(),
          workOrderRepository.getWorkOrdersStats(),
          inventoryRepository.getInventoryStats(),
          invoiceRepository.getInvoiceStats()
        ]);

        setVehicles(latestVehicles);
        setTodayAppointments(appointments.length);
        setStats({
          workOrders: workOrderStats,
          inventory: inventoryStats,
          invoices: invoiceStats
        });
        toast.success("Dashboard actualizado");
      } catch {
        toast.error("No se pudo cargar el dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesStatus = status === "all" ? true : vehicle.status === status;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        term.length === 0 ||
        vehicle.plate.toLowerCase().includes(term) ||
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [vehicles, status, search]);

  const activeFleet = vehicles.filter((vehicle) => vehicle.status === "available").length;
  const incidents = vehicles.filter((vehicle) => vehicle.status === "maintenance").length;

  if (!stats) {
    return (
      <section>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Administrativo</h1>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Administrativo</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Resumen ejecutivo con indicadores clave del negocio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard 
          title="Ingresos Totales" 
          value={`$${stats.invoices.totalRevenue.toLocaleString("es-CO")}`}
          icon={DollarSign} 
          trend={12.5} 
        />
        <MetricCard 
          title="Órdenes Completadas" 
          value={stats.workOrders.completed}
          icon={Wrench}
          trend={8.2}
        />
        <MetricCard 
          title="Flota Activa" 
          value={`${activeFleet} vehículos`}
          icon={Car}
          trend={4.1}
        />
        <MetricCard 
          title="Items Bajo Stock" 
          value={stats.inventory.lowStockItems}
          icon={Package}
          trend={-2.3}
          trendColor={stats.inventory.lowStockItems > 0 ? "negative" : "positive"}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Estadísticas Rápidas */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Estadísticas Rápidas</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Citas Programadas Hoy</p>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">{todayAppointments}</p>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                  <Wrench className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Órdenes Pendientes</p>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">{stats.workOrders.pending}</p>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                  <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Facturas Vencidas</p>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">${stats.invoices.overdueAmount.toLocaleString("es-CO")}</p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Valor Inventario</p>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">${stats.inventory.totalValue.toLocaleString("es-CO")}</p>
            </div>
          </div>
        </div>

        {/* Estado de la Flota */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Estado de la Flota</h2>
          <div className="mt-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Disponibles</p>
                <p className="font-bold text-slate-900 dark:text-white">{activeFleet} de {vehicles.length}</p>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(activeFleet / vehicles.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">En Mantenimiento</p>
                <p className="font-bold text-slate-900 dark:text-white">{incidents} de {vehicles.length}</p>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${(incidents / vehicles.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Últimos Vehículos Ingresados</h2>
          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <label className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar placa o modelo..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as "all" | VehicleStatus)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {STATUS_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <SkeletonTable rows={6} columns={5} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Placa</th>
                    <th className="px-6 py-4 font-semibold">Vehículo</th>
                    <th className="px-6 py-4 font-semibold">VIN</th>
                    <th className="px-6 py-4 font-semibold">Estado</th>
                    <th className="px-6 py-4 font-semibold">Ingreso</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{vehicle.plate}</td>
                      <td className="px-6 py-4">{`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{vehicle.vin}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={vehicle.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-500">{new Date(vehicle.createdAt).toLocaleDateString("es-CO")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredVehicles.length === 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No hay vehículos que coincidan con el filtro aplicado.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
