/**
 * API Route Handler: /api/expenses/summary
 * 
 * Aggregation Endpoint:
 * Computes live summary KPIs and category breakdowns for visual analytics
 * (Used by Recharts Pie Chart and Dashboard Metric Cards).
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Expense from '@/lib/models/Expense';
import { CATEGORY_CONFIG, ExpenseCategory } from '@/lib/utils/categories';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Compute Overall Total & Count
    const overallStats = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    // 2. Compute Current Month Spending
    const monthStats = await Expense.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      {
        $group: {
          _id: null,
          monthTotal: { $sum: '$amount' },
          monthCount: { $sum: 1 },
        },
      },
    ]);

    // 3. Compute Today's Spending
    const todayStats = await Expense.aggregate([
      { $match: { date: { $gte: startOfToday } } },
      {
        $group: {
          _id: null,
          todayTotal: { $sum: '$amount' },
          todayCount: { $sum: 1 },
        },
      },
    ]);

    // 4. Compute Category Breakdown (for Recharts Pie Chart)
    const categoryBreakdownRaw = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalAmount = overallStats[0]?.totalAmount || 0;
    const currentMonthTotal = monthStats[0]?.monthTotal || 0;
    const todayTotal = todayStats[0]?.todayTotal || 0;
    const totalTransactions = overallStats[0]?.totalCount || 0;

    // Calculate daily average for current month up to today
    const dayOfMonth = now.getDate();
    const dailyAverage = dayOfMonth > 0 ? currentMonthTotal / dayOfMonth : 0;

    // Format category breakdown with visual color tokens
    const categoryBreakdown = categoryBreakdownRaw.map((item) => {
      const categoryKey = item._id as ExpenseCategory;
      const config = CATEGORY_CONFIG[categoryKey] || CATEGORY_CONFIG.Others;
      const percentage = totalAmount > 0 ? (item.total / totalAmount) * 100 : 0;

      return {
        category: item._id,
        label: config.label,
        total: Math.round(item.total * 100) / 100,
        count: item.count,
        percentage: Math.round(percentage * 10) / 10,
        color: config.color,
      };
    });

    return NextResponse.json(
      {
        success: true,
        summary: {
          totalAmount: Math.round(totalAmount * 100) / 100,
          currentMonthTotal: Math.round(currentMonthTotal * 100) / 100,
          todayTotal: Math.round(todayTotal * 100) / 100,
          dailyAverage: Math.round(dailyAverage * 100) / 100,
          totalTransactions,
        },
        categoryBreakdown,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate summary';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
