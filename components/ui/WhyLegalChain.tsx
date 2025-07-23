import React from 'react';

const features = [
  {
    number: '01',
    title: 'Cost-Effective',
    description: 'Leveraging AI, we minimize human labor, reducing audit costs by a staggering 90%.',
  },
  {
    number: '02',
    title: 'Unmatched Accuracy',
    description: 'Our AI surpasses human capabilities with a comprehensive vulnerability database and a 100-item security checklist, eliminating human error.',
  },
  {
    number: '03',
    title: 'Proactive Security',
    description: 'Our AI Engine constantly evolves, adapting to new threats and attack vectors to ensure ongoing security.',
  },
];

export default function WhyLegalChain() {
  return (
    <section
      className="relative py-24 px-6 text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/columns.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0"></div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-yellow-400">Why Legal Chain</h3>
        <div className="space-y-12">
          {features.map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-4 items-start">
              <p className="text-yellow-300 text-2xl font-bold w-12">{item.number}</p>
              <div>
                <p className="text-lg font-semibold mb-1">{item.title}</p>
                <p className="text-gray-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
