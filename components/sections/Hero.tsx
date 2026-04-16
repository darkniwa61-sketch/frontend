import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryColor?: string;
}

export const Hero: React.FC<HeroProps> = ({ 
  title = "St. Joseph Amity", 
  subtitle = "Building the Future with Faith and Integrity.", 
  backgroundImage = "https://images.unsplash.com/photo-1541888941259-79974dfb9602?q=80&w=2070&auto=format&fit=crop", 
  primaryColor 
}) => {
  return (
    <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden bg-zinc-900">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {/* Sophisticated Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-zinc-950 via-zinc-900/60 to-transparent" />
      <div className="absolute inset-0 z-10 bg-black/20" />
      
      <div className="relative z-20 text-center max-w-5xl px-6 opacity-0 animate-fade-up">
        <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter text-brand-primary drop-shadow-2xl">
          {title}
        </h1>
        <p className="text-xl md:text-3xl font-light opacity-90 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
          {subtitle}
        </p>
        <div className="mt-12 h-1.5 w-32 mx-auto bg-brand-primary rounded-full shadow-[0_0_20px_rgba(var(--brand-primary),0.5)]" />
      </div>
    </section>
  );
};
