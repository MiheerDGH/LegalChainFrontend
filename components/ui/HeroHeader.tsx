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

        {/* Navigation */}
        <nav className="md:mt-0">
          <ul className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3 text-sm font-medium">
            <li><Link href="/"><span className="inline-block px-3 py-1 text-slate-700 hover:text-indigo-600 rounded hover:bg-indigo-100 transition duration-200 ease-in-out">Home</span></Link></li>
            <li><Link href="/services"><span className="inline-block px-3 py-1 text-slate-700 hover:text-indigo-600 rounded hover:bg-indigo-100 transition duration-200 ease-in-out">Services</span></Link></li>
            <li><Link href="/about"><span className="inline-block px-3 py-1 text-slate-700 hover:text-indigo-600 rounded hover:bg-indigo-100 transition duration-200 ease-in-out">About</span></Link></li>
            <li><Link href="/faq"><span className="inline-block px-3 py-1 text-slate-700 hover:text-indigo-600 rounded hover:bg-indigo-100 transition duration-200 ease-in-out">FAQ</span></Link></li>
            <li><Link href="/investors"><span className="inline-block px-3 py-1 text-slate-700 hover:text-indigo-600 rounded hover:bg-indigo-100 transition duration-200 ease-in-out">Investors</span></Link></li>
            <li><Link href="/beta"><span className="inline-block px-3 py-1 text-slate-700 hover:text-indigo-600 rounded hover:bg-indigo-100 transition duration-200 ease-in-out">Beta</span></Link></li>
            <li><Link href="/careers"><span className="inline-block px-3 py-1 text-slate-700 hover:text-indigo-600 rounded hover:bg-indigo-100 transition duration-200 ease-in-out">Careers</span></Link></li>
            <li><Link href="/blog"><span className="inline-block px-3 py-1 text-slate-700 hover:text-indigo-600 rounded hover:bg-indigo-100 transition duration-200 ease-in-out">Blog</span></Link></li>
            <li><Link href="/contact"><span className="inline-block px-3 py-1 text-slate-700 hover:text-indigo-600 rounded hover:bg-indigo-100 transition duration-200 ease-in-out">Contact</span></Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
