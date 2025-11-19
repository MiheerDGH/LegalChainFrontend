import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import the ContractBuilder client-side to avoid SSR-only imports
const ContractBuilder = dynamic(() => import('../components/ContractBuilder'), { ssr: false });

export default function ContractBuilderPage() {
  return (
    <>
      <Head>
        <title>Contract Builder</title>
      </Head>
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
        <div className="w-full max-w-5xl">
          <ContractBuilder />
        </div>
      </div>
    </>
  );
}
