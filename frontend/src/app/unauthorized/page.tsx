import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-red-100 p-3 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">No autorizado</h1>
        <p className="mt-2 text-sm text-slate-600">
          Tu rol actual no tiene permisos para acceder a este modulo.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Ir a login
        </Link>
      </div>
    </main>
  );
}
