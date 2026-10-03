'use client';

/**
 * FilterBar Component
 * 
 * Supports:
 * - Real-time keyword search
 * - Category filtering ("All" or specific category)
 * - Date Range presets ("All", "Today", "This Week", "This Month")
 * - Reset all filters
 */

import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { startOfWeek, startOfMonth, format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setCategoryFilter,
  setDateRangeFilter,
  setSearchQuery,
  resetFilters,
  fetchExpenses,
} from '@/lib/redux/slices/expenseSlice';
import { CATEGORIES } from '@/lib/utils/categories';
import Button from '../ui/Button';

export function FilterBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.expenses.filters);

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [activeDatePreset, setActiveDatePreset] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== filters.search) {
        dispatch(setSearchQuery(searchInput));
        dispatch(fetchExpenses({ ...filters, search: searchInput }));
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput, dispatch, filters]);

  // Handle Category Change
  const handleCategoryChange = (cat: string) => {
    dispatch(setCategoryFilter(cat));
    dispatch(fetchExpenses({ ...filters, category: cat }));
  };

  // Handle Date Preset Selection
  const handleDatePreset = (preset: 'all' | 'today' | 'week' | 'month') => {
    setActiveDatePreset(preset);
    const now = new Date();

    let startDate: string | null = null;
    let endDate: string | null = null;

    if (preset === 'today') {
      const todayStr = format(now, 'yyyy-MM-dd');
      startDate = todayStr;
      endDate = todayStr;
    } else if (preset === 'week') {
      startDate = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      endDate = format(now, 'yyyy-MM-dd');
    } else if (preset === 'month') {
      startDate = format(startOfMonth(now), 'yyyy-MM-dd');
      endDate = format(now, 'yyyy-MM-dd');
    }

    dispatch(setDateRangeFilter({ startDate, endDate }));
    dispatch(fetchExpenses({ ...filters, startDate, endDate }));
  };

  // Reset All Filters
  const handleReset = () => {
    setSearchInput('');
    setActiveDatePreset('all');
    dispatch(resetFilters());
    dispatch(fetchExpenses({ category: 'All', startDate: null, endDate: null, search: '' }));
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    Boolean(filters.search) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col gap-4">
      {/* Top Row: Search Input & Category Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by title, merchant, notes..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative min-w-[160px]">
          <select
            value={filters.category || 'All'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 pr-9 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-colors"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Filter size={14} />
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw size={14} />}
            className="text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Bottom Row: Date Presets */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
          Date:
        </span>
        {(['all', 'today', 'week', 'month'] as const).map((preset) => {
          const labels = {
            all: 'All Time',
            today: 'Today',
            week: 'This Week',
            month: 'This Month',
          };
          const isActive = activeDatePreset === preset;
          return (
            <button
              key={preset}
              onClick={() => handleDatePreset(preset)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {labels[preset]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;
