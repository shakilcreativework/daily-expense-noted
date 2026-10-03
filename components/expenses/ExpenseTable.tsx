'use client';

/**
 * Desktop Data Table View for Expenses
 */

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { IExpense } from '@/lib/models/Expense';
import CategoryBadge from '../ui/Badge';
import { formatCurrency, formatFriendlyDate } from '@/lib/utils/formatters';

export interface ExpenseTableProps {
  expenses: IExpense[];
  onEdit: (expense: IExpense) => void;
  onDelete: (id: string, title: string) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4 sm:px-6">Date</th>
              <th className="py-3.5 px-4">Title & Details</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
              >
                {/* Date */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
                  {formatFriendlyDate(expense.date)}
                </td>

                {/* Title & Notes */}
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {expense.title}
                    </span>
                    {expense.notes && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {expense.notes}
                      </span>
                    )}
                  </div>
                </td>

                {/* Category Badge */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <CategoryBadge category={expense.category} size="sm" />
                </td>

                {/* Amount */}
                <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(expense.amount)}
                </td>

                {/* Actions */}
                <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(expense)}
                      aria-label={`Edit ${expense.title}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      onClick={() => onDelete(expense._id, expense.title)}
                      aria-label={`Delete ${expense.title}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseTable;
