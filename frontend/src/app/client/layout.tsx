"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Car, Calendar, Activity, Archive, LogOut } from 'lucide-react';

const navItems = [
  { href: '/client/profile', label: 'Mi Perfil', icon: User },
  { href: '/client/vehicles', label: 'Mis Vehículos', icon: Car },
  { href: '/client/appointments', label: 'Citas', icon: Calendar },
  { href: '/client/orders', label: 'Servicios en Curso', icon: Activity },
  { href: '/client/history', label: 'Historial', icon: Archive },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">Tallere<span className="text-gray-900 dark:text-white">X</span></h2>
          <p className="text-xs text-gray-500 font-medium tracking-widest uppercase mt-1">Portal Cliente</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
