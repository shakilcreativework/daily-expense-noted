# Granular Step-by-Step Task Breakdown & Role Matrix
## Project: Daily Expense Tracker ("DailyExpense Noted")

> **Operational Guidelines:**
> - **Zero Mismatch Workflow**: Execute tasks sequentially in micro-increments.
> - **Roles Represented**: 👨‍💻 Full-Stack Developer, 🎨 UI/UX Designer, 🛡️ QA & Test Engineer.
> - **Educational Focus**: Clean, self-documenting code with inline commentary explaining the "why".
> - **Git Discipline**: Local commits only. **NO AUTO-PUSH TO GITHUB**.

---

## Phase 1: Project Scaffolding & Setup

### Task 1.1: Next.js + TypeScript Initial Setup
- **Role (👨‍💻 Developer)**: Initialize Next.js project with App Router, TypeScript, and ESLint configuration. Clean out starter boilerplate.
- **Role (🎨 UI/UX)**: Set up typography (Inter/Outfit font import) and base responsive viewport metadata.
- **Role (🛡️ QA)**: Verify `npm run dev` and `npm run build` execute without compile warnings.
- **Expert Learning Concept**: App Router structure (`app/layout.tsx`, `app/page.tsx`), server component defaults, and TypeScript strict mode.
- [x] Status: Completed

### Task 1.2: Tailwind CSS & Design Token System
- **Role (🎨 UI/UX)**: Configure color tokens for expense categories (Emerald for Food, Sky for Transport, Amber for Shopping, Rose for Bills, Purple for Entertainment, Slate for Others).
- **Role (👨‍💻 Developer)**: Set up global styles (`globals.css`) with smooth scrolling and CSS variable theme tokens.
- **Role (🛡️ QA)**: Test color contrast ratios for dark and light readability.
- **Expert Learning Concept**: Design token centralization in CSS and utility-first styling.
- [x] Status: Completed

### Task 1.3: Core Dependencies Installation
- **Role (👨‍💻 Developer)**: Install `@reduxjs/toolkit`, `react-redux`, `mongoose`, `recharts`, `lucide-react`, `date-fns`, and `clsx`/`tailwind-merge`.
- **Role (🛡️ QA)**: Verify dependency tree integrity and verify package versions resolve cleanly.
- **Expert Learning Concept**: Curating a lightweight, high-performance full-stack dependency stack.
- [x] Status: Completed

---

## Phase 2: Database Layer & Data Modeling (Mongoose)

### Task 2.1: Serverless MongoDB Connection Singleton
- **Role (👨‍💻 Developer)**: Implement `lib/db.ts` with cached Mongoose connection pool to prevent connection leaking in serverless environments.
- **Role (🛡️ QA)**: Test behavior when `MONGODB_URI` is missing (fails fast with actionable error message) and when connection succeeds.
- **Expert Learning Concept**: Why global connection caching is essential in Next.js / Vercel serverless functions vs traditional Express servers.
- [x] Status: Completed

### Task 2.2: Expense Mongoose Model & Schema
- **Role (👨‍💻 Developer)**: Create `lib/models/Expense.ts` with strict schema validation:
  - `title`: String, required, max 100 characters, trimmed.
  - `amount`: Number, required, minimum 0.01.
  - `category`: String enum with supported category list.
  - `date`: Date, default `Date.now`, indexed.
  - `notes`: Optional String, max 250 characters.
  - Compound index: `{ date: -1, category: 1 }`.
- **Role (🛡️ QA)**: Test schema-level validation errors (negative amounts, invalid categories).
- **Expert Learning Concept**: Mongoose timestamps, indexing for fast range queries, and TypeScript Document interfaces.
- [x] Status: Completed

---

## Phase 3: RESTful API Route Handlers (App Router)

### Task 3.1: Expense Listing & Filtering Endpoint (`GET /api/expenses`)
- **Role (👨‍💻 Developer)**: Implement `GET` in `app/api/expenses/route.ts` supporting query parameters: `category`, `startDate`, `endDate`, `search`, and sorting.
- **Role (🛡️ QA)**: Test edge cases: empty database, regex query sanitization, invalid date strings.
- **Expert Learning Concept**: Next.js App Router `NextRequest`, `NextResponse.json`, URLSearchParams parsing, and MongoDB query filtering.
- [x] Status: Completed

