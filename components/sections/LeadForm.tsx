import React from 'react';

interface LeadFormProps {
  title: string;
  description: string;
  primaryColor?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({ title, description, primaryColor }) => {
  return (
    <section className="py-24 bg-zinc-900 text-white px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
          <p className="text-xl text-zinc-400 leading-relaxed font-light">{description}</p>
        </div>
        <div className="flex-1 w-full bg-white text-zinc-900 p-10 rounded-3xl shadow-2xl relative">
          <div className="absolute top-0 right-10 h-1 w-20 bg-brand-primary" />
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-zinc-400 mb-2">Full Name</label>
              <input type="text" className="w-full px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-zinc-400 mb-2">Email Address</label>
              <input type="email" className="w-full px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-zinc-400 mb-2">How can we help?</label>
              <textarea rows={4} className="w-full px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"></textarea>
            </div>
            <button className="w-full py-5 rounded-xl font-black text-lg uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-100 shadow-lg bg-brand-primary">
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
