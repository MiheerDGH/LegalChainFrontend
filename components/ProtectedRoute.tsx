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

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111] text-white">
        <p className="text-gray-400">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
