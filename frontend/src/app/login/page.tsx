"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Award, CheckCircle2, Eye, ShieldCheck, Target } from "lucide-react";
import type { UserRole } from "@/domain/constants";
import { useAuth } from "@/application/hooks/use-auth";

const HOME_BY_ROLE: Record<UserRole, string> = {
  admin: "/dashboard",
  client: "/client/profile",
  mechanic: "/mechanic/orders",
  seller: "/sales"
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@tallerx.com");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const user = await login({ email, password });
      const nextPath = searchParams.get("next");
      router.replace(nextPath || HOME_BY_ROLE[user.role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesion");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex w-full flex-col md:flex-row">
        <section className="flex flex-1 flex-col justify-center bg-emerald-600 px-8 py-12 text-white dark:bg-emerald-800 md:px-16 lg:px-24">
          <div className="mx-auto max-w-xl">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Tallere<span className="text-emerald-200">X</span>
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-emerald-50">
              Accede al sistema de gestion del taller con autenticacion real, roles y sesion segura.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-emerald-500/30 p-3">
                  <Target className="h-6 w-6 text-emerald-100" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Mision</h2>
                  <p className="mt-1 text-sm leading-relaxed text-emerald-100/90">
                    Brindar un servicio automotriz transparente, agil y garantizado con seguimiento claro para cada cliente.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-emerald-500/30 p-3">
                  <Eye className="h-6 w-6 text-emerald-100" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Vision</h2>
                  <p className="mt-1 text-sm leading-relaxed text-emerald-100/90">
                    Ser una plataforma confiable para administrar operaciones, clientes, inventario y ordenes de trabajo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-emerald-500/30 p-3">
                  <Award className="h-6 w-6 text-emerald-100" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Valores</h2>
                  <ul className="mt-2 space-y-2 text-sm text-emerald-100/90">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Honestidad en cada diagnostico</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Calidad de repuestos garantizada</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Seguimiento en tiempo real</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acceso a Taller-X</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Inicia sesion con tu correo y contrasena.
              </p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Correo electronico</span>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Contrasena</span>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                />
              </label>

              <button
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Ingresando..." : "Ingresar a mi cuenta"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No tienes cuenta?{" "}
              <Link className="font-semibold text-emerald-600 hover:text-emerald-700" href="/register">
                Registrate
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
          <div className="h-10 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
