/**
 * Mongoose Expense Model & Schema Definition
 * 
 * WHY THIS PATTERN IS USED:
 * Next.js hot-module reloading in development compiles modules multiple times.
 * If you call `mongoose.model('Expense', Schema)` directly, Mongoose throws an
 * `OverwriteModelError`.
 * 
 * To prevent this, we check `mongoose.models.Expense` first, reusing the existing
 * model if already compiled.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { CATEGORIES, ExpenseCategory } from '../utils/categories';

/**
 * Pure TypeScript representation of an Expense object (used in client state & props).
 */
export interface IExpense {
  _id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string | Date;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Mongoose Document interface (used inside server-side database operations).
 */
export interface IExpenseDocument extends Document {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpenseDocument>(
  {
    title: {
      type: String,
      required: [true, 'Please provide an expense title.'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters.'],
    },
    amount: {
      type: Number,
      required: [true, 'Please enter an expense amount.'],
      min: [0.01, 'Amount must be at least 0.01.'],
      // Round to 2 decimal places to prevent floating-point anomalies
      set: (val: number) => Math.round(val * 100) / 100,
    },
    category: {
      type: String,
      required: [true, 'Please select an expense category.'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a supported category.',
      },
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Please specify the expense date.'],
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [250, 'Notes cannot exceed 250 characters.'],
      default: '',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Compound index for optimizing combined date-range and category queries
ExpenseSchema.index({ date: -1, category: 1 });

export const Expense: Model<IExpenseDocument> =
  mongoose.models.Expense || mongoose.model<IExpenseDocument>('Expense', ExpenseSchema);

export default Expense;
