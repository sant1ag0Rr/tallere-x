import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { AuthProvider } from "@/presentation/context/auth-context";
import { AppToaster } from "@/presentation/components/shared/app-toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taller-X",
  description: "Plataforma SaaS de gestion automotriz profesional"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50`}>
        <AuthProvider>
          {children}
          <AppToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
