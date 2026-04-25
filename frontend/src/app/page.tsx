"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/application/hooks/use-auth";

const HOME_BY_ROLE = {
  admin: "/dashboard",
  client: "/my-vehicles",
  seller: "/sales",
  mechanic: "/mechanic/orders"
} as const;

export default function HomePage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !role) {
      router.replace("/login");
      return;
    }

    router.replace(HOME_BY_ROLE[role]);
  }, [isAuthenticated, isLoading, role, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
    </main>
  );
}
