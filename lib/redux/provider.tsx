'use client';

/**
 * Redux Client Provider Component
 * 
 * WHY THIS IS A CLIENT COMPONENT:
 * Redux uses React Context under the hood, which requires client-side hooks.
 * Next.js App Router `layout.tsx` is a Server Component by default.
 * 
 * By wrapping the Provider in this lightweight Client Component, we can keep
 * our RootLayout as a Server Component while giving all child components
 * seamless access to global Redux state!
 */

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
