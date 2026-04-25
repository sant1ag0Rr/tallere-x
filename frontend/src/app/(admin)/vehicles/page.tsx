"use client";

import { useEffect, useMemo, useState } from "react";
import { Car, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle } from "@/domain/models";
import type { VehicleStatus } from "@/domain/constants/vehicle-status";
import { vehicleRepository } from "@/infrastructure/repositories/vehicle-repository-impl";
import { AdminTable } from "@/presentation/components/shared/admin-table";
import { StatePill } from "@/presentation/components/shared/state-pill";
import { AdminVehicleForm } from "@/presentation/components/admin/AdminVehicleForm";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await vehicleRepository.listVehicles();
        setVehicles(data);
        toast.success("Flota de vehículos cargada");
      } catch {
        toast.error("Error al cargar vehículos");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesStatus = statusFilter === "all" ? true : vehicle.status === statusFilter;
      const term = search.toLowerCase();
      const matchesSearch =
        term === "" ||
        vehicle.plate.toLowerCase().includes(term) ||
        vehicle.brand.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [vehicles, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === "available").length,
      maintenance: vehicles.filter((v) => v.status === "maintenance").length,
      totalMileage: vehicles.reduce((sum, v) => sum + v.mileage, 0)
    };
  }, [vehicles]);

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Flota de Vehículos</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Consulta y administra la flota completa de vehículos.</p>
          </div>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo Vehículo
          </button>
        )}
      </div>

      {showForm && (
        <AdminVehicleForm 
          onSubmit={async (newVehicle) => {
            const created = await vehicleRepository.createVehicle(newVehicle);
            setVehicles([created, ...vehicles]);
            setShowForm(false);
            toast.success("Vehículo registrado exitosamente");
          }} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Vehículos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Disponibles</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-500">{stats.available}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">En Mantenimiento</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-500">{stats.maintenance}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">KM Totales</p>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-500">{stats.totalMileage.toLocaleString("es-CO")}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por placa o modelo"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as VehicleStatus | "all")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="all">Todos los estados</option>
            <option value="available">Disponible</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
        </div>

        <AdminTable<Vehicle>
          columns={[
            { 
              key: "plate", 
              label: "Placa",
              render: (plate) => <span className="font-bold text-slate-900 dark:text-white">{plate as string}</span> 
            },
            {
              key: "brand",
              label: "Vehículo",
              render: (_, row) => <span className="text-slate-700 dark:text-slate-300">{`${row.brand} ${row.model} ${row.year}`}</span>
            },
            { 
              key: "vin", 
              label: "VIN",
              render: (vin) => <span className="font-mono text-xs text-slate-500">{vin as string}</span>
            },
            {
              key: "mileage",
              label: "Kilometraje",
              render: (mileage) => <span className="text-slate-600 dark:text-slate-400">{`${Number(mileage).toLocaleString("es-CO")} km`}</span>
            },
            {
              key: "status",
              label: "Estado",
              render: (status) => <StatePill status={status as string} />
            }
          ]}
          data={filteredVehicles}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
