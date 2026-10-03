'use client';

/**
 * Main Application Dashboard Page
 * 
 * Central hub connecting:
 * - Redux Store initial data dispatch
 * - KPI Metric Summary Cards
 * - Interactive Recharts Category Pie Chart
 * - Dynamic Filter Bar (search, categories, date ranges)
 * - Responsive Expense List (Desktop Table + Mobile Cards)
 * - Add/Edit Expense Modal Dialog
 */

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { fetchExpenses, fetchExpenseSummary } from '@/lib/redux/slices/expenseSlice';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MetricSummary from '@/components/analytics/MetricSummary';
import ExpensePieChart from '@/components/analytics/ExpensePieChart';
import FilterBar from '@/components/expenses/FilterBar';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExpenseFormModal from '@/components/expenses/ExpenseFormModal';

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  // Load initial expenses and summary stats on page mount
  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchExpenseSummary());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* KPI Financial Metric Overview */}
        <section aria-label="Financial Overview">
          <MetricSummary />
        </section>

        {/* Analytics & Expense Management Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main 2-Column Section: Filters + Expense List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <FilterBar />
            <ExpenseList />
          </div>

          {/* Right Column: Visual Category Pie Chart Analytics */}
          <div className="lg:col-span-1 flex flex-col gap-6 sticky top-24">
            <ExpensePieChart />
          </div>
        </div>
      </main>

      {/* Global Form Modal for Add / Edit */}
      <ExpenseFormModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}
