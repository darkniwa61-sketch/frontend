'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryColor?: string;
  ctaLabel?: string;
}

export const Hero: React.FC<HeroProps> = ({ 
  title = "St. Joseph Amity", 
  subtitle = "Building the Future with Faith and Integrity.", 
  backgroundImage = "https://images.unsplash.com/photo-1541888941259-79974dfb9602?q=80&w=2070&auto=format&fit=crop", 
  primaryColor,
  ctaLabel = "Request a Quote"
}) => {
  const scrollToForm = () => {
    const form = document.querySelector('form');
    form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden bg-zinc-900">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {/* Sophisticated Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-zinc-950 via-zinc-900/60 to-transparent" />
      <div className="absolute inset-0 z-10 bg-black/10" />
      
      <div className="relative z-20 text-center max-w-5xl px-6">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter text-brand-primary drop-shadow-2xl">
            {title}
          </h1>
          <p className="text-xl md:text-3xl font-light opacity-90 leading-relaxed max-w-2xl mx-auto drop-shadow-md mb-12">
            {subtitle}
          </p>
          
          <button 
            onClick={scrollToForm}
            className="px-10 py-5 bg-brand-primary text-brand-primary-fg font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(var(--brand-primary),0.3)] hover:scale-105 active:scale-95 transition-all text-sm md:text-base border border-white/10"
          >
            {ctaLabel}
          </button>
          
          <div className="mt-16 h-1 w-32 mx-auto bg-brand-primary/20 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};
