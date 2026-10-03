/**
 * Redux Toolkit Slice: Expense Management
 * 
 * WHY REDUX TOOLKIT (RTK) IS USED:
 * 1. Predictable, centralized state across forms, table views, mobile cards, and charts.
 * 2. `createAsyncThunk` encapsulates API lifecycle states (pending, fulfilled, rejected).
 * 3. Immer is built-in, allowing us to write direct "mutative" code that produces immutable updates.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IExpense } from '@/lib/models/Expense';

export interface FilterParams {
  category?: string;
  startDate?: string | null;
  endDate?: string | null;
  search?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'desc' | 'asc';
}

export interface CategorySummaryItem {
  category: string;
  label: string;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export interface SummaryData {
  totalAmount: number;
  currentMonthTotal: number;
  todayTotal: number;
  dailyAverage: number;
  totalTransactions: number;
}

export interface ExpenseState {
  items: IExpense[];
  totalFilteredAmount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: FilterParams;
  summary: SummaryData;
  categoryBreakdown: CategorySummaryItem[];
  isSummaryLoading: boolean;
  editingExpense: IExpense | null;
  isFormModalOpen: boolean;
}

const initialState: ExpenseState = {
  items: [],
  totalFilteredAmount: 0,
  status: 'idle',
  error: null,
  filters: {
    category: 'All',
    startDate: null,
    endDate: null,
    search: '',
    sortBy: 'date',
    sortOrder: 'desc',
  },
  summary: {
    totalAmount: 0,
    currentMonthTotal: 0,
    todayTotal: 0,
    dailyAverage: 0,
    totalTransactions: 0,
  },
  categoryBreakdown: [],
  isSummaryLoading: false,
  editingExpense: null,
  isFormModalOpen: false,
};

// -------------------------------------------------------------
// ASYNC THUNKS (API Operations)
// -------------------------------------------------------------

/**
 * Fetch expenses with active filter query parameters.
 */
export const fetchExpenses = createAsyncThunk<
  { items: IExpense[]; totalAmount: number },
  FilterParams | void
>(
  'expenses/fetchExpenses',
  async (filters, { rejectWithValue }) => {
    try {
      const activeFilters = filters || {};
      const params = new URLSearchParams();
      if (activeFilters.category && activeFilters.category !== 'All') {
        params.append('category', activeFilters.category);
      }
      if (activeFilters.startDate) params.append('startDate', activeFilters.startDate);
      if (activeFilters.endDate) params.append('endDate', activeFilters.endDate);
      if (activeFilters.search) params.append('search', activeFilters.search);
      if (activeFilters.sortBy) params.append('sortBy', activeFilters.sortBy);
      if (activeFilters.sortOrder) params.append('sortOrder', activeFilters.sortOrder);

      const response = await fetch(`/api/expenses?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.error || 'Failed to fetch expenses');
      }

      return {
        items: data.data as IExpense[],
        totalAmount: data.totalAmount as number,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch dashboard analytics summary and category breakdown.
 */
export const fetchExpenseSummary = createAsyncThunk(
  'expenses/fetchExpenseSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/expenses/summary');
      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.error || 'Failed to fetch summary');
      }

      return {
        summary: data.summary as SummaryData,
        categoryBreakdown: data.categoryBreakdown as CategorySummaryItem[],
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create a new expense.
 */
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData: Partial<IExpense>, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.error || 'Failed to add expense');
      }

      // Re-fetch summary to sync charts and KPI cards
      dispatch(fetchExpenseSummary());

      return data.data as IExpense;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update an existing expense.
 */
export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async (
    { id, updates }: { id: string; updates: Partial<IExpense> },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.error || 'Failed to update expense');
      }

      dispatch(fetchExpenseSummary());
      return data.data as IExpense;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete an expense by ID.
 */
export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.error || 'Failed to delete expense');
      }

      dispatch(fetchExpenseSummary());
      return id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(message);
    }
  }
);

// -------------------------------------------------------------
// EXPENSE SLICE DEFINITION
// -------------------------------------------------------------

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // Filter controls
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setDateRangeFilter: (
      state,
      action: PayloadAction<{ startDate: string | null; endDate: string | null }>
    ) => {
      state.filters.startDate = action.payload.startDate;
      state.filters.endDate = action.payload.endDate;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setSorting: (
      state,
      action: PayloadAction<{ sortBy: 'date' | 'amount'; sortOrder: 'desc' | 'asc' }>
    ) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    // Form Modal UI controls
    openAddModal: (state) => {
      state.editingExpense = null;
      state.isFormModalOpen = true;
    },
    openEditModal: (state, action: PayloadAction<IExpense>) => {
      state.editingExpense = action.payload;
      state.isFormModalOpen = true;
    },
    closeFormModal: (state) => {
      state.editingExpense = null;
      state.isFormModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    // fetchExpenses
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalFilteredAmount = action.payload.totalAmount;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // fetchExpenseSummary
    builder
      .addCase(fetchExpenseSummary.pending, (state) => {
        state.isSummaryLoading = true;
      })
      .addCase(fetchExpenseSummary.fulfilled, (state, action) => {
        state.isSummaryLoading = false;
        state.summary = action.payload.summary;
        state.categoryBreakdown = action.payload.categoryBreakdown;
      })
      .addCase(fetchExpenseSummary.rejected, (state) => {
        state.isSummaryLoading = false;
      });

    // addExpense
    builder.addCase(addExpense.fulfilled, (state, action) => {
      // Prepend newly created expense for instant UI update
      state.items.unshift(action.payload);
      state.totalFilteredAmount += action.payload.amount;
    });

    // updateExpense
    builder.addCase(updateExpense.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item._id === action.payload._id);
      if (index !== -1) {
        state.totalFilteredAmount =
          state.totalFilteredAmount - state.items[index].amount + action.payload.amount;
        state.items[index] = action.payload;
      }
    });

    // deleteExpense
    builder.addCase(deleteExpense.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item._id === action.payload);
      if (index !== -1) {
        state.totalFilteredAmount -= state.items[index].amount;
        state.items.splice(index, 1);
      }
    });
  },
});

export const {
  setCategoryFilter,
  setDateRangeFilter,
  setSearchQuery,
  setSorting,
  resetFilters,
  openAddModal,
  openEditModal,
  closeFormModal,
} = expenseSlice.actions;

export default expenseSlice.reducer;