### Task 3.2: Expense Creation Endpoint (`POST /api/expenses`)
- **Role (👨‍💻 Developer)**: Implement `POST` in `app/api/expenses/route.ts` with body validation and error handling. Returns HTTP 201 on success.
- **Role (🛡️ QA)**: Test rejection of empty payload, missing required fields, or non-numeric amount.
- **Expert Learning Concept**: Server-side defensive validation and standardized JSON response envelopes.
- [x] Status: Completed

### Task 3.3: Expense Update & Deletion Endpoints (`PUT / DELETE /api/expenses/[id]`)
- **Role (👨‍💻 Developer)**: Implement `PUT` and `DELETE` in `app/api/expenses/[id]/route.ts`.
- **Role (🛡️ QA)**: Test updating non-existent ID (404), invalid MongoDB ObjectId format (400), and successful deletion.
- **Expert Learning Concept**: Dynamic route parameters in App Router (`await params`), MongoDB findByIdAndUpdate, and atomic deletion.
- [x] Status: Completed

### Task 3.4: Expense Analytics Summary Endpoint (`GET /api/expenses/summary`)
- **Role (👨‍💻 Developer)**: Implement MongoDB aggregation pipeline to compute category totals, overall spending, and monthly breakdown.
- **Role (🛡️ QA)**: Verify mathematical summation against manual test data entries.
- **Expert Learning Concept**: MongoDB `$group`, `$sum`, and `$match` aggregation pipeline stages.
- [x] Status: Completed

---

## Phase 4: State Management Architecture (Redux Toolkit)

### Task 4.1: Redux Store & Typed Hooks Setup
- **Role (👨‍💻 Developer)**: Create `lib/redux/store.ts`, typed `useAppDispatch` and `useAppSelector` in `lib/redux/hooks.ts`, and client `StoreProvider` in `lib/redux/provider.tsx`.
- **Role (🛡️ QA)**: Verify client store initializes properly with React 19 hydration.
- **Expert Learning Concept**: Integrating Redux store into Next.js App Router without breaking Server Components.
- [x] Status: Completed

### Task 4.2: Expense Slice & Async Thunks
- **Role (👨‍💻 Developer)**: Build `lib/redux/slices/expenseSlice.ts` with:
  - Thunks: `fetchExpenses`, `createExpense`, `updateExpense`, `deleteExpense`.
  - Reducers: `setCategoryFilter`, `setDateFilter`, `setSearchQuery`, `openModal`, `closeModal`.
  - State: items, loading, error, active filters, editing target.
- **Role (🛡️ QA)**: Test optimistic updates and error state rollback when API fails.
- **Expert Learning Concept**: Redux Toolkit `createAsyncThunk`, pending/fulfilled/rejected builder cases, and immutable state updates with Immer.
- [x] Status: Completed

---

## Phase 5: Reusable UI Design System

### Task 5.1: UI Primitives (Button, Input, Badge, Select)
- **Role (🎨 UI/UX)**: Design accessible, micro-animated buttons (primary, secondary, danger, ghost), styled inputs with focus rings, select dropdowns, and category badges with icons.
- **Role (👨‍💻 Developer)**: Write composable TypeScript components in `components/ui/` with clean variant props.
- **Role (🛡️ QA)**: Verify keyboard focus states (`outline-ring`) and ARIA roles.
- **Expert Learning Concept**: Headless UI principles, atomic component design, and reusable CSS variants.
- [x] Status: Completed

### Task 5.2: Accessible Modal Dialog & Confirmation Modal
- **Role (🎨 UI/UX)**: Backdrop blur, smooth scale-in animation, sticky action bar, mobile drawer adaptability.
- **Role (👨‍💻 Developer)**: Implement focus trap, body scroll lock, and `Escape` key dismiss.
- **Role (🛡️ QA)**: Test backdrop click dismiss and confirm dialog cancellation before delete.
- **Expert Learning Concept**: Portal rendering and accessible modal dialog patterns.
- [x] Status: Completed

---

## Phase 6: Form & Expense Management Features

### Task 6.1: Add & Edit Expense Form Modal
- **Role (🎨 UI/UX)**: Clean layout with title input, currency-formatted amount input, category picker with visual badges, and date picker.
- **Role (👨‍💻 Developer)**: Wire up form state, validation error indicators, pre-fill logic when editing, and submit dispatch.
- **Role (🛡️ QA)**: Test editing an existing expense (pre-fills correctly, saves changes, updates UI instantly).
- **Expert Learning Concept**: Controlled inputs, form state synchronization with Redux editing targets.
- [x] Status: Completed

