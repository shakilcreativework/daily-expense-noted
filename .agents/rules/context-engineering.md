# Workspace Rule: Daily Expense Tracker Context Engineering

## Crucial Operational Constraints
- **NO AUTO-COMMIT & NO AUTO-PUSH TO GITHUB**: Do NOT run `git commit` or `git push` automatically. The user will manually review, stage, commit, and push all code.
- **Git Commit Suggestions**: After completing each milestone or phase, suggest the exact Conventional Commit message and copy-pasteable command for the user to execute manually.
- **Git Commit Target**: Maintain a clean, atomic commit history with at least 10 meaningful commits reflecting iterative milestones.

## Architecture & Conventions
- **Stack**: Next.js 14+ (App Router), TypeScript (`strict`), Redux Toolkit, Mongoose/MongoDB, Tailwind CSS, Recharts.
- **Database**: Use cached singleton pattern for Mongoose in serverless Next.js (`lib/db.ts`).
- **State Management**: Redux Toolkit slices with typed hooks (`useAppDispatch`, `useAppSelector`).
- **UI/UX**: Responsive across mobile, tablet, and desktop. Use clean card layouts on mobile and full data tables on desktop.
- **Bonus Capabilities**: Category filtering, date range picker, real-time search, Recharts category breakdown pie chart.
- **Documentation**: Keep [PRD.md](file:///c:/Projects/daily-expense-noted/PRD.md) and [PROJECT_CONTEXT.md](file:///c:/Projects/daily-expense-noted/PROJECT_CONTEXT.md) up to date.
