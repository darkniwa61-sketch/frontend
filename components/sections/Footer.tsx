'use client';

import React from 'react';

interface FooterProps {
  name: string;
  logoUrl?: string | null;
  socialLinks?: any;
}

export const Footer: React.FC<FooterProps> = ({ name, logoUrl, socialLinks }) => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const facebookUrl = socialLinks?.facebook || 'https://facebook.com';
  const linkedinUrl = socialLinks?.linkedin || 'https://linkedin.com';

  return (
    <footer className="bg-[#0b1120] py-24 px-6 border-t border-white/5">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 bg-[#8b5cf6] rounded-lg flex items-center justify-center font-bold text-zinc-950">SJ</div>
              )}
              <h4 className="text-xl font-bold text-white tracking-tight">{name}</h4>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Your trusted partner in finding premium real estate solutions.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">Quick Links</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#listings" onClick={(e) => scrollToSection(e, 'listings')} className="hover:text-[#8b5cf6] transition-colors">Listings</a></li>
              <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-[#8b5cf6] transition-colors">About Us</a></li>
              <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-[#8b5cf6] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">Services</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#listings" onClick={(e) => scrollToSection(e, 'listings')} className="hover:text-[#8b5cf6] transition-colors">Property Search</a></li>
              <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-[#8b5cf6] transition-colors">Investment Advisory</a></li>
              <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-[#8b5cf6] transition-colors">Property Management</a></li>
              <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-[#8b5cf6] transition-colors">Valuation</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">Follow Us</h5>
            <div className="flex gap-4">
               <a 
                 href={facebookUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#8b5cf6] hover:text-zinc-950 transition-all cursor-pointer"
               >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               </a>
               {socialLinks?.twitter && (
                 <a 
                   href={socialLinks.twitter} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#8b5cf6] hover:text-zinc-950 transition-all cursor-pointer"
                 >
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                 </a>
               )}
               <a 
                 href={linkedinUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#8b5cf6] hover:text-zinc-950 transition-all cursor-pointer"
               >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
               </a>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
          © 2026 {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
