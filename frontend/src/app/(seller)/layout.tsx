"use client";

import { BarChart3, Handshake } from "lucide-react";
import type { ReactNode } from "react";
import { ProtectedRoute } from "@/presentation/components/auth/protected-route";
import { AppSidebar } from "@/presentation/components/layout/app-sidebar";

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <div className="min-h-screen bg-slate-50">
        <AppSidebar
          title="Panel de Ventas"
          role="seller"
          items={[
            { href: "/sales", label: "Ventas", icon: Handshake },
            { href: "/sales", label: "Rendimiento", icon: BarChart3 }
          ]}
        />
        <main className="p-6 pt-16 md:ml-72 md:pt-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
