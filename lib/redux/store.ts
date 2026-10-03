/**
 * Redux Store Configuration
 * 
 * Configures the root Redux store with typed dispatch and state contracts.
 */

import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './slices/expenseSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      expenses: expenseReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Allows clean handling of date instances
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
