"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Wrench } from "lucide-react";
import { ProtectedRoute } from "@/presentation/components/auth/protected-route";
import { useAuth } from "@/application/hooks/use-auth";

const navItems = [
  { href: "/mechanic/orders", label: "Ordenes Asignadas", icon: Wrench }
];

export default function MechanicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <ProtectedRoute allowedRoles={["mechanic"]}>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100 md:flex-row">
        <aside className="flex w-full flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:w-64">
          <div className="border-b border-gray-200 p-6 dark:border-gray-800">
            <h2 className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-500">Tallere<span className="text-gray-900 dark:text-white">X</span></h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-gray-500">Portal Mecanico</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-600 dark:text-blue-500" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <button
              className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={handleLogout}
              type="button"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesion
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