### Task 6.2: Responsive Expense List (Desktop Table & Mobile Cards)
- **Role (🎨 UI/UX)**:
  - Desktop: Clean data table with date, title, category badge, amount, and actions.
  - Mobile/Tablet: Stacked cards with category icon, relative dates, and swipeable or quick-action buttons.
- **Role (👨‍💻 Developer)**: Build toggleable view or responsive container in `components/expenses/ExpenseList.tsx`.
- **Role (🛡️ QA)**: Resize viewport across 375px (mobile), 768px (tablet), and 1280px (desktop) to ensure zero horizontal scroll overflow.
- **Expert Learning Concept**: Responsive data presentation patterns and component composition.
- [x] Status: Completed

---

## Phase 7: Analytics, Filtering & Visual Dashboard (Bonus Features)

### Task 7.1: KPI Financial Metric Cards
- **Role (🎨 UI/UX)**: Visually distinct metric cards with subtle gradient accents: Total Spending, Spending This Month, Average Daily Spending, and Top Category.
- **Role (👨‍💻 Developer)**: Calculate live KPI metrics derived from Redux expense state or summary endpoint.
- **Role (🛡️ QA)**: Test calculation accuracy when filtering expenses (KPIs update dynamically).
- **Expert Learning Concept**: Derived selectors and memoized state computations.
- [x] Status: Completed

### Task 7.2: Interactive Category Pie Chart (Recharts)
- **Role (🎨 UI/UX)**: Sleek Donut / Pie chart with category colors matching the badges, interactive hover tooltips, and legend.
- **Role (👨‍💻 Developer)**: Connect category breakdown data to Recharts `PieChart`, `Pie`, `Cell`, `Tooltip`, and `ResponsiveContainer`.
- **Role (🛡️ QA)**: Test empty state when no expenses exist (shows gentle placeholder instead of broken chart).
- **Expert Learning Concept**: Integrating third-party client SVG charting libraries inside Next.js Client Components.
- [x] Status: Completed

### Task 7.3: Dynamic Filter Bar & Real-Time Search
- **Role (🎨 UI/UX)**: Sticky or top-aligned filter toolbar with category pill selector, date range picker ("Today", "This Week", "This Month", "All"), and search bar.
- **Role (👨‍💻 Developer)**: Debounced search dispatch, date-range filtering, and instant Redux filter updates.
- **Role (🛡️ QA)**: Test combined filters (e.g. "Food" + "This Month" + search query "lunch").
- **Expert Learning Concept**: Debounced search inputs and compound filter logic.
- [x] Status: Completed

---

## Phase 8: Polish, UX Enhancements & Testing

### Task 8.1: Toast Notifications & Skeleton Loading States
- **Role (🎨 UI/UX)**: Shimmer skeleton cards during initial fetch; animated toast messages for "Expense Added", "Expense Updated", "Expense Deleted".
- **Role (👨‍💻 Developer)**: Global lightweight toast manager integrated with Redux or React context.
- **Role (🛡️ QA)**: Verify toast auto-dismiss after 3.5 seconds and manual dismiss button.
- **Expert Learning Concept**: Perceived performance optimization and user feedback loops.
- [x] Status: Completed

### Task 8.2: End-to-End QA Testing & Code Review
- **Role (🛡️ QA)**: Execute full test matrix (Add, Edit, Delete, Filter, Sort, Responsiveness, Negative Inputs).
- **Role (👨‍💻 Developer)**: Verify zero TypeScript errors, clean ESLint report, and self-documenting code commentary throughout.
- **Role (🎨 UI/UX)**: Final visual audit against WCAG contrast and smooth micro-animations.
- **Expert Learning Concept**: Production-grade verification and readiness checks.
- [x] Status: Completed

### Task 8.3: Documentation & README Setup Guide
- **Role (👨‍💻 Developer)**: Create comprehensive `README.md` with:
  - Architecture overview & technology breakdown.
  - Step-by-step local setup instructions.
  - MongoDB Atlas configuration.
  - Vercel deployment walkthrough.
  - Features overview with screenshots.
- **Role (🛡️ QA)**: Follow README instructions from scratch to confirm all commands work smoothly.
- **Expert Learning Concept**: Developer experience (DX) and open-source documentation excellence.
- [x] Status: Completed
