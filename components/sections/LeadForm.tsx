'use client';

import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface LeadFormProps {
  title: string;
  description: string;
  primaryColor?: string;
  inquiryOptions?: string[];
  submitLabel?: string;
  phone?: string;
  email?: string;
  address?: string;
  tenantSlug?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({ 
  title = "Get in Touch", 
  description = "Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.", 
  primaryColor = "#8b5cf6",
  inquiryOptions = ["Property Inquiry", "Investment Opportunity", "General Question"],
  submitLabel = "Send Message",
  phone = "(555) 123-4567",
  email = "contact@stjoseph.com",
  address = "123 Amity Blvd, New York, NY 10001",
  tenantSlug
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interest, setInterest] = useState(inquiryOptions[0] || "General Inquiry");
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      interest: interest,
      message: formData.get('message') as string,
      date: (interest === 'Property Viewing' || interest === 'Schedule a Viewing') ? date : undefined,
      time: (interest === 'Property Viewing' || interest === 'Schedule a Viewing') ? time : undefined,
    };

    try {
      if (tenantSlug) {
        const res = await fetch(`${API_BASE_URL}/api/tenants/${tenantSlug}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.message 
            ? (Array.isArray(errData.message) ? errData.message[0] : errData.message) 
            : 'Failed to send inquiry';
          throw new Error(errMsg);
        }
      }

      toast.success((interest === 'Property Viewing' || interest === 'Schedule a Viewing') ? 'Viewing Scheduled!' : 'Message Sent Successfully', {
        description: (interest === 'Property Viewing' || interest === 'Schedule a Viewing') 
          ? `We've received your request for ${date} at ${time}. Our team will contact you to confirm.`
          : 'Our team will contact you shortly.',
        duration: 5000,
      });
      (e.target as HTMLFormElement).reset();
      setDate('');
      setTime('');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logic to highlight last word
  const words = title.split(' ');
  const lastWord = words[words.length - 1];
  const firstPart = words.slice(0, -1).join(' ');

  return (
    <section id="contact" className="py-32 bg-[#0b1120] text-white px-6">
      <Toaster position="bottom-right" theme="dark" />
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
              {firstPart} <span className="text-[#8b5cf6]">{lastWord}</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 font-light leading-relaxed">
              {description}
            </p>

            <div className="space-y-6">
              {[
                { icon: Phone, label: 'Phone', value: phone },
                { icon: Mail, label: 'Email', value: email },
                { icon: MapPin, label: 'Address', value: address }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#0f172a] border border-white/5 flex items-center justify-center group-hover:border-[#8b5cf6]/30 transition-colors">
                    <item.icon className="w-6 h-6 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">{item.label}</div>
                    <div className="text-white font-semibold">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0f172a]/50 p-10 md:p-12 rounded-[40px] border border-white/5 backdrop-blur-xl shadow-2xl"
          >
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Full Name</label>
                  <input name="name" required type="text" placeholder="John Doe" className="w-full px-6 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:outline-none focus:border-[#8b5cf6]/50 transition-all text-white placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Email Address</label>
                  <input name="email" required type="email" placeholder="john@example.com" className="w-full px-6 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:outline-none focus:border-[#8b5cf6]/50 transition-all text-white placeholder:text-slate-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Property Interest</label>
                <select 
                  required 
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:outline-none focus:border-[#8b5cf6]/50 transition-all text-white appearance-none cursor-pointer"
                >
                  {inquiryOptions.map((option, i) => (
                    <option key={i} value={option} className="bg-slate-900">{option}</option>
                  ))}
                </select>
              </div>

              {(interest === 'Property Viewing' || interest === 'Schedule a Viewing') && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Preferred Date</label>
                    <input 
                      required 
                      type="date"
                      name="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:outline-none focus:border-[#8b5cf6]/50 transition-all text-white [color-scheme:dark]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Preferred Time</label>
                    <input 
                      required 
                      type="time"
                      name="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:outline-none focus:border-[#8b5cf6]/50 transition-all text-white [color-scheme:dark]" 
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Message</label>
                <textarea name="message" required rows={4} placeholder="Tell us about your real estate needs..." className="w-full px-6 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:outline-none focus:border-[#8b5cf6]/50 transition-all text-white resize-none placeholder:text-slate-600"></textarea>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-[#8b5cf6] text-zinc-950 font-black rounded-xl hover:bg-[#7c3aed] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#8b5cf6]/10 group"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    {submitLabel}
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

