"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/format";
import type { EarningsDataPoint } from "@/types/creator";
import { ChartSkeleton } from "../ui/Skeleton";

interface EarningsChartProps {
  data: EarningsDataPoint[];
  loading?: boolean;
}

export default function EarningsChart({ data, loading }: EarningsChartProps) {
  if (loading) return <ChartSkeleton />;

  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="rounded-xl border border-creator-border bg-creator-card p-4 transition-colors duration-200 md:p-6">
      <h3 className="mb-4 text-sm font-medium text-creator-text-secondary">
        Earnings Last 30 Days
      </h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-creator-border)"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--color-creator-text-secondary)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "var(--color-creator-text-secondary)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              width={48}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-creator-card)",
                border: "1px solid var(--color-creator-border)",
                borderRadius: "8px",
                color: "var(--color-creator-text-primary)",
                fontSize: "12px",
              }}
              formatter={(value) => [formatCurrency(Number(value)), "Earnings"]}
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as EarningsDataPoint & {
                  label: string;
                };
                return item ? formatDate(item.date) : "";
              }}
            />
            <Bar dataKey="amount" fill="#2ac5b3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
