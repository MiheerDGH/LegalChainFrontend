import { useRouter } from 'next/router';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [session, isLoading, router]);

  if (!session) return <p className="p-6">Checking authentication...</p>;

  return <>{children}</>;
};

export default ProtectedRoute;
