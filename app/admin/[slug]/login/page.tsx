'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tenant, setTenant] = useState<any>(null);

  useEffect(() => {
    if (slug === 'starblue' && process.env.NODE_ENV !== 'development') {
      import('next/navigation').then((mod) => mod.notFound());
      return;
    }

    // Fetch tenant data to get branding
    fetch(`${API_BASE_URL}/api/tenants/${slug}`)
      .then(res => res.json())
      .then(data => setTenant(data))
      .catch(err => console.error(err));
  }, [slug]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/tenants/${slug}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordHash: password }) // Using passwordHash as field name to match backend expectation
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem(`auth_token_${slug}`, data.token);
        toast.success('Login successful! Redirecting...', {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        });
        setTimeout(() => {
          router.push(`/admin/${slug}`);
        }, 1000);
      } else {
        toast.error(data.message || 'Invalid email or password');
      }
    } catch (err) {
      toast.error('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = tenant?.primaryColor || '#1e3a8a';
  const secondaryColor = tenant?.secondaryColor || '#3b82f6';

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[120px]" style={{ background: primaryColor }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[120px]" style={{ background: secondaryColor }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-xl" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
              {tenant?.logoUrl ? (
                <img src={tenant.logoUrl} alt="Logo" className="w-12 h-12 object-contain filter invert brightness-0" />
              ) : (
                <Building2 className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-black text-white mb-2">{tenant?.name || 'Admin Panel'}</h1>
            <p className="text-slate-400 font-medium">Secure Portal Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-600 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-white/30 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-600 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-white/30 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:scale-100"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 text-xs font-medium">
              Authorized access only. All actions are logged.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
