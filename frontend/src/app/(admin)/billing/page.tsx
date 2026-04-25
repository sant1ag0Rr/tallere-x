"use client";

import { useEffect, useMemo, useState } from "react";
import { Receipt, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { Invoice } from "@/domain/models";
import { invoiceRepository } from "@/infrastructure/repositories/invoice-repository-impl";
import { AdminTable } from "@/presentation/components/shared/admin-table";
import { StatePill } from "@/presentation/components/shared/state-pill";
import { AdminInvoiceForm } from "@/presentation/components/admin/AdminInvoiceForm";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Invoice["status"] | "all">("all");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await invoiceRepository.listInvoices();
        setInvoices(data);
        toast.success("Facturas cargadas");
      } catch {
        toast.error("Error al cargar facturas");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus = statusFilter === "all" ? true : invoice.status === statusFilter;
      const matchesSearch = search === "" || invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [invoices, search, statusFilter]);

  const paidTotal = useMemo(
    () => invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0),
    [invoices]
  );

  const pendingTotal = useMemo(
    () => invoices.filter((inv) => inv.status !== "paid").reduce((sum, inv) => sum + inv.total, 0),
    [invoices]
  );

  const overdueTotal = useMemo(
    () => invoices.filter((inv) => inv.status === "overdue").reduce((sum, inv) => sum + inv.total, 0),
    [invoices]
  );

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Facturación</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestiona facturas y pagos.</p>
          </div>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nueva Factura
          </button>
        )}
      </div>

      {showForm && (
        <AdminInvoiceForm 
          onSubmit={async (newInvoice) => {
            const created = await invoiceRepository.createInvoice(newInvoice);
            setInvoices([created, ...invoices]);
            setShowForm(false);
            toast.success("Factura creada exitosamente");
          }} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Ingresos</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-500">
            ${paidTotal.toLocaleString("es-CO")}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pendiente</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-500">
            ${pendingTotal.toLocaleString("es-CO")}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Vencidas</p>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-500">
            ${overdueTotal.toLocaleString("es-CO")}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Facturas</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{invoices.length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por número de factura"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Invoice["status"] | "all")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="sent">Enviado</option>
            <option value="paid">Pagado</option>
            <option value="overdue">Vencido</option>
          </select>
        </div>

        <AdminTable<Invoice>
          columns={[
            { 
              key: "invoiceNumber", 
              label: "Factura",
              render: (invoiceNumber) => <span className="font-bold text-slate-900 dark:text-white">{invoiceNumber as string}</span> 
            },
            { 
              key: "clientId", 
              label: "Cliente",
              render: (clientId) => <span className="text-slate-600 dark:text-slate-300">{clientId as string}</span>
            },
            {
              key: "total",
              label: "Total",
              render: (total) => <span className="font-semibold text-slate-900 dark:text-white">${Number(total).toLocaleString("es-CO")}</span>
            },
            {
              key: "status",
              label: "Estado",
              render: (status) => <StatePill status={status as string} type="payment" />
            },
            {
              key: "dueDate",
              label: "Fecha Vencimiento",
              render: (date) => <span className="text-slate-500 dark:text-slate-400">{new Date(date as string).toLocaleDateString("es-CO")}</span>
            }
          ]}
          data={filteredInvoices}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
