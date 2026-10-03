# 💸 DailyExpense Noted — Modern Full-Stack Daily Expense Tracker

A full-stack, responsive personal finance and daily expense tracking web application built with **Next.js (App Router)**, **TypeScript**, **Redux Toolkit**, **Mongoose (MongoDB)**, and **Tailwind CSS**.

---

## ✨ Features

- 📝 **Frictionless Expense Logging**: Add, edit, and delete transactions with instant feedback and optimistic UI updates.
- 🏷️ **Category Management**: Predefined categories (`Food & Dining`, `Transportation`, `Shopping`, `Bills & Utilities`, `Entertainment`, `Health`, `Education`, `Others`) with custom color tokens and Lucide icons.
- 📊 **Real-Time Financial Analytics**: Interactive **Recharts** category pie/donut chart and KPI cards (Total Outflow, This Month, Daily Average, Today).
- 🔍 **Dynamic Filtering & Search**: Instant debounce search by title/notes, category filter pills, and quick date presets (*Today*, *This Week*, *This Month*, *All Time*).
- 📱 **Dual Responsive Layout**: Desktop data table and mobile card layout with view switcher (*Auto*, *Table*, *Cards*).
- 🔔 **Interactive Feedback**: Accessible confirmation dialogs for deletions, shimmer loading skeletons, and animated toast notifications.
- ⚡ **Zero Cold-Start Serverless DB**: Global cached connection singleton prevents MongoDB connection pool exhaustion on serverless environments like Vercel.

---

## 🛠️ Technology Stack (Latest Ecosystem)

| Layer | Technology | Key Highlights |
|---|---|---|
| **Framework** | **Next.js 16 (App Router)** | Turbopack compilation engine, Async Request APIs, uncached-by-default Route Handlers |
| **UI Library** | **React 19** | Concurrent rendering, native actions, client/server component separation |
| **Language** | **TypeScript 5** | 100% strict type safety across database schemas, Redux slices, and UI props |
| **Global State** | **Redux Toolkit 2.x** | Predictable state flow with `createAsyncThunk`, Immer immutability, and typed hooks |
| **Database & ODM** | **MongoDB + Mongoose 9.x** | Schema-level validation, compound indexing (`{ date: -1, category: 1 }`), connection pooling |
| **Styling** | **Tailwind CSS v4** | Modern Rust Oxide engine, CSS `@theme` design tokens, glassmorphism utilities |
| **Charts** | **Recharts 3.x** | Pure SVG declarative charts with customized animated tooltips |
| **Icons** | **Lucide React** | Crisp, scalable vector icons |

---

## 🏗️ Architecture & Data Flow

```text
User Interaction (Client UI)
       │
       ▼
Redux Toolkit Store (expenseSlice)
       │
       ▼ (AsyncThunk HTTP Dispatch)
Next.js API Route Handlers (/api/expenses/*)
       │
       ▼
Mongoose Singleton Connection Pool (lib/db.ts)
       │
       ▼
MongoDB Atlas Cloud Database
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18.18+ or v20+
- [npm](https://www.npmjs.com/) v9+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) database connection URI (or local MongoDB)

### Step 1: Clone or Navigate to the Workspace
```bash
git clone <your-repo-url>
cd daily-expense-noted
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/daily-expense-noted?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `daily-expense-noted` repository.
4. In **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas production connection string.
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`).
5. Click **Deploy**. Vercel will build and launch your application globally!

---

## 📚 Learning & Educational Takeaways

This project was engineered following clean, senior architectural patterns:
1. **Serverless Connection Caching (`lib/db.ts`)**: Avoids spawning a new MongoDB connection on every request by persisting the connection promise on Node's `global` object.
2. **Predictable REST API Envelopes**: All route handlers return `{ success: true, data: ... }` or `{ success: false, error: ... }`.
3. **Optimistic UI Updates with Redux**: When an expense is created or edited, the Redux store updates immediately for instant visual gratification.
4. **Accessible Micro-Interactions**: Modals support keyboard `Escape` dismiss, aria tags, focus trapping, and body scroll lock.

---

## 📄 License
MIT License. Open for educational and personal use.
