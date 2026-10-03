# Project Context Engineering Guide
## Project: Daily Expense Tracker ("DailyExpense Noted")

> **IMPORTANT OPERATIONAL RULE:**
> **NO AUTO-COMMIT & NO AUTO-PUSH TO GITHUB.** All Git operations (`git commit`, `git push`) must be performed **manually by the user**. At every completed milestone, the AI will provide the exact suggested Conventional Commit message and copy-pasteable command for the user.

---

## 1. Project Mission & Identity
**DailyExpense Noted** is a full-stack daily expense tracking application built using Next.js (App Router), TypeScript, Redux Toolkit, Mongoose (MongoDB), and Tailwind CSS. The system allows users to log expenses, categorize spending, view metrics and charts, filter by date/category, and edit/delete entries with full responsiveness across mobile, tablet, and desktop.

---

## 2. Technology Stack & Package Architecture (Latest Ecosystem Versions)

| Domain | Technology | Latest Version | Key New Features & Paradigms |
|---|---|---|---|
| **Framework** | **Next.js (App Router)** | `v16.3+` / `v15.5+` | Turbopack default engine, Async Request APIs (`await params`, `await searchParams`), uncached-by-default route handlers, React 19 server actions |
| **UI Library** | **React & React-DOM** | `v19.3+` | First-class Actions, `useActionState`, `useOptimistic` for instant UI updates, asset hoisting |
| **Language** | **TypeScript** | `v5.8+` / `v7.x` | `strict: true`, native satisfies operator, enhanced const type parameters, fast checking |
| **Styling** | **Tailwind CSS** | `v4.3+` | All-new Rust Oxide engine (10x faster), zero-config `@import "tailwindcss";`, CSS-native `@theme` tokens, built-in container queries |
| **Global State** | **Redux Toolkit (RTK)** | `v2.13+` (`react-redux v9.3+`) | React 19 compatibility, `combineSlices`, typed hooks (`useAppDispatch`, `useAppSelector`), async thunks |
| **Database & ODM** | **MongoDB + Mongoose** | `v9.10+` | Node.js 20+ optimized, lean TypeScript type inference, serverless connection caching (`lib/db.ts`) |
| **Data Viz** | **Recharts** | `v3.10+` | Full TypeScript rewrite, modern React 19 root SVG rendering, zero deprecated lifecycle warnings |
| **Icons** | **Lucide React** | `v1.50+` | Tree-shakable SVG icon set, crisp rendering on high-DPI displays |
| **Date Utils** | **date-fns** | `v4.4+` | Pure ESM, tree-shakeable modular functions for range calculation and locale formatting |
| **Validation** | **Zod** | `v3.24+` / `v4.x` | High-speed schema parsing and client/server validation |

---

## 3. Directory Layout Specification

```text
daily-expense-noted/
├── .agents/                    # Workspace agent rules & customization
│   └── rules/
│       └── context-engineering.md
├── app/                        # Next.js App Router root
│   ├── api/
│   │   └── expenses/
│   │       ├── route.ts        # GET (filtered list) & POST (create)
│   │       ├── [id]/
│   │       │   └── route.ts    # PUT (update) & DELETE (remove)
│   │       └── summary/
│   │           └── route.ts    # Aggregated metrics for charts
│   ├── favicon.ico
│   ├── globals.css             # Tailwind base & custom utility styles
│   ├── layout.tsx              # Root HTML layout with Redux Store Provider
│   └── page.tsx                # Main Dashboard View
├── components/
│   ├── analytics/
│   │   ├── ExpensePieChart.tsx # Recharts Pie Chart with category legend
│   │   └── MetricSummary.tsx   # Top KPI cards (Total, Monthly, Daily Avg)
│   ├── expenses/
│   │   ├── ExpenseCard.tsx     # Card view item for mobile/tablet
│   │   ├── ExpenseFormModal.tsx# Add / Edit Expense modal dialog
│   │   ├── ExpenseList.tsx     # Dynamic switcher between Table & Card views
│   │   ├── ExpenseTable.tsx    # Desktop data table
│   │   └── FilterBar.tsx       # Search, category dropdown, date range picker
│   ├── layout/
│   │   ├── Navbar.tsx          # App header & branding
│   │   └── Footer.tsx          # Clean footer with attribution
│   └── ui/                     # Primitive reusable UI components
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── ConfirmDialog.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       └── Toast.tsx
├── lib/
│   ├── db.ts                   # Cached Mongoose connection helper
│   ├── models/
│   │   └── Expense.ts          # Mongoose model and TypeScript interface
│   ├── redux/
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   ├── provider.tsx        # Client Component Redux Provider wrapper
│   │   ├── store.ts            # Redux Toolkit store setup
│   │   └── slices/
│   │       └── expenseSlice.ts # Slice for state, reducers, and async thunks
│   └── utils/
│       ├── formatters.ts       # Currency and number formatting
│       └── categories.ts       # Category definitions, badges, icons, and colors
├── public/                     # Static assets & icons
├── .env.example                # Template for environment variables
├── .env.local                  # Local environment configuration (gitignored)
├── Initial Task For Students.pdf # Original student assignment specification
├── package.json
├── PRD.md                      # Comprehensive Product Requirements Document
├── PROJECT_CONTEXT.md          # This context engineering document
├── README.md                   # Full installation, setup, and usage documentation
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. Database & API Contract Guidelines

### 4.1 Mongoose Serverless Connection Pattern
In Next.js serverless functions, Mongoose connections must be cached globally to avoid opening new connections on every invocation:

```typescript
// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

