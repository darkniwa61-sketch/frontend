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

export const FeatureGrid: React.FC<FeatureGridProps> = ({ 
  title = "Our Core Expertise", 
  features = [
    { title: "Smart Logistics", description: "Revolutionizing supply chains through advanced AI and automation." },
    { title: "Heavy Aggregates", description: "Premium raw materials for high-scale construction projects." },
    { title: "Fast Delivery", description: "Unmatched speed and reliability across the entire region." }
  ], 
  secondaryColor 
}) => {
  return (
    <section className="py-28 bg-white flex flex-col items-center px-6">
      <div className="text-center mb-20 animate-fade-up">
        <h2 className="text-5xl md:text-6xl font-black text-zinc-900 border-b-8 border-brand-secondary/30 inline-block pb-4">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl w-full">
        {features.map((feature, i) => (
          <div 
            key={i} 
            className="group bg-zinc-50 p-12 To: rounded-4xl border border-zinc-100 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-3 hover:border-brand-secondary"
          >
            <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-secondary group-hover:text-white transition-colors duration-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-6 text-zinc-900 group-hover:text-brand-secondary transition-colors">
              {feature.title}
            </h3>
            <p className="text-zinc-500 leading-relaxed text-lg font-light">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
