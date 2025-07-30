import React from 'react';
import Link from 'next/link';

export default function HeroHeader() {
  return (
    <header className="bg-gradient-to-r from-white via-sky-100 to-indigo-200 text-slate-900 px-6 py-6 md:py-8 shadow-md backdrop-blur-md rounded-b-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand Identity */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-red bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 drop-shadow-md tracking-wide uppercase">
            Legal Chain
          </h1>
          <p className="text-base text-slate-700 mt-2 italic">
            AI-powered legal docs — <span className="text-indigo-600 font-semibold">fast. accurate. accessible.</span>
          </p>
        </div>
      </div>
    </header>
  );
}
