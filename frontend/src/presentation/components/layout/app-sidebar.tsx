"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import type { UserRole } from "@/domain/constants";
import { useAuth } from "@/application/hooks/use-auth";

interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface AppSidebarProps {
  title: string;
  role: UserRole;
  items: SidebarItem[];
}

const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Administrador",
  client: "Cliente",
  seller: "Vendedor"
};

export function AppSidebar({ title, role, items }: AppSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-30 rounded-md border border-slate-200 bg-white p-2 text-slate-700 shadow-sm md:hidden"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside
        className={[
          "fixed inset-y-0 left-0 z-20 w-72 border-r border-slate-200 bg-white p-5 shadow-sm transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        ].join(" ")}
      >
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Taller-X Platform</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">
            Rol activo: <span className="font-medium text-slate-900">{ROLE_LABEL[role]}</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">{user?.email ?? "Sin sesión activa"}</p>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={[
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-emerald-500 text-white" : "text-slate-600 hover:bg-slate-100"
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}
