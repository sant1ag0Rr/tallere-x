"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Target, Eye, Award, CheckCircle2 } from "lucide-react";
import { USER_ROLES, type UserRole } from "@/domain/constants";
import { useAuth } from "@/application/hooks/use-auth";

const HOME_BY_ROLE: Record<UserRole, string> = {
  admin: "/dashboard",
  client: "/client/profile",
  mechanic: "/mechanic/orders",
  seller: "/seller"
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@tallerx.com");
  const [role, setRole] = useState<UserRole>("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, role });
      const nextPath = searchParams.get("next");
      router.replace(nextPath || HOME_BY_ROLE[role]);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex w-full flex-col md:flex-row">
        
        {/* Left Column: Company Info */}
        <div className="flex flex-1 flex-col justify-center bg-emerald-600 px-8 py-12 text-white dark:bg-emerald-800 md:px-16 lg:px-24">
          <div className="mx-auto max-w-xl">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Tallere<span className="text-emerald-200">X</span>
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-emerald-50">
              Somos tu taller de confianza. Contamos con tecnología de punta y un equipo de profesionales apasionados por el mundo automotriz. Nuestro objetivo es que te sientas completamente tranquilo al dejarnos tu vehículo.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-emerald-500/30 p-3">
                  <Target className="h-6 w-6 text-emerald-100" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Misión</h3>
                  <p className="mt-1 text-emerald-100/90 text-sm leading-relaxed">
                    Brindar un servicio de mantenimiento y reparación automotriz transparente, ágil y garantizado, superando las expectativas de cada cliente a través de procesos claros y atención personalizada.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-emerald-500/30 p-3">
                  <Eye className="h-6 w-6 text-emerald-100" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Visión</h3>
                  <p className="mt-1 text-emerald-100/90 text-sm leading-relaxed">
                    Ser la red de talleres mecánicos líder y más confiable a nivel nacional, revolucionando la industria mediante la innovación tecnológica y la honestidad radical en nuestros diagnósticos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-emerald-500/30 p-3">
                  <Award className="h-6 w-6 text-emerald-100" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Nuestros Valores</h3>
                  <ul className="mt-2 space-y-2 text-sm text-emerald-100/90">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Honestidad en cada diagnóstico</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Calidad de repuestos garantizada</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Transparencia y seguimiento en tiempo real</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="flex flex-1 items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acceso a Taller-X</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Ingreso simulado por rol al sistema de gestión
              </p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Correo Electrónico
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Selecciona tu Rol
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
                  value={role}
                  onChange={(event) => setRole(event.target.value as UserRole)}
                >
                  {USER_ROLES.map((item) => (
                    <option key={item} value={item} className="capitalize">
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 dark:focus:ring-offset-slate-950"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Ingresando..." : "Ingresar a mi cuenta"}
              </button>
            </form>
            
            <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Taller-X. Todos los derechos reservados.
            </p>
          </div>
        </div>
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
