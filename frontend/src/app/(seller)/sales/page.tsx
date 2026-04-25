const SALES_PIPELINE = [
  { stage: "Leads nuevos", total: 18 },
  { stage: "En negociacion", total: 9 },
  { stage: "Cerrados", total: 5 }
];

export default function SalesPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-900">Sales Overview</h1>
      <p className="mt-2 text-sm text-slate-600">Seguimiento comercial para el equipo de ventas.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {SALES_PIPELINE.map((item) => (
          <article key={item.stage} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.stage}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{item.total}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
