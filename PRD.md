# Product Requirements Document (PRD)
## Project: Daily Expense Tracker ("DailyExpense Noted")

---

## 1. Executive Summary & Objective

**DailyExpense Noted** is a modern, responsive full-stack personal finance and expense tracking web application. It empowers users to monitor, analyze, and manage their daily financial outflows effortlessly.

Built using **Next.js (App Router) & TypeScript**, **Redux Toolkit**, **Mongoose (MongoDB)**, and styled with **Tailwind CSS**, the application delivers a real-time, interactive, and visually engaging experience across mobile, tablet, and desktop form factors.

### Key Goals:
- Deliver frictionless daily expense tracking with intuitive CRUD operations.
- Provide instant visual clarity with category badges, financial metric cards, and interactive expense breakdown charts.
- Offer dynamic filtering (by category, date range, search queries).
- Adhere to clean code practices, production-ready full-stack architecture, and zero-downtime serverless deployment on Vercel.

---

## 2. Tech Stack & Architectural Decisions (Latest Ecosystem)

| Layer | Technology & Version | Rationale & New Key Features |
|---|---|---|
| **Framework** | **Next.js 16 / 15 (App Router)** | Full-stack React framework with Turbopack, Async Request APIs (`await params`), uncached-by-default Route Handlers, and native Vercel optimization. |
| **UI Library** | **React 19** | Built-in Server Actions, `useActionState`, and `useOptimistic` for instant UI feedback without waiting for server responses. |
| **Language** | **TypeScript 5.8+** | Strict type safety across client UI, Redux slices, API payloads, and Mongoose document models. |
| **State Management** | **Redux Toolkit (RTK) 2.13+** | Predictable global state management, React 19 compatibility, `combineSlices`, typed hooks, and async thunks. |
| **Database & ODM** | **MongoDB Atlas + Mongoose 9.10+** | Modern document database schema with Node 20+ performance, lean typings, and cached connection pooling for serverless environments. |
| **Styling & UI** | **Tailwind CSS v4.3+ & Lucide Icons** | New Rust Oxide engine (10x faster), zero-config `@import "tailwindcss";`, native CSS `@theme` tokens, container queries, and glassmorphic micro-interactions. |
| **Data Visualization** | **Recharts 3.10+** | Pure TypeScript SVG charting with zero legacy React lifecycles for dynamic category pie/doughnut breakdown. |
| **Validation** | **Zod 3.24+ / 4.x** | High-speed schema validation for client forms and incoming API request payloads. |
| **Deployment** | **Vercel** | Seamless CI/CD serverless host optimized for Next.js and MongoDB Atlas integration. |

---

## 3. User Personas & Core Workflows

### 3.1 Primary Persona: "The Conscious Spender"
- **Needs:** Fast entry on mobile or desktop during or right after a purchase, immediate visual feedback on total spending, and categorization to detect spending leaks.
- **Pain Points:** Clunky spreadsheets, slow multi-step forms, lack of visual analytics on mobile screens.

### 3.2 Key User Journeys
1. **Adding an Expense:** User taps "+ Add Expense", enters title, amount, category, and date. Submits with optimistic UI update and instant feedback.
2. **Reviewing & Filtering Expenses:** User inspects dashboard summary cards (Total Spent, Monthly Budget Progress, Daily Average). Filters expenses by category ("Food", "Transport") or date ranges ("This Week", "Custom Date Range").
3. **Editing an Existing Expense:** User clicks Edit on an item. A modal/drawer pre-fills the data. Changes update the database and recalculate category totals and charts in real time.
4. **Deleting an Expense:** User clicks Delete with an interactive confirmation guard. The item is removed and metrics re-aggregate.

---

## 4. Functional Requirements

