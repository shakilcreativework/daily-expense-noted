'use client';

/**
 * Visual Analytics: Category Spending Breakdown (Recharts)
 * 
 * Renders an interactive Donut / Pie chart displaying:
 * - Category spending distribution
 * - Percentage share
 * - Custom animated tooltip
 * - Category legend
 */

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';
import { formatCurrency } from '@/lib/utils/formatters';

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: {
    category: string;
    label: string;
    total: number;
    count: number;
    percentage: number;
    color: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-xl text-xs flex flex-col gap-1 min-w-[140px]">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {data.label || data.category}
          </span>
        </div>
        <div className="text-slate-600 dark:text-slate-300 font-semibold mt-1">
          {formatCurrency(data.total)}
        </div>
        <div className="text-slate-400 text-[11px]">
          {data.percentage}% of total ({data.count} {data.count === 1 ? 'item' : 'items'})
        </div>
      </div>
    );
  }
  return null;
};

export function ExpensePieChart() {
  const { categoryBreakdown, isSummaryLoading } = useAppSelector(
    (state) => state.expenses
  );

  // Prevent Recharts SSR hydration mismatch by mounting client-side
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasData = categoryBreakdown.length > 0 && categoryBreakdown.some((c) => c.total > 0);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
      {/* Chart Title */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <PieChartIcon size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Spending by Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution across all expenses
            </p>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-64 flex items-center justify-center">
        {!isMounted || isSummaryLoading ? (
          <div className="w-40 h-40 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-indigo-600 animate-spin" />
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <p className="text-sm font-medium">No category data to display</p>
            <p className="text-xs text-slate-500 mt-1">
              Add some expenses to see visual breakdown
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ExpensePieChart;
