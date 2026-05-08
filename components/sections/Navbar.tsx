'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
  name: string;
  logoUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ name, logoUrl }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-white/5 py-4 px-6">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
          ) : (
            <div className="w-10 h-10 bg-[#8b5cf6] rounded-lg flex items-center justify-center font-bold text-zinc-950">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          <h1 className="text-xl font-bold text-white tracking-tight">{name}</h1>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-white transition-colors">Listings</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Testimonials</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div>
          <button className="bg-[#8b5cf6] text-zinc-950 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#7c3aed] transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};
