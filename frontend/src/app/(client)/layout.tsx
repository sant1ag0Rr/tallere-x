"use client";

import { CalendarDays, CarFront } from "lucide-react";
import type { ReactNode } from "react";
import { ProtectedRoute } from "@/presentation/components/auth/protected-route";
import { AppSidebar } from "@/presentation/components/layout/app-sidebar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen bg-slate-50">
        <AppSidebar
          title="Portal del Cliente"
          role="client"
          items={[
            { href: "/my-vehicles", label: "Mis Vehiculos", icon: CarFront },
            { href: "/my-appointments", label: "Mis Citas", icon: CalendarDays }
          ]}
        />
        <main className="p-6 pt-16 md:ml-72 md:pt-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
