import React from 'react';
import ContractBuilder from '../components/ContractBuilder';
import Head from 'next/head';

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
