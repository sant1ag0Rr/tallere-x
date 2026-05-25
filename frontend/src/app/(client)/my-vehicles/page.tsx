"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Vehicle } from "@/domain/models";
import { useAuth } from "@/application/hooks/use-auth";
import { vehicleRepository } from "@/infrastructure/repositories/vehicle-repository-impl";
import { SkeletonTable } from "@/presentation/components/shared/skeleton-table";
import { StatusBadge } from "@/presentation/components/shared/status-badge";

export default function MyVehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user?.id) {
        setVehicles([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await vehicleRepository.getVehiclesByClientId(user.id);
        setVehicles(data);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchVehicles();
  }, [user?.id]);

  const requestMaintenance = () => {
    toast.success("Solicitud enviada con éxito. Un asesor te contactará pronto");
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-900">Mis Vehiculos</h1>
      <p className="mt-2 text-sm text-slate-600">Estado de inventario y servicios programados.</p>

      <div className="mt-6">
        {isLoading ? (
          <SkeletonTable rows={4} columns={4} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Placa</th>
                  <th className="px-4 py-3 font-medium">Vehiculo</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Accion</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 text-slate-800">{vehicle.plate}</td>
                    <td className="px-4 py-3 text-slate-600">{`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={vehicle.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        onClick={requestMaintenance}
                      >
                        Solicitar Mantenimiento
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vehicles.length === 0 && (
              <div className="border-t border-slate-200 p-6 text-center text-sm text-slate-500">
                No hay vehiculos asociados a tu cuenta.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
