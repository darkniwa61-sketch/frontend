import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryColor?: string;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, backgroundImage, primaryColor }) => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-black/30" />
      <div className="relative z-20 text-center max-w-4xl px-6">
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-brand-primary">
          {title}
        </h1>
        <p className="text-xl md:text-2xl font-light opacity-90 leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="mt-10 h-1 w-24 mx-auto bg-brand-primary" />
      </div>
    </section>
  );
};
