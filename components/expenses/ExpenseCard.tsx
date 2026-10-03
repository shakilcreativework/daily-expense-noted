'use client';

/**
 * Mobile/Card Layout Item for an Expense
 */

import React from 'react';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { IExpense } from '@/lib/models/Expense';
import CategoryBadge from '../ui/Badge';
import { formatCurrency, formatFriendlyDate } from '@/lib/utils/formatters';

export interface ExpenseCardProps {
  expense: IExpense;
  onEdit: (expense: IExpense) => void;
  onDelete: (id: string, title: string) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200/80 dark:border-slate-800/80 group">
      {/* Top Header: Category & Date */}
      <div className="flex items-center justify-between gap-2">
        <CategoryBadge category={expense.category} size="sm" />

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Calendar size={13} className="text-slate-400" />
          <span>{formatFriendlyDate(expense.date)}</span>
        </div>
      </div>

      {/* Center: Title & Notes */}
      <div>
        <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {expense.title}
        </h4>
        {expense.notes && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {expense.notes}
          </p>
        )}
      </div>

      {/* Bottom Footer: Amount & Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-1">
        <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {formatCurrency(expense.amount)}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(expense)}
            aria-label={`Edit ${expense.title}`}
            className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <Pencil size={15} />
          </button>

          <button
            onClick={() => onDelete(expense._id, expense.title)}
            aria-label={`Delete ${expense.title}`}
            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCard;
