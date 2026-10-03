'use client';

/**
 * KPI Financial Metric Summary Cards
 * 
 * Displays top-level financial metrics:
 * - Total Spending
 * - Current Month Total
 * - Daily Average
 * - Transaction Count
 */

import React from 'react';
import { DollarSign, Calendar, TrendingUp, ReceiptText } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';
import { formatCurrency } from '@/lib/utils/formatters';

export function MetricSummary() {
  const { summary, totalFilteredAmount, items, isSummaryLoading } = useAppSelector(
    (state) => state.expenses
  );

  // If filtered items exist, we show the filtered total alongside the overall monthly stats
  const displayTotal = items.length > 0 ? totalFilteredAmount : summary.totalAmount;

  const metrics = [
    {
      label: 'Total Expenses',
      value: formatCurrency(displayTotal),
      subtext: `${items.length} recorded transactions`,
      icon: DollarSign,
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      borderColor: 'hover:border-emerald-500/30',
    },
    {
      label: 'This Month',
      value: formatCurrency(summary.currentMonthTotal),
      subtext: 'Calendar month outflow',
      icon: Calendar,
      iconBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
      borderColor: 'hover:border-sky-500/30',
    },
    {
      label: 'Daily Average',
      value: formatCurrency(summary.dailyAverage),
      subtext: 'Current month daily run-rate',
      icon: TrendingUp,
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      borderColor: 'hover:border-indigo-500/30',
    },
    {
      label: "Today's Outflow",
      value: formatCurrency(summary.todayTotal),
      subtext: 'Recorded today',
      icon: ReceiptText,
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      borderColor: 'hover:border-purple-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {metrics.map((m, index) => {
        const Icon = m.icon;
        return (
          <div
            key={index}
            className={`glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-all duration-200 ${m.borderColor} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {m.label}
              </span>
              <div className={`p-2 rounded-xl ${m.iconBg}`}>
                <Icon size={18} />
              </div>
            </div>

            <div>
              {isSummaryLoading ? (
                <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-1" />
              ) : (
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {m.value}
                </div>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {m.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MetricSummary;