### 4.2 Standard API Response Envelope
All API routes (`/api/expenses/*`) must return JSON adhering to this shape:

```typescript
// Success Response:
{
  "success": true,
  "data": T,
  "count"?: number,
  "summary"?: { "totalAmount": number },
  "message"?: string
}

// Error Response:
{
  "success": false,
  "error": string,
  "details"?: any
}
```

---

## 5. Multi-Role Collaboration Framework (Developer, UI/UX, QA)

To guarantee high engineering standards, clean architecture, and an optimal learning experience, every feature is designed and evaluated through three distinct roles:

### 5.1 👨‍💻 Full-Stack Developer Role ("The Architect & Educator")
- **Clean, Educational Code**: Code is written not just to run, but to be studied. Every major architectural decision, interface, Redux thunk, and database query includes clear, concise inline comments explaining *what* it does and *why* it was designed that way.
- **Type Safety & Predictability**: 100% TypeScript coverage without escape hatches (`any`). Explicit return types on functions and API handlers.
- **Serverless-Safe Patterns**: Mongoose connection caching, singleton instances, proper error bubbling, and environment validation.
- **Learning Takeaway**: A learner inspecting any file can understand industry-standard full-stack patterns (Next.js App Router, RTK, MongoDB).

### 5.2 🎨 UI/UX Designer Role ("The Experience Crafter")
- **Visual Excellence**: Modern aesthetic featuring glassmorphism cards, subtle borders, high-contrast typography, and curated color palettes (emerald for Food, sky for Transport, etc.).
- **Responsive Ergonomics**: Mobile-first design that seamlessly transforms from card stacks with touch-friendly buttons on mobile (`<640px`) to full tabular views on desktop (`>1024px`).
- **Interactive Feedback**: Micro-animations on hover/click, loading shimmer skeletons, accessible modal backdrops with smooth transitions, and instant toast notifications.
- **Accessibility (a11y)**: Semantic HTML5, explicit `aria-label` tags, WCAG AA color contrast, and keyboard navigation support (`Escape` to close modals, `Tab` order).

### 5.3 🛡️ QA & Test Engineer Role ("The Quality Gatekeeper")
- **Edge Case Verification**: Rigorous validation against boundaries:
  - Form validation: zero or negative amounts (`amount <= 0`), excessive character counts (`title > 100`), empty inputs, invalid date strings.
  - Negative states: database offline, network timeouts, invalid MongoDB ObjectIds.
  - Empty states: welcoming, illustrated empty state with direct call-to-action when no expenses exist.
- **Data Integrity**: Ensuring that filtered calculations (Total, Monthly, Daily Average, Category Pie Chart percentages) mathematically sum accurately with zero floating-point rounding errors.
- **Cross-Device Testing**: Verifying layout stability on mobile (iPhone/Android viewports), tablet (iPad), and desktop displays.

---

## 6. Pedagogical Clean Code Guidelines (Learn & Master)

To ensure this codebase serves as a gold-standard masterclass for learning full-stack development:
1. **Self-Documenting Structure**: Meaningful, self-explanatory variable and function names (e.g., `calculateCategoryBreakdown` rather than `getCatData`).
2. **"Why Before What" Comments**: Inline comments explain architectural trade-offs (e.g., why Redux slice uses extraReducers for async thunks, or why Mongoose connections must be cached globally).
3. **Consistent Error Handling Envelope**: Every API route returns a predictable `{ success: boolean, data?: T, error?: string }` shape for easy client parsing.
4. **Modularity**: Small, single-responsibility files (max ~150-200 lines per component) to keep cognitive load low and maintainability high.

---

## 7. Execution Milestones & Git Strategy

To meet the requirement of **at least 10 meaningful Git commits**, development follows this precise sequence:

- **Commit 1**: `chore: project setup with Next.js 14/15, TypeScript, Tailwind CSS, and dependencies`
- **Commit 2**: `docs: add comprehensive PRD, project context, and multi-role task workflow`
- **Commit 3**: `feat(db): implement cached MongoDB connection helper and Mongoose Expense model`
- **Commit 4**: `feat(api): build RESTful API route handlers for CRUD operations and summary aggregation`
- **Commit 5**: `feat(state): set up Redux Toolkit store, expense slice, and async thunks`
- **Commit 6**: `feat(ui): create core UI components (Button, Modal, Input, Badge, ConfirmDialog)`
- **Commit 7**: `feat(form): develop Add/Edit Expense modal form with validation and datepicker`
- **Commit 8**: `feat(list): implement responsive Expense List with Table and Card views`
- **Commit 9**: `feat(analytics): build KPI metric summary cards and Recharts category pie chart`
- **Commit 10**: `feat(filter): implement category filter, date-range presets, and real-time search`
- **Commit 11**: `feat(ux): add toast notifications, loading skeletons, and empty state illustrations`
- **Commit 12**: `docs: write complete README with setup instructions and Vercel deployment guide`

> **REMINDER**: All commits are strictly local (`git commit`). Do not run `git push` unless explicitly requested.

---

## 8. Environment Variables Required

Create `.env.local` based on `.env.example`:
```env
# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/daily-expense-noted?retryWrites=true&w=majority

# Application Base URL (for local development and production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
