/**
 * Category Definitions & Design Tokens
 * 
 * Central source of truth for expense categories, associated colors,
 * icons, and UI metadata used across the entire application (Forms, Badges, Charts).
 */

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Others',
] as const;

export type ExpenseCategory = (typeof CATEGORIES)[number];

export interface CategoryMeta {
  label: string;
  color: string; // Hex for Recharts & dynamic styling
  badgeBg: string; // Tailwind background utility class
  badgeText: string; // Tailwind text utility class
  badgeBorder: string; // Tailwind border utility class
  iconName: string; // Lucide icon identifier
}

export const CATEGORY_CONFIG: Record<ExpenseCategory, CategoryMeta> = {
  Food: {
    label: 'Food & Dining',
    color: '#10b981', // emerald-500
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/50',
    iconName: 'Utensils',
  },
  Transport: {
    label: 'Transportation',
    color: '#0ea5e9', // sky-500
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeText: 'text-sky-700 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-800/50',
    iconName: 'Car',
  },
  Shopping: {
    label: 'Shopping',
    color: '#f59e0b', // amber-500
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/50',
    iconName: 'ShoppingBag',
  },
  Bills: {
    label: 'Bills & Utilities',
    color: '#f43f5e', // rose-500
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800/50',
    iconName: 'Receipt',
  },
  Entertainment: {
    label: 'Entertainment',
    color: '#a855f7', // purple-500
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-200 dark:border-purple-800/50',
    iconName: 'Film',
  },
  Health: {
    label: 'Health & Medical',
    color: '#ef4444', // red-500
    badgeBg: 'bg-red-50 dark:bg-red-950/40',
    badgeText: 'text-red-700 dark:text-red-300',
    badgeBorder: 'border-red-200 dark:border-red-800/50',
    iconName: 'HeartPulse',
  },
  Education: {
    label: 'Education',
    color: '#6366f1', // indigo-500
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800/50',
    iconName: 'GraduationCap',
  },
  Others: {
    label: 'Others',
    color: '#64748b', // slate-500
    badgeBg: 'bg-slate-100 dark:bg-slate-800/50',
    badgeText: 'text-slate-700 dark:text-slate-300',
    badgeBorder: 'border-slate-200 dark:border-slate-700',
    iconName: 'Tag',
  },
};
