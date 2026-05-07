'use client';

import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';

interface LeadFormProps {
  title: string;
  description: string;
  primaryColor?: string;
  inquiryOptions?: string[];
}

export const LeadForm: React.FC<LeadFormProps> = ({ 
  title, 
  description, 
  primaryColor,
  inquiryOptions = ["General Inquiry", "Business Opportunity"]
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Inquiry Sent Successfully', {
        description: 'Our team will contact you shortly to process your request.',
        duration: 5000,
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section className="py-24 bg-zinc-950 text-white px-6">
      <Toaster position="bottom-right" theme="dark" />
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 opacity-0 animate-fade-up">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter">{title}</h2>
          <p className="text-xl text-zinc-400 leading-relaxed font-light">{description}</p>
          <div className="mt-12 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
            <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold mb-2">Our Promise</p>
            <p className="text-zinc-300">Strictly lead-generation based. No automated transactions or checkout. Personalized service for every client.</p>
          </div>
        </div>
        
        <div className="flex-1 w-full bg-white text-zinc-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 right-10 h-1.5 w-32 bg-brand-primary rounded-b-full shadow-[0_0_20px_rgba(var(--brand-primary),0.5)]" />
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 ml-1">Full Name</label>
              <input required type="text" placeholder="John Doe" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-lg" />
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 ml-1">Email Address</label>
              <input required type="email" placeholder="john@example.com" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-lg" />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 ml-1">Inquiry Type</label>
              <select required className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-lg appearance-none cursor-pointer">
                {inquiryOptions.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 ml-1">Message</label>
              <textarea required rows={4} placeholder="Tell us about your needs..." className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-lg resize-none"></textarea>
            </div>

            <button 
              disabled={isSubmitting}
              className="group w-full py-6 rounded-2xl font-black text-lg uppercase tracking-widest text-brand-primary-fg transition-all hover:scale-[1.02] active:scale-100 shadow-xl bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? 'Sending...' : 'Request a Quote'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
