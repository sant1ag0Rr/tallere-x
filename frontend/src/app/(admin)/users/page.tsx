"use client";

import { useState } from "react";
import { Users, Plus, Search } from "lucide-react";
import { AdminTable } from "@/presentation/components/shared/admin-table";
import { AdminUserForm } from "@/presentation/components/admin/AdminUserForm";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

const MOCK_USERS: User[] = [
  {
    id: "usr-001",
    email: "carlos.mendez@example.com",
    name: "Carlos Méndez",
    role: "Cliente",
    status: "active",
    createdAt: "2026-01-15"
  },
  {
    id: "usr-002",
    email: "laura.garcia@example.com",
    name: "Laura García",
    role: "Cliente",
    status: "active",
    createdAt: "2026-02-20"
  },
  {
    id: "usr-003",
    email: "juan.rodriguez@example.com",
    name: "Juan Rodríguez",
    role: "Mecánico",
    status: "active",
    createdAt: "2026-01-10"
  },
  {
    id: "usr-004",
    email: "maria.lopez@example.com",
    name: "María López",
    role: "Cliente",
    status: "inactive",
    createdAt: "2025-12-01"
  },
  {
    id: "usr-005",
    email: "pedro.martinez@example.com",
    name: "Pedro Martínez",
    role: "Mecánico",
    status: "active",
    createdAt: "2026-03-05"
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-sm text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Gestión de Usuarios</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Total de usuarios: {users.length}</p>
          </div>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo Usuario
          </button>
        )}
      </div>

      {showForm && (
        <AdminUserForm 
          onSubmit={async (newUser) => {
            setUsers([newUser, ...users]);
            setShowForm(false);
            toast.success("Usuario creado exitosamente");
          }} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <label className="relative w-full max-w-md block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o correo"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <AdminTable<User>
          columns={[
            { 
              key: "name", 
              label: "Nombre",
              render: (name) => <span className="font-semibold text-slate-900 dark:text-white">{name as string}</span> 
            },
            { key: "email", label: "Correo" },
            { 
              key: "role", 
              label: "Rol",
              render: (role) => (
                <span className="text-slate-600 dark:text-slate-300 font-medium">{role as string}</span>
              )
            },
            {
              key: "status",
              label: "Estado",
              render: (status) => (
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    status === "active" 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {status === "active" ? "Activo" : "Inactivo"}
                </span>
              )
            },
            { key: "createdAt", label: "Fecha Registro" }
          ]}
          data={filteredUsers}
        />
      </div>
    </section>
  );
}
