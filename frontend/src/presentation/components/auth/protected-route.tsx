"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { UserRole } from "@/domain/constants";
import { useAuth } from "@/application/hooks/use-auth";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { role, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!role || !allowedRoles.includes(role)) {
      router.replace("/unauthorized");
    }
  }, [allowedRoles, isAuthenticated, isLoading, pathname, role, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-40 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
