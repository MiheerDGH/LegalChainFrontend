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
    <header className="bg-black bg-opacity-80 text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-yellow-400 tracking-wide">LEGAL CHAIN</h1>
        <p className="text-sm text-gray-300">AI-powered legal docs, fast, accurate, accessible.</p>
      </div>

      <nav className="mt-4 md:mt-0">
        <ul className="flex flex-wrap justify-center md:justify-end gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item}>
              <Link href="/" className="hover:text-yellow-400 transition-colors duration-200">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
