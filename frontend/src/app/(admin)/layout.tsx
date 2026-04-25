"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wrench,
  Car,
  Package,
  Receipt,
  FileText,
  LogOut
} from "lucide-react";
import { ProtectedRoute } from "@/presentation/components/auth/protected-route";
import { useAuth } from "@/application/hooks/use-auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Usuarios", icon: Users },
  { href: "/work-orders", label: "Órdenes", icon: Wrench },
  { href: "/vehicles", label: "Vehículos", icon: Car },
  { href: "/inventory", label: "Inventario", icon: Package },
  { href: "/billing", label: "Facturación", icon: Receipt },
  { href: "/reports", label: "Reportes", icon: FileText }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">Tallere<span className="text-slate-900 dark:text-white">X</span></h2>
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase mt-1">Panel Administrativo</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={logout}
              className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
