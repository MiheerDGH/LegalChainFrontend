import React from 'react';
import HeroHeader from '@/components/ui/HeroHeader';
import PracticeAreas from '@/components/ui/PracticeAreas';
import WhyLegalChain from '@/components/ui/WhyLegalChain';
import Footer from '@/components/ui/Footer';


export default function HomePage() {
  return (
    <main className="bg-[#111] text-white font-sans min-h-screen">
      {/* Header */}
      <HeroHeader />

      {/* Hero Section */}
      <section
        className="relative text-center px-6 py-28 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/library.jpg')" }} // Ensure this exists in public/images
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>
        <div className="relative z-10">
          <p className="text-yellow-400 mb-3 uppercase tracking-wide text-sm">
            Committed to Helping Our Clients Succeed
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Smarter Contracts, Smarter Future
          </h2>
          <p className="max-w-4xl mx-auto text-lg text-gray-300">
            Legal Chain is revolutionizing the legal landscape by democratizing law for all! We empower individuals, freelancers, SMBs, law firms, enterprise users, and everyone in between with accessible and efficient legal solutions. Legal Chain delivers smarter contracts for a smarter future, providing advanced legal document solutions quickly and accurately. Our platform harnesses a proprietary, multimodal cutting-edge AI technology for swift document processing, while our user-friendly interface enhances access to legally binding document creation to meet diverse personal and business needs. Offering a broad selection of AI-driven legal products, Legal Chain is your trusted companion in navigating the complexities of the legal world.
          </p>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-10 text-yellow-400">Our Practice Areas</h3>
        <PracticeAreas />
      </section>

      {/* Why Legal Chain */}
      <WhyLegalChain />

      {/* Footer */}
      <Footer />
    </main>
  );
}
