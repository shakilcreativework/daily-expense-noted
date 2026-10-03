'use client';

/**
 * Add / Edit Expense Form Modal Component
 * 
 * Synchronizes with Redux:
 * - Reads `editingExpense` and `isFormModalOpen` from `expenseSlice`.
 * - Pre-fills form fields when editing.
 * - Handles inline validation errors.
 * - Dispatches `addExpense` or `updateExpense`.
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  closeFormModal,
  addExpense,
  updateExpense,
  fetchExpenses,
} from '@/lib/redux/slices/expenseSlice';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import { CATEGORIES, ExpenseCategory } from '@/lib/utils/categories';
import { formatDateForInput } from '@/lib/utils/formatters';

export function ExpenseFormModal() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isFormModalOpen, editingExpense, filters } = useAppSelector(
    (state) => state.expenses
  );

  // Form Field States
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState(formatDateForInput(new Date()));
  const [notes, setNotes] = useState('');

  // Validation & Loading States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(editingExpense);

  // Synchronize form values whenever modal opens or editing target changes
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(String(editingExpense.amount || ''));
      setCategory(editingExpense.category || 'Food');
      setDate(formatDateForInput(editingExpense.date || new Date()));
      setNotes(editingExpense.notes || '');
    } else {
      // Default clean values for "Add Expense"
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(formatDateForInput(new Date()));
      setNotes('');
    }
    setErrors({});
  }, [editingExpense, isFormModalOpen]);

  // Client-Side Defensive Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter an expense title';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be 100 characters or fewer';
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount)) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than $0.00';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const expensePayload = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      notes: notes.trim(),
    };

    try {
      if (isEditing && editingExpense) {
        await dispatch(
          updateExpense({
            id: editingExpense._id,
            updates: expensePayload,
          })
        ).unwrap();
        showToast('success', 'Expense Updated', `"${expensePayload.title}" was updated successfully.`);
      } else {
        await dispatch(addExpense(expensePayload)).unwrap();
        showToast('success', 'Expense Added', `"${expensePayload.title}" has been recorded.`);
      }

      // Re-fetch current filtered list to reflect changes
      dispatch(fetchExpenses(filters));
      dispatch(closeFormModal());
    } catch (err: unknown) {
      const msg = typeof err === 'string' ? err : 'Operation failed. Please try again.';
      setErrors((prev) => ({ ...prev, submit: msg }));
      showToast('error', 'Operation Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isFormModalOpen}
      onClose={() => dispatch(closeFormModal())}
      title={isEditing ? 'Edit Expense' : 'Add New Expense'}
      description={
        isEditing
          ? 'Update the details for this recorded expense.'
          : 'Record a new daily expense transaction.'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Submit-level error banner */}
        {errors.submit && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {errors.submit}
          </div>
        )}

        {/* Expense Title */}
        <Input
          label="Expense Title"
          placeholder="e.g. Lunch with team, Subway pass, Groceries"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          required
        />

        {/* Amount & Date (2 columns on tablet/desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            required
          />

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
            required
          />
        </div>

        {/* Category Dropdown */}
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          required
        />

        {/* Notes (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Notes / Description (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={250}
            placeholder="Add any extra details or reference numbers..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
          <span className="text-[11px] text-slate-400 text-right">
            {notes.length}/250
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={() => dispatch(closeFormModal())}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ExpenseFormModal;
