/**
 * API Route Handler: /api/expenses
 * 
 * Endpoints:
 * - GET: Fetch a list of expenses with optional filtering, search, and sorting
 * - POST: Create a new expense item with input validation
 * 
 * DESIGN & EDUCATIONAL NOTE:
 * Next.js App Router Route Handlers run in serverless runtimes. Every handler
 * ensures `connectDB()` is called first. The Mongoose connection pool handles
 * connection reuse transparently.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Expense from '@/lib/models/Expense';
import { ExpenseCategory } from '@/lib/utils/categories';

export const dynamic = 'force-dynamic';

/**
 * GET /api/expenses
 * 
 * Query Parameters:
 * - category: Filter by category (e.g. "Food")
 * - startDate: ISO string for minimum date
 * - endDate: ISO string for maximum date
 * - search: Keyword search against title or notes
 * - sortBy: "date" or "amount" (default: "date")
 * - sortOrder: "desc" or "asc" (default: "desc")
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build dynamic MongoDB query filter object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterQuery: Record<string, any> = {};

    // 1. Category Filter
    if (category && category !== 'All') {
      filterQuery.category = category;
    }

    // 2. Date Range Filter
    if (startDate || endDate) {
      filterQuery.date = {};
      if (startDate) {
        filterQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of the selected day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filterQuery.date.$lte = end;
      }
    }

    // 3. Keyword Search (Case-insensitive match on title or notes)
    if (search && search.trim()) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Sanitize regex characters
      filterQuery.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { notes: { $regex: sanitized, $options: 'i' } },
      ];
    }

    // Execute query with sorting
    const sortField = sortBy === 'amount' ? 'amount' : 'date';
    const expenses = await Expense.find(filterQuery)
      .sort({ [sortField]: sortOrder, createdAt: -1 })
      .lean();

    // Calculate total amount for the filtered result set
    const totalAmount = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

    return NextResponse.json(
      {
        success: true,
        count: expenses.length,
        totalAmount: Math.round(totalAmount * 100) / 100,
        data: expenses,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch expenses';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/expenses
 * 
 * Body:
 * { title, amount, category, date, notes }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, amount, category, date, notes } = body;

    // Defensive input validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'A valid title is required.' },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be a positive number greater than 0.' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please select a valid category.' },
        { status: 400 }
      );
    }

    // Create and persist document
    const newExpense = await Expense.create({
      title: title.trim(),
      amount: Math.round(parsedAmount * 100) / 100,
      category: category as ExpenseCategory,
      date: date ? new Date(date) : new Date(),
      notes: notes ? String(notes).trim() : '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Expense added successfully.',
        data: newExpense,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create expense';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
