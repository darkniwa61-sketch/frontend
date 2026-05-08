import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { ProjectGrid } from '@/components/sections/ProjectGrid';
import { LeadForm } from '@/components/sections/LeadForm';
import { Navbar } from '@/components/sections/Navbar';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

async function getTenantData(slug: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/tenants/${slug}`, { 
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch tenant data:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenantData(slug);
  
  if (!tenant) return { title: 'Not Found' };

  return {
    title: `${tenant.name} | Premium Lead Services`,
    description: tenant.pages[0]?.title || `Connect with ${tenant.name} for premium services.`,
  };
}

export default async function TenantPage({ params }: PageProps) {
  const { slug } = await params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  // Define dynamic inquiry options and Hero CTA based on tenant
  const inquiryOptions = slug === 'st-joseph' 
    ? ["Property Viewing", "General Inquiry"] 
    : ["Material Quote", "Delivery Logistics"];

  const heroCtaLabel = slug === 'st-joseph'
    ? "Schedule a Viewing"
    : "Request a Quote";

  // Assuming the first page is our landing page
  const page = tenant.pages[0];
  const allSections = (page?.content as Record<string, unknown>)?.sections as Record<string, unknown>[] || [];
  
  // Filter out removed legacy sections
  const sections = allSections.filter(s => 
    !['project-gallery', 'about', 'services', 'feature-grid'].includes(String(s.type))
  );

  const heroSection = sections.find(s => s.type === 'hero');
  const customCtaLabel = heroSection?.ctaText ? String(heroSection.ctaText) : heroCtaLabel;

  const projectsSection = sections.find(s => s.type === 'projects');
  const featuredProperty = projectsSection && Array.isArray(projectsSection.items) && projectsSection.items.length > 0
    ? {
        name: String((projectsSection.items[0] as any).name || ''),
        price: String((projectsSection.items[0] as any).price || ''),
        image: String((projectsSection.items[0] as any).image || ''),
      }
    : undefined;

  return (
    <main className="min-h-screen font-(--font-outfit)">
      <Navbar name={tenant.name} logoUrl={tenant.logoUrl} />
      {sections.map((section: Record<string, unknown>, index: number) => {
        switch (section.type) {
          case 'hero':
            return (
              <Hero 
                key={index}
                title={section.title ? String(section.title) : ''}
                subtitle={section.subtitle ? String(section.subtitle) : ''}
                backgroundImage={featuredProperty?.image || (section.backgroundImage ? String(section.backgroundImage) : '')}
                primaryColor={tenant.primaryColor}
                ctaLabel={section.ctaText ? String(section.ctaText) : heroCtaLabel}
                featuredProperty={featuredProperty}
              />
            );

          case 'lead-form':
            return (
              <LeadForm 
                key={index}
                title={section.title ? String(section.title) : 'Get in Touch'}
                description={section.description ? String(section.description) : ''}
                primaryColor={tenant.primaryColor}
                inquiryOptions={inquiryOptions}
                submitLabel={customCtaLabel}
                phone={tenant.contactPhone || undefined}
                email={tenant.contactEmail || undefined}
                address={section.address ? String(section.address) : undefined}
              />
            );

          case 'products':
            return (
              <FeatureGrid 
                key={index}
                title="Product Catalog"
                features={((section.items as any[]) || []).map(item => ({ title: item.name || '', description: item.details || '' }))}
                secondaryColor={tenant.secondaryColor}
                bgClass="bg-transparent"
              />
            );
          case 'projects':
            return (
              <React.Fragment key={index}>
              <ProjectGrid
                key={index}
                title="Featured Listings"
                projects={((section.items as any[]) || []).map(item => ({ 
                  name: item.name || '', 
                  status: item.status || 'Available', 
                  description: item.description || '',
                  price: item.price || '',
                  location: item.location || '',
                  beds: item.beds || '',
                  baths: item.baths || '',
                  sqft: item.sqft || '',
                  image: item.image || ''
                }))}
                primaryColor={tenant.primaryColor}
                theme="dark"
              />
            </React.Fragment>
            );
          case 'logistics':
            return (
              <section key={index} className="py-24 bg-zinc-900 text-white px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-brand-primary">Logistics & Delivery</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">{String(section.info || '')}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-brand-primary">Quality Guarantee</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">{String(section.quality || '')}</p>
                  </div>
                </div>
              </section>
            );
          default:
            return (
              <div key={index} className="p-10 border-2 border-dashed border-red-500 text-center text-red-500 m-4 rounded-xl">
                Unknown section type: <b>{String(section.type)}</b>
              </div>
            );
        }
      })}

      {/* Footer rendering contact info and socials */}
          {/* Footer rendering contact info and socials */}
      <footer className="bg-[#0b1120] py-24 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                {tenant.logoUrl ? (
                  <img src={tenant.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                ) : (
                   <div className="w-10 h-10 bg-[#8b5cf6] rounded-lg flex items-center justify-center font-bold text-zinc-950">SJ</div>
                )}
                <h4 className="text-xl font-bold text-white tracking-tight">{tenant.name}</h4>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Your trusted partner in finding premium real estate solutions.
              </p>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">Quick Links</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Listings</a></li>
                <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">Services</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Property Search</a></li>
                <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Investment Advisory</a></li>
                <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Property Management</a></li>
                <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Valuation</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">Follow Us</h5>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#8b5cf6] hover:text-zinc-950 transition-all cursor-pointer">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#8b5cf6] hover:text-zinc-950 transition-all cursor-pointer">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                 </div>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
            © 2026 {tenant.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