### 4.1 Expense Form (Add & Edit)
- **Title:** Required text string (1–100 chars, sanitized).
- **Amount:** Required positive number (`> 0`, 2 decimal precision).
- **Category:** Required single selection from predefined taxonomy:
  - `Food & Dining` (Icon: Utensils, Color: Emerald)
  - `Transportation` (Icon: Car/Train, Color: Sky)
  - `Shopping` (Icon: ShoppingBag, Color: Amber)
  - `Bills & Utilities` (Icon: FileText, Color: Rose)
  - `Entertainment` (Icon: Film, Color: Purple)
  - `Health & Medical` (Icon: HeartPulse, Color: Red)
  - `Education` (Icon: BookOpen, Color: Indigo)
  - `Others` (Icon: MoreHorizontal, Color: Slate)
- **Date:** Required date picker (defaults to today's date, accepts past or present dates).
- **Notes / Description (Optional):** Optional short note (up to 250 characters).
- **Form Controls:** Inline validation errors, clear buttons, submit state loading spinners.

### 4.2 Expense List & Table Views
- Dual presentation mode: **Responsive Data Table** (desktop) and **Card List** (mobile/tablet).
- Each record displays:
  - Expense Title & optional notes.
  - Category Badge with distinct color coding and icon.
  - Formatted Date (e.g., `Oct 3, 2026`).
  - Formatted Amount in local/selected currency (e.g., `$45.00`).
  - Action Controls: Edit (pencil icon) & Delete (trash icon).
- Empty State: Clean illustration with "No expenses recorded yet. Add your first expense!" call-to-action.

### 4.3 Financial Summary & KPI Metrics
Top dashboard overview displaying:
- **Total Expenses:** Sum total of all matching expenses.
- **Monthly Spending:** Spending recorded within the current calendar month.
- **Average Daily Expense:** Derived from filtered date range.
- **Top Category:** Highest spending category by dollar volume.

### 4.4 Advanced Filtering, Sorting & Search (Bonus Features)
- **Category Filter:** Multi-select or dropdown filter ("All Categories" or specific category).
- **Date Range Filter:** Presets ("Today", "This Week", "This Month", "Last 30 Days", "Custom Range").
- **Real-time Search:** Search input querying title or notes.
- **Sorting:** Sort by Date (newest/oldest) or Amount (highest/lowest).

### 4.5 Visual Analytics (Bonus Feature)
- **Interactive Pie / Doughnut Chart (Recharts):**
  - Displays percentage and total amount per category.
  - Custom tooltips showing dollar amount and percentage share.
  - Color palette mapped directly to category badges.
  - Dynamic responsive container adapting seamlessly to screen size changes.

---

## 5. Non-Functional Requirements & UX Standards

### 5.1 UI/UX Aesthetics & Design Tokens
- Modern glassmorphism / card-based design with subtle elevation and borders.
- Curated color system:
  - Dark mode and light mode compatibility.
  - Primary brand accents (e.g., Deep Indigo / Electric Violet `#6366f1`).
  - High-contrast text readability (WCAG AA compliant).
- Micro-interactions:
  - Smooth hover animations on cards and buttons.
  - Shimmer skeleton loaders while fetching data.
  - Toast notifications for create, update, and delete actions.

### 5.2 Performance & Responsiveness
- First Contentful Paint (FCP) `< 1.2s`.
- Time to Interactive (TTI) `< 2.0s`.
- Mobile-first responsive breakpoints: Mobile (`< 640px`), Tablet (`640px - 1024px`), Desktop (`> 1024px`).

### 5.3 Reliability & Error Handling
- Defensive error boundaries around API requests.
- MongoDB connection reuse (cached connection pool) to avoid connection exhaustion in serverless Vercel lambdas.
- Graceful API failure feedback (error toasts, retry buttons).

---

## 6. Data Modeling & Database Schema (Mongoose)

### `Expense` Model Schema
```typescript
interface IExpense {
  _id: string;
  title: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Entertainment' | 'Health' | 'Education' | 'Others';
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Mongoose Schema Definition
```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExpenseDocument extends Document {
  title: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpenseDocument>(
  {
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Food',
          'Transport',
          'Shopping',
          'Bills',
          'Entertainment',
          'Health',
          'Education',
          'Others',
        ],
        message: '{VALUE} is not a supported category',
      },
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required'],
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [250, 'Notes cannot exceed 250 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for optimized date-range and category queries
ExpenseSchema.index({ date: -1, category: 1 });

export const Expense: Model<IExpenseDocument> =
  mongoose.models.Expense || mongoose.model<IExpenseDocument>('Expense', ExpenseSchema);
```

---

## 7. API Architecture & REST Endpoints

All endpoints are built using Next.js App Router API Routes (`/app/api/expenses/...`).

### 7.1 `GET /api/expenses`
- **Description:** Retrieve list of expenses with optional filtering, search, and sorting.
- **Query Parameters:**
  - `category` (optional, string)
  - `startDate` (optional, ISO date string)
  - `endDate` (optional, ISO date string)
  - `search` (optional, string matching title/notes)
  - `sortBy` (optional: `date`, `amount`; default: `date`)
  - `sortOrder` (optional: `desc`, `asc`; default: `desc`)
- **Response:**
  ```json
  {
    "success": true,
    "count": 12,
    "totalAmount": 485.50,
    "data": [ ... ]
  }
  ```

### 7.2 `POST /api/expenses`
- **Description:** Create a new expense entry.
- **Request Body:**
  ```json
  {
    "title": "Groceries at Supermarket",
    "amount": 64.25,
    "category": "Food",
    "date": "2026-10-03T10:00:00.000Z",
    "notes": "Weekly produce and snacks"
  }
  ```
- **Response Status:** `201 Created`

### 7.3 `PUT /api/expenses/[id]`
- **Description:** Update an existing expense by its MongoDB `_id`.
- **Request Body:** Partial or complete fields (`title`, `amount`, `category`, `date`, `notes`).
- **Response Status:** `200 OK`

### 7.4 `DELETE /api/expenses/[id]`
- **Description:** Delete an expense by its MongoDB `_id`.
- **Response Status:** `200 OK`

### 7.5 `GET /api/expenses/summary`
- **Description:** Aggregation endpoint returning totals by category and monthly comparison for charts.
- **Response:**
  ```json
  {
    "success": true,
    "overallTotal": 1420.75,
    "categoryBreakdown": [
      { "category": "Food", "total": 520.00, "count": 15 },
      { "category": "Transport", "total": 180.50, "count": 8 }
    ]
  }
  ```

---

## 8. State Management Architecture (Redux Toolkit)

### 8.1 Redux Store Structure
```typescript
interface RootState {
  expenses: {
    items: IExpense[];
    isLoading: boolean;
    error: string | null;
    filters: {
      category: string;
      startDate: string | null;
      endDate: string | null;
      searchQuery: string;
      sortBy: 'date' | 'amount';
      sortOrder: 'desc' | 'asc';
    };
    summary: {
      totalAmount: number;
      monthlyTotal: number;
      categoryTotals: Record<string, number>;
    };
    editingExpense: IExpense | null;
    isModalOpen: boolean;
  };
}
```

### 8.2 Async Thunks
- `fetchExpenses(filterParams)`: Queries `/api/expenses` with active filter parameters.
- `createExpense(expenseData)`: Posts to `/api/expenses` and adds to items.
- `updateExpense({ id, updates })`: Puts updates to `/api/expenses/[id]`.
- `deleteExpense(id)`: Sends delete request and removes from state.

---

## 9. Component Hierarchy & Layout

```
app/
├── layout.tsx                 // Root layout, Redux Provider, Toast notifications, Theme
├── page.tsx                   // Main Dashboard page
├── api/
│   └── expenses/
│       ├── route.ts           // GET, POST handler
│       ├── [id]/
│       │   └── route.ts       // PUT, DELETE handler
│       └── summary/
│           └── route.ts       // Aggregation metrics handler
components/
├── dashboard/
│   ├── MetricCards.tsx        // Total, Monthly, Daily average KPI cards
│   ├── ExpenseChart.tsx       // Recharts Category Pie / Breakdown
│   ├── FilterBar.tsx          // Category filter, Date range picker, Search
│   └── QuickActionHeader.tsx  // Brand header + "+ New Expense" trigger
├── expenses/
│   ├── ExpenseFormModal.tsx   // Add / Edit Modal Dialog with form validation
│   ├── ExpenseList.tsx        // Container managing Card/Table toggle
│   ├── ExpenseTable.tsx       // Desktop responsive table view
│   ├── ExpenseCard.tsx        // Mobile card view with category badge & quick actions
│   └── DeleteConfirmModal.tsx // Safe confirmation dialog
└── ui/
    ├── Badge.tsx              // Category badges with custom colors
    ├── Button.tsx             // Primary, secondary, outline, danger states
    ├── Input.tsx              // Form inputs with validation errors
    ├── Modal.tsx              // Accessible backdrop and focus trap
    └── Skeleton.tsx           // Loading placeholders
lib/
├── db.ts                      // Mongoose connection caching helper
├── models/
│   └── Expense.ts             // Mongoose model definition
├── redux/
│   ├── store.ts               // Redux store configuration
│   ├── hooks.ts               // Typed useSelector and useDispatch
│   └── slices/
│       └── expenseSlice.ts    // Slice, reducers, and async thunks
└── utils/
    ├── currency.ts            // Currency formatting utility
    └── date.ts                // Date formatting and range helpers
```

---

## 10. Planned Git Commit Roadmap (10+ Meaningful Commits)

In accordance with project guidelines, development is structured into a clean, incremental git commit sequence:

1. `chore: project initialization with Next.js 14, TypeScript, and Tailwind CSS`
2. `feat(db): configure MongoDB connection singleton and Mongoose Expense model`
3. `feat(api): implement RESTful API route handlers for CRUD operations`
4. `feat(state): set up Redux Toolkit store, expense slice, and async thunks`
5. `feat(ui): design reusable UI primitives (Button, Modal, Input, Badge)`
6. `feat(form): create responsive Add/Edit Expense modal with form validation`
7. `feat(list): build responsive Expense List with Table and Card views`
8. `feat(analytics): integrate KPI summary cards and Recharts category pie chart`
9. `feat(filter): implement dynamic category, search, and date-range filters`
10. `feat(ux): add toast notifications, skeleton loaders, and empty states`
11. `docs: add comprehensive README with setup, architecture, and deployment guide`
12. `chore: finalize Vercel build configuration and environment variable validation`

*(Note: Commits are to be made locally without automated push to GitHub until instructed by the user).*

---

## 11. Verification & Testing Acceptance Criteria

| ID | Test Scenario | Acceptance Criteria |
|---|---|---|
| **AC-01** | Add Expense | Submitting form with valid data adds expense to list and MongoDB; updates total amount immediately. |
| **AC-02** | Validation | Submitting empty title or negative amount displays explicit error message; prevents API call. |
| **AC-03** | Edit Expense | Clicking edit opens modal with pre-filled inputs; saving updates both UI and database. |
| **AC-04** | Delete Expense | Clicking delete triggers confirmation; on confirmation, item is removed from database and list. |
| **AC-05** | Category Badge | Correct colored badge and icon rendered for each category in table and cards. |
| **AC-06** | Total Metric | Header KPI card reflects exact sum of displayed expenses. |
| **AC-07** | Category Pie Chart | Chart visualizes exact percentage breakdown matching active category totals. |
| **AC-08** | Filtering & Search | Selecting category or typing in search updates the list dynamically without full page reload. |
| **AC-09** | Responsiveness | Mobile layout gracefully switches to card stack; table layout functions on desktop without horizontal overflow. |
| **AC-10** | Vercel Deployment | `npm run build` succeeds cleanly without TypeScript or ESLint errors; environment variables correctly documented. |
