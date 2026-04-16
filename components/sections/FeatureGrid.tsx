import React from 'react';

interface Feature {
  title: string;
  description: string;
}

interface FeatureGridProps {
  title: string;
  features: Feature[];
  secondaryColor?: string;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ title, features, secondaryColor }) => {
  return (
    <section className="py-24 bg-zinc-50 flex flex-col items-center px-6">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-zinc-900 border-b-4 pb-4 border-brand-secondary">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl w-full">
        {features.map((feature, i) => (
          <div key={i} className="bg-white p-10 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <h3 className="text-2xl font-bold mb-4 text-brand-secondary">{feature.title}</h3>
            <p className="text-zinc-600 leading-relaxed text-lg">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
