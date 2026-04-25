import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: number;
  trendColor?: "positive" | "negative";
}

export function MetricCard({ title, value, icon: Icon, trend, trendColor }: MetricCardProps) {
  const isPositive = trendColor ? trendColor === "positive" : trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
      <p className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p
        className={[
          "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
          isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        ].join(" ")}
      >
        <TrendIcon className="h-3.5 w-3.5" />
        {isPositive ? "+" : ""}
        {trend}%
      </p>
    </article>
  );
}
