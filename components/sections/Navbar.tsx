'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Building2 } from 'lucide-react';

interface NavbarProps {
  name: string;
  logoUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ name, logoUrl }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { name: 'Listings', id: 'listings' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-white/5 py-4 px-6">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setIsMenuOpen(false);
        }}>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
          ) : (
            <div className="w-10 h-10 bg-[#8b5cf6] rounded-lg flex items-center justify-center font-bold text-zinc-950">
              <Building2 className="w-6 h-6" />
            </div>
          )}
          <h1 className="text-xl font-bold text-white tracking-tight truncate max-w-[150px] md:max-w-none">{name}</h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={(e) => scrollToSection(e, link.id)} 
              className="hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={(e) => scrollToSection(e as any, 'contact')}
            className="bg-[#8b5cf6] text-zinc-950 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#7c3aed] transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={(e) => scrollToSection(e as any, 'contact')}
            className="bg-[#8b5cf6] text-zinc-950 px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#7c3aed] transition-colors"
          >
            Contact
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[#0b1120] border-t border-white/5"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={`#${link.id}`} 
                  onClick={(e) => scrollToSection(e, link.id)} 
                  className="text-lg font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
