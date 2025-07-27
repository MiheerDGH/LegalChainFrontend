// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

// Auth wrapper to gate protected pages
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [isLoading, session]);

  if (isLoading || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#111] text-white">
        <p className="text-sm text-gray-400">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();

  const publicRoutes = ['/', '/login', '/signup'];
  const isProtected = !publicRoutes.includes(router.pathname);

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {isProtected ? (
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionContextProvider>
  );
}
