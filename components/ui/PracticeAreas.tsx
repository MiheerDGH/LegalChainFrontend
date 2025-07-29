import React from 'react';
import Link from 'next/link';
import {
  FaFileContract,
  FaPenNib,
  FaFileAlt,
  FaFolderOpen,
  FaRegEnvelope,
  FaFileCode,
  FaBalanceScale,
  FaLanguage,
} from 'react-icons/fa';

const areas = [
  { icon: <FaFileContract size={32} />, title: 'NDA Creation', desc: 'Secure Your Confidential Info with NDA.' },
  { icon: <FaPenNib size={32} />, title: 'Contract Creation', desc: 'Craft Airtight Contracts for Peace of Mind.' },
  { icon: <FaFileAlt size={32} />, title: 'Document Analysis', desc: 'Expert Document Review: Understand the Law.' },
  { icon: <FaFolderOpen size={32} />, title: 'Document Management', desc: 'Organize, Secure, and Retrieve Documents.' },
  { icon: <FaRegEnvelope size={32} />, title: 'Document Summary', desc: 'Save Time with Accurate Document Summaries.' },
  { icon: <FaFileCode size={32} />, title: 'Document Comparison', desc: 'Ensure Data Consistency and Accuracy.' },
  { icon: <FaBalanceScale size={32} />, title: 'Legal Review', desc: 'Comprehensive Legal Analysis, Identify and Mitigate Legal Risks.' },
  { icon: <FaLanguage size={32} />, title: 'Translation', desc: 'Professional and Accurate Translation Services.' },
];

export default function PracticeAreas() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {areas.map((area, idx) => (
        <div
          key={idx}
          className="bg-white shadow-lg rounded-xl p-6 transition duration-300 hover:shadow-xl text-gray-800"
        >
          {/* Icon container */}
          
          <div className="flex items-center justify-start mb-6 text-yellow-400">
            {area.title === 'NDA Creation' ? (
              <Link
                href="/features/nda"
                aria-label={`Go to ${area.title}`}
                className="focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {area.icon}
              </Link>
            ) : area.title === 'Contract Creation' ? (
              <Link
                href="/contract"
                aria-label={`Go to ${area.title}`}
                className="focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {area.icon}
              </Link>
            ) : area.title === 'Document Analysis' ? (
              <Link
                href="/dashboard"
                aria-label={`Go to ${area.title}`}
                className="focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {area.icon}
              </Link>
            ) : area.title === 'Document Management' ? (
              <Link
                href="/features/management"
                aria-label={`Go to ${area.title}`}
                className="focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {area.icon}
              </Link>
            ) : area.title === 'Document Summary' ?(
              <>
                <Link
                  href="/features/summary"
                  aria-label={`Go to ${area.title}`}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {area.icon}
                </Link>

              </>
            ) : area.title === 'Document Comparison' ? (
              <Link
                href="/features/comparison"
                aria-label={`Go to ${area.title}`}
                className="focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {area.icon}
              </Link>
            ) : area.title === 'Legal Review' ? (
              <Link
                href="/features/legal-review"
                aria-label={`Go to ${area.title}`}
                className="focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {area.icon}   
              </Link>
            ) : area.title === 'Translation' ? (
              <Link
                href="/features/translation"
                aria-label={`Go to ${area.title}`}
                className="focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {area.icon}   
              </Link>
            ) : (
              <span className="text-gray-400">{area.icon}</span>
            )}

          </div>

          {/* Title */}
          <h4 className="font-bold uppercase mb-3">{area.title}</h4>

          {/* Description */}
          <p className="text-gray-600 mb-4">{area.desc}</p>

          {/* CTA */}
          <span
            className="text-blue-600 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            aria-label={`Learn more about ${area.title}`}
          >
            Read More
          </span>
        </div>
      ))}
    </div>
  );
}
