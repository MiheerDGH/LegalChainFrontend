// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

// Auth wrapper to gate pages
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [isLoading, session]);

  if (isLoading || !session) return null; // Prevent content flash

  return <>{children}</>;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </SessionContextProvider>
  );
}
