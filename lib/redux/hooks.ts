/**
 * Typed Redux Hooks
 * 
 * WHY USE THESE INSTEAD OF PLAIN useDispatch AND useSelector:
 * Plain `useDispatch` and `useSelector` from `react-redux` are untyped by default,
 * forcing you to write `useSelector((state: RootState) => ...)` everywhere.
 * 
 * These pre-typed custom hooks guarantee 100% strict TypeScript type inference
 * throughout all React components.
 */

import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
