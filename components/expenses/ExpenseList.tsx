'use client';

/**
 * Responsive Expense List Container
 * 
 * Manages:
 * - Table (Desktop) vs Card Layout (Mobile/Tablet)
 * - Layout View Mode Toggle
 * - Delete confirmation modal flow
 * - Empty states and loading skeletons
 */

import React, { useState } from 'react';
import { LayoutGrid, Table as TableIcon, PlusCircle, Inbox } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  openAddModal,
  openEditModal,
  deleteExpense,
  fetchExpenses,
} from '@/lib/redux/slices/expenseSlice';
import { IExpense } from '@/lib/models/Expense';
import ExpenseTable from './ExpenseTable';
import ExpenseCard from './ExpenseCard';
import ConfirmDialog from '../ui/ConfirmDialog';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';

export function ExpenseList() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { items, status, filters } = useAppSelector((state) => state.expenses);

  // View Mode: 'auto' (table on desktop, cards on mobile), 'cards', 'table'
  const [viewMode, setViewMode] = useState<'auto' | 'cards' | 'table'>('auto');

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const deletedTitle = deleteTarget.title;
    try {
      await dispatch(deleteExpense(deleteTarget.id)).unwrap();
      dispatch(fetchExpenses(filters));
      showToast('info', 'Expense Deleted', `"${deletedTitle}" was deleted.`);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('error', 'Delete Failed', 'Could not delete the expense.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (expense: IExpense) => {
    dispatch(openEditModal(expense));
  };

  const isLoading = status === 'loading' && items.length === 0;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* List Header with Count & View Toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Recent Expenses
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {items.length} {items.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setViewMode('auto')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'auto'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Responsive
          </button>
          <button
            onClick={() => setViewMode('table')}
            aria-label="Table view"
            className={`p-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TableIcon size={15} />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            aria-label="Card view"
            className={`p-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 animate-shimmer h-36"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <div className="glass-card rounded-2xl p-8 sm:p-12 border border-dashed border-slate-300 dark:border-slate-700/80 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-inner">
            <Inbox size={32} />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            No expenses found
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">
            {filters.category !== 'All' || filters.search
              ? 'No transactions matched your active filter or search criteria.'
              : 'You have not recorded any daily expenses yet. Add your first transaction to start tracking!'}
          </p>
          <Button
            variant="primary"
            leftIcon={<PlusCircle size={16} />}
            onClick={() => dispatch(openAddModal())}
          >
            Add First Expense
          </Button>
        </div>
      )}

      {/* Render Active View Layout */}
      {!isLoading && items.length > 0 && (
        <>
          {/* Card View Layout */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}

          {/* Table View Layout */}
          {viewMode === 'table' && (
            <ExpenseTable
              expenses={items}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          )}

          {/* Auto Responsive Mode (Desktop Table, Mobile Cards) */}
          {viewMode === 'auto' && (
            <>
              {/* Visible on Mobile/Tablet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
                {items.map((expense) => (
                  <ExpenseCard
                    key={expense._id}
                    expense={expense}
                    onEdit={handleEdit}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>

              {/* Visible on Desktop */}
              <div className="hidden lg:block">
                <ExpenseTable
                  expenses={items}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Expense"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default ExpenseList;
