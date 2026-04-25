"use client";

import { useEffect, useMemo, useState } from "react";
import { Package, Plus, AlertTriangle, Search } from "lucide-react";
import { toast } from "sonner";
import type { InventoryItem } from "@/domain/models";
import { inventoryRepository } from "@/infrastructure/repositories/inventory-repository-impl";
import { AdminTable } from "@/presentation/components/shared/admin-table";
import { AdminInventoryForm } from "@/presentation/components/admin/AdminInventoryForm";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [data, lowStock, inventoryStats] = await Promise.all([
          inventoryRepository.listInventory(),
          inventoryRepository.getLowStockItems(),
          inventoryRepository.getInventoryStats()
        ]);
        setInventory(data);
        setStats(inventoryStats);
        if (lowStock.length > 0) {
          toast.warning(`${lowStock.length} artículos con bajo stock`);
        }
      } catch {
        toast.error("Error al cargar inventario");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase();
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
  }, [inventory, search]);

  const lowStockItems = useMemo(
    () => inventory.filter((item) => item.quantity <= item.minQuantity),
    [inventory]
  );

  const totalValue = useMemo(
    () => inventory.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [inventory]
  );

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Inventario</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestiona el inventario de repuestos y materiales.</p>
          </div>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo Artículo
          </button>
        )}
      </div>

      {showForm && (
        <AdminInventoryForm 
          onSubmit={async (newItem) => {
            const created = await inventoryRepository.createInventoryItem(newItem);
            setInventory([created, ...inventory]);
            setShowForm(false);
            toast.success("Artículo registrado exitosamente");
          }} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Artículos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{inventory.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Valor Total</p>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-500">
            ${totalValue.toLocaleString("es-CO")}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Bajo Stock</p>
          <p className={`mt-2 text-3xl font-bold ${lowStockItems.length > 0 ? "text-red-600 dark:text-red-500" : "text-emerald-600 dark:text-emerald-500"}`}>
            {lowStockItems.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Categorías</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {new Set(inventory.map((i) => i.category)).size}
          </p>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="mb-8 rounded-xl border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-5 shadow-sm">
          <div className="flex gap-4">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />
            <div>
              <p className="font-semibold text-yellow-900 dark:text-yellow-400">Artículos con bajo stock</p>
              <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-500/80">
                {lowStockItems.map((item) => item.name).join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <label className="relative w-full max-w-md block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, SKU o categoría"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <AdminTable<InventoryItem>
          columns={[
            { 
              key: "name", 
              label: "Nombre",
              render: (name) => <span className="font-semibold text-slate-900 dark:text-white">{name as string}</span> 
            },
            { 
              key: "sku", 
              label: "SKU",
              render: (sku) => <span className="font-mono text-xs text-slate-500">{sku as string}</span>
            },
            { 
              key: "category", 
              label: "Categoría",
              render: (category) => <span className="text-slate-600 dark:text-slate-300">{category as string}</span>
            },
            {
              key: "quantity",
              label: "Cantidad",
              render: (quantity, row) => (
                <span
                  className={`font-medium ${Number(quantity) <= row.minQuantity ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"}`}
                >
                  {quantity}
                </span>
              )
            },
            { 
              key: "minQuantity", 
              label: "Stock Mínimo",
              render: (minQty) => <span className="text-slate-500 dark:text-slate-400">{minQty as number}</span> 
            },
            {
              key: "unitPrice",
              label: "Precio Unitario",
              render: (price) => <span className="text-slate-600 dark:text-slate-300">${Number(price).toLocaleString("es-CO")}</span>
            },
            {
              key: "id",
              label: "Valor Total",
              render: (_, row) => <span className="font-bold text-slate-900 dark:text-white">${(Number(row.quantity) * Number(row.unitPrice)).toLocaleString("es-CO")}</span>
            }
          ]}
          data={filteredItems}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
