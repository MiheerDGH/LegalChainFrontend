import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">LEGAL CHAIN</h2>
          <p className="text-gray-400 text-sm">
            AI-powered legal docs, fast, accurate, accessible. Smarter contracts for a smarter future.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-300">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            {['Home', 'Services', 'About', 'FAQ', 'Investors', 'Careers', 'Contact'].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-yellow-400 transition">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-300">Contact</h3>
          <p className="text-sm text-gray-300">Email: hello@legalchain.com</p>
          <p className="text-sm text-gray-300">Phone: +1 (800) 123-4567</p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Legal Chain. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
