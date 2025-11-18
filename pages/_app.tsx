// app.tsx
import type { AppProps } from 'next/app';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import supabase from '../lib/supabaseClient'; // ✅ Import your singleton
import '../styles/globals.css';
import DevDebugPanel from '../components/DevDebugPanel';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
      {/* Render DevDebugPanel only when explicitly enabled via env var to avoid exposing raw responses in dev by default */}
      {process.env.NEXT_PUBLIC_ENABLE_DEV_DEBUG === '1' && <DevDebugPanel />}
    </SessionContextProvider>
  );
}
