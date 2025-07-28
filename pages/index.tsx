import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSessionContext } from '@supabase/auth-helpers-react';

import HeroHeader from '@/components/ui/HeroHeader';
import PracticeAreas from '@/components/ui/PracticeAreas';
import WhyLegalChain from '@/components/ui/WhyLegalChain';
import Footer from '@/components/ui/Footer';
import Spinner from '@/components/ui/Spinner';

export default function HomePage() {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        router.push('/login');
      } else {
        setShowContent(true);
      }
    }
  }, [isLoading, session, router]);

  if (isLoading || !showContent) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-800">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <main>
        <HeroHeader />

        {/* Hero Section */}
        <section
          className="relative text-center px-6 py-28 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/library.jpg')" }}
        >
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-0"></div>
          <div className="relative z-10">
            <p className="text-yellow-400 mb-3 uppercase tracking-wide text-sm">
              Committed to Helping Our Clients Succeed
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Smarter Contracts, Smarter Future
            </h2>
            <p className="max-w-4xl mx-auto text-lg text-gray-700">
              Legal Chain is revolutionizing the legal landscape by democratizing law for all! We empower individuals, freelancers, SMBs, law firms, enterprise users, and everyone in between with accessible and efficient legal solutions.
            </p>
          </div>
        </section>

        {/* Practice Areas */}
        <section className="py-16 px-6 max-w-7xl mx-auto bg-white rounded-xl shadow-md">
          <h3 className="text-3xl font-bold text-center mb-10 text-yellow-400">Our Practice Areas</h3>
          <PracticeAreas />
        </section>

        <WhyLegalChain />
        <Footer />
      </main>
    </div>
  );
}
