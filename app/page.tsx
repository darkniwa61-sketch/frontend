import { ArrowRight, LayoutDashboard, Globe, ServerCrash } from 'lucide-react';
import Link from 'next/link';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
}

import { API_BASE_URL } from '@/lib/api';

async function getTenants(): Promise<Tenant[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tenants`, { 
      next: { revalidate: 0 },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!res.ok) {
      console.error('Failed to fetch tenants, status:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch tenants:', error);
    return [];
  }
}

export default async function CMSDirectory() {
  const tenants = await getTenants();

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand-primary/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black opacity-80" />
      <div className="fixed inset-0 z-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32 flex flex-col min-h-screen">
        {/* Header */}
        <header className="mb-20 flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-zinc-900 rounded-3xl border border-zinc-800/50 shadow-2xl mb-4">
            <LayoutDashboard className="w-10 h-10 text-zinc-100" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
            Tenant Directory
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl">
            Select a configured tenant below to view their customized landing page. Each tenant runs on isolated subdomain routing.
          </p>
        </header>

        {/* State: No Tenants */}
        {tenants.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 space-y-6 py-12">
            <div className="p-6 bg-red-950/20 rounded-full border border-red-900/30">
              <ServerCrash className="w-12 h-12 text-red-500/80" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-200">No Tenants Available</h2>
            <p className="text-zinc-500 text-center max-w-md">
              We couldn&apos;t fetch any tenants. Please ensure the backend server is running on port 4000 and the database is seeded.
            </p>
          </div>
        )}

        {/* State: Grid of Tenants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tenants.map((tenant) => (
            <div 
              key={tenant.id}
              className="group relative flex flex-col p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-500 overflow-hidden"
              style={{
                '--hover-color': tenant.primaryColor,
              } as React.CSSProperties}
            >
              {/* Dynamic Hover Glow based on Primary Color */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: tenant.primaryColor }}
              />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                    style={{ background: `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.secondaryColor})` }}
                  >
                    <span className="text-white font-bold text-xl tracking-tighter">
                      {tenant.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <Globe className="w-6 h-6 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>

                <div className="flex flex-col space-y-2 mt-auto">
                  <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text transition-colors duration-300"
                      style={{ backgroundImage: `linear-gradient(to right, #fff, #ccc)` }}>
                    {tenant.name}
                  </h3>
                  <div className="flex items-center text-sm font-mono text-zinc-500">
                    <span>/tenants/{tenant.slug}</span>
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <Link 
                    href={`/tenants/${tenant.slug}`}
                    className="flex items-center text-sm font-medium tracking-wide text-zinc-400 hover:text-white transition-colors duration-300"
                  >
                    <span className="mr-2">Visit site</span>
                    <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-2" />
                  </Link>
                  <Link 
                    href={`/admin/${tenant.slug}`}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors z-20 border border-zinc-700"
                  >
                    Edit Tenant
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
