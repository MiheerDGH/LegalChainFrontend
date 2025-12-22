import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-slate-800 py-12 px-6 mt-20 shadow-inner relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      
        {/* Contact + Social Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-sky-600">Contact</h3>
          <p className="text-sm text-slate-700 mb-1">Email: hello@legalchain.com</p>
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
