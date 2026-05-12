'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

interface TestimonialsProps {
  title?: string;
  testimonials?: Testimonial[];
  primaryColor?: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ title, testimonials, primaryColor }) => {
  const defaultItems = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      text: "The team at Prestige Realty made finding our dream home an absolute breeze. Their attention to detail and market knowledge is unmatched."
    },
    {
      name: "Michael Chen",
      role: "Property Investor",
      text: "I've worked with many real estate agencies, but none compare to the professionalism and results I've experienced here."
    },
    {
      name: "Emma Davis",
      role: "First-time Buyer",
      text: "They guided me through every step of the process. I couldn't be happier with my new home and the service I received."
    }
  ];

  const displayItems = testimonials && testimonials.length > 0 ? testimonials : defaultItems;

  return (
    <section id="testimonials" className="py-32 bg-[#0b1120] text-white overflow-hidden relative">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full z-0" />
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            {title || "What Our Clients Say"}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0f172a] p-10 rounded-3xl border border-white/5 relative hover:border-[#8b5cf6]/30 transition-colors duration-500"
            >
              {/* Quote Mark */}
              <div className="absolute top-8 right-8 text-[#8b5cf6]/20">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21L16.439 14C16.439 14 15.5 14 15.5 11C15.5 8 16.5 7 19.5 7C22.5 7 23.5 9 23.5 12C23.5 15 20.461 21 20.461 21H14.017ZM3.017 21L5.439 14C5.439 14 4.5 14 4.5 11C4.5 8 5.5 7 8.5 7C11.5 7 12.5 9 12.5 12C12.5 15 9.461 21 9.461 21H3.017Z"/>
                </svg>
              </div>

              <p className="text-slate-300 leading-relaxed mb-8 relative z-10 italic">
                "{item.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold"
                  style={{ color: primaryColor || '#8b5cf6' }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold">{item.name}</h4>
                  <p className="text-slate-500 text-sm">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
