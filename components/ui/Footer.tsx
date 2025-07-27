import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-slate-800 py-12 px-6 mt-20 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-extrabold text-indigo-600 tracking-wide">
            LEGAL CHAIN
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            <span className="italic">AI-powered legal docs.</span> <br />
            <span className="text-sky-600 font-medium">Fast. Accurate. Accessible.</span><br />
            Smarter contracts for a smarter future.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-sky-600">Quick Links</h3>
          <ul className="space-y-1 text-sm text-slate-700">
            {['Home', 'Services', 'About', 'FAQ', 'Investors', 'Careers', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="inline-block transition hover:text-indigo-600 hover:underline underline-offset-2"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Social Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-sky-600">Contact</h3>
          <p className="text-sm text-slate-700 mb-1">Email: hello@legalchain.com</p>
          <p className="text-sm text-slate-700 mb-4">Phone: +1 (800) 123-4567</p>
          <div className="flex gap-4 mt-2">
            {[
              { icon: FaFacebookF, href: '#' },
              { icon: FaTwitter, href: '#' },
              { icon: FaLinkedinIn, href: '#' },
              { icon: FaInstagram, href: '#' }
            ].map(({ icon: Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="text-slate-500 hover:text-indigo-500 transition-transform transform hover:scale-110"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Legal Chain. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
