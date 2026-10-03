/**
 * Dynamic API Route Handler: /api/expenses/[id]
 * 
 * Endpoints:
 * - PUT: Update an existing expense by its MongoDB _id
 * - DELETE: Remove an expense by its MongoDB _id
 * 
 * NEXT.JS 15/16 APP ROUTER COMPATIBILITY:
 * In modern Next.js, `params` is an asynchronous Promise that must be awaited:
 * `const { id } = await params;`
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Expense from '@/lib/models/Expense';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/expenses/[id]
 * Updates an existing expense document.
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;

    // Validate MongoDB ObjectId format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid expense ID provided.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, amount, category, date, notes } = body;

    // Build update payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json(
          { success: false, error: 'Title cannot be empty.' },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    if (amount !== undefined) {
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json(
          { success: false, error: 'Amount must be greater than zero.' },
          { status: 400 }
        );
      }
      updateData.amount = Math.round(parsedAmount * 100) / 100;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (date !== undefined) {
      updateData.date = new Date(date);
    }

    if (notes !== undefined) {
      updateData.notes = String(notes).trim();
    }

    // Execute atomic update and return updated document
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return NextResponse.json(
        { success: false, error: 'Expense not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Expense updated successfully.',
        data: updatedExpense,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update expense';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/expenses/[id]
 * Deletes an expense document from MongoDB.
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid expense ID provided.' },
        { status: 400 }
      );
    }

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return NextResponse.json(
        { success: false, error: 'Expense not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Expense deleted successfully.',
        data: { _id: id },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete expense';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
