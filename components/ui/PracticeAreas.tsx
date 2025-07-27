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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {areas.map((area, idx) => (
        <div
          key={idx}
          className="bg-[#1a1a1a] p-6 rounded-md shadow hover:shadow-lg transition duration-300 text-white"
        >
          <div className="text-yellow-400 mb-4">{area.icon}</div>
          <h4 className="font-bold uppercase mb-2">{area.title}</h4>
          <p className="text-gray-300 mb-2">{area.desc}</p>
          {area.title === 'Document Analysis' ? (
            <Link href="/dashboard" className="text-yellow-400 text-sm hover:underline cursor-pointer">
              Read More
            </Link>
          ) : (
            <span className="text-yellow-400 text-sm hover:underline cursor-pointer">Read More</span>
          )}
        </div>
      ))}
    </div>
  );
}
