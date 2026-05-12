'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryColor?: string;
  ctaLabel?: string;
  featuredProperty?: {
    name: string;
    price: string;
    image?: string;
  };
}

export const Hero: React.FC<HeroProps> = ({ 
  title = "Find Your Dream Home", 
  subtitle = "Discover premium properties and investment opportunities with our expert real estate solutions.", 
  backgroundImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", 
  primaryColor = "#8b5cf6",
  ctaLabel = "Browse Listings",
  featuredProperty
}) => {
  const scrollToForm = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Logic to highlight last two words
  const words = title.split(' ');
  const lastTwo = words.length >= 2 ? words.slice(-2).join(' ') : words.join(' ');
  const mainTitle = words.length >= 2 ? words.slice(0, -2).join(' ') : '';

  return (
    <section id="about" className="relative min-h-[90vh] flex items-center bg-[#0b1120] text-white pt-20 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full z-0" />
      
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
            {mainTitle}{' '}
            <span className="text-[#8b5cf6]">{lastTwo}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light">
            {subtitle}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-16">
            <button 
              onClick={scrollToForm}
              className="px-8 py-4 bg-[#8b5cf6] text-zinc-950 font-bold rounded-xl flex items-center gap-2 hover:bg-[#7c3aed] transition-all group"
            >
              {ctaLabel}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={scrollToForm}
              className="px-8 py-4 bg-transparent border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Schedule Consultation
            </button>
          </div>
          

        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="rounded-[40px] overflow-hidden shadow-2xl border border-white/5 aspect-[4/3] relative group">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={backgroundImage} 
              alt="Luxury Home" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
          </div>
          
          {/* Floating Badge */}
          {featuredProperty && (
            <div className="absolute -bottom-6 -left-6 bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl max-w-xs animate-fade-up">
              <div className="text-[#8b5cf6] text-xs font-bold uppercase tracking-widest mb-2">Featured Property</div>
              <div className="text-xl font-bold text-white mb-2 leading-tight">{featuredProperty.name || 'Modern Downtown Penthouse'}</div>
              <div className="text-2xl font-black text-[#8b5cf6]">{featuredProperty.price || 'Ask for Price'}</div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

