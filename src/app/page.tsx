'use client';

import dynamic from 'next/dynamic';

// Disable SSR for App component to prevent hydration mismatch
const App = dynamic(() => import('../App'), { ssr: false });

export default function Home() {
  return <App />;
}