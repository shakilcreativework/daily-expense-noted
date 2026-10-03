/**
 * Formatting Utilities for Currency, Numbers, and Dates
 */

import { format, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Formats a numeric amount as currency (USD default).
 * 
 * @example formatCurrency(45.5) => "$45.50"
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a Date object or ISO string into human-friendly readable format.
 * 
 * @example formatDate(new Date()) => "Today"
 * @example formatDate("2026-10-02") => "Yesterday"
 * @example formatDate("2026-09-15") => "Sep 15, 2026"
 */
export function formatFriendlyDate(dateInput: Date | string): string {
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Standard YYYY-MM-DD input date string formatter for HTML date inputs.
 */
export function formatDateForInput(dateInput: Date | string = new Date()): string {
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return format(date, 'yyyy-MM-dd');
  } catch {
    return format(new Date(), 'yyyy-MM-dd');
  }
}
