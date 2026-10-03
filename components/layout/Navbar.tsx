'use client';

/**
 * Mobile-First Responsive Application Navbar
 * 
 * DESIGN FEATURES:
 * - Fluid mobile responsiveness down to 320px screens
 * - Glassmorphism backdrop blur
 * - Responsive "+ Add Expense" action button that never wraps text
 * - Clean brand typography and custom icon badge
 */

import React from 'react';
import { Wallet, Plus } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { openAddModal } from '@/lib/redux/slices/expenseSlice';
import Button from '../ui/Button';

export function Navbar() {
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Logo Icon with subtle glow */}
          <div className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0 transition-transform active:scale-95">
            <Wallet className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>

          {/* Title & Tagline */}
          <div className="flex flex-col min-w-0">
            <h1 className="font-extrabold text-sm sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-tight truncate">
              DailyExpense <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">Noted</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-normal truncate">
              <span className="hidden sm:inline">Personal Finance & Outflow Tracker</span>
              <span className="sm:hidden">Expense Tracker</span>
            </p>
          </div>
        </div>

        {/* Action Button: + Add Expense */}
        <div className="flex items-center shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => dispatch(openAddModal())}
            leftIcon={<Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />}
            className="shadow-sm shadow-indigo-600/30 hover:shadow-md hover:shadow-indigo-600/40 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all"
          >
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
