import React from 'react';
import Link from 'next/link';

const navItems = [
  'Home',
  'Services',
  'About',
  'FAQ',
  'Investors',
  'Beta',
  'Careers',
  'Blog',
  'Contact',
];

export default function HeroHeader() {
  return (
    <header className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white px-6 py-6 md:py-8 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand Identity */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-yellow-400 tracking-wider uppercase">
            Legal Chain
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            AI-powered legal docs — fast. accurate. accessible.
          </p>
        </div>

        {/* Navigation */}
        <nav className="md:mt-0">
          <ul className="flex flex-wrap justify-center md:justify-end gap-5 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item}>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-yellow-400 transition duration-200 ease-in-out"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
