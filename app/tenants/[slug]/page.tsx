import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { ProjectGrid } from '@/components/sections/ProjectGrid';
import { LeadForm } from '@/components/sections/LeadForm';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Testimonials } from '@/components/sections/Testimonials';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { API_BASE_URL } from '@/lib/api';

async function getTenantData(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tenants/${slug}`, { 
      cache: 'no-store',
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

  if (!tenant || (slug === 'starblue' && process.env.NODE_ENV !== 'development')) {
    notFound();
  }

  // Define dynamic inquiry options and Hero CTA based on tenant
  const inquiryOptions = slug === 'st-joseph' 
    ? ["Schedule a Viewing", "General Inquiry"] 
    : ["Material Quote", "Delivery Logistics"];

  const heroCtaLabel = slug === 'st-joseph'
    ? "Schedule a Viewing"
    : "Request a Quote";

  // Assuming the first page is our landing page
  const page = tenant.pages[0];
  const allSections = (page?.content as Record<string, unknown>)?.sections as Record<string, unknown>[] || [];
  
  // Filter out removed legacy sections
  const filtered = allSections.filter(s => 
    !['project-gallery', 'about', 'services'].includes(String(s.type))
  );

  // Enforce fixed display order: hero → projects → testimonials → feature-grid → logistics → products → lead-form
  const sectionOrder = ['hero', 'projects', 'testimonials', 'feature-grid', 'logistics', 'products', 'lead-form'];
  const sections = [
    ...sectionOrder.map(type => filtered.find(s => s.type === type)).filter(Boolean),
    ...filtered.filter(s => !sectionOrder.includes(String(s.type))), // unknown section types at end
  ] as Record<string, unknown>[];


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
                tenantSlug={slug}
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
                  image: item.image || '',
                  bedImages: item.bedImages || [],
                  bathImages: item.bathImages || []
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
          case 'feature-grid':
            return (
              <FeatureGrid 
                key={index}
                title={section.title ? String(section.title) : 'Our Features'}
                features={((section.features as any[]) || []).map(f => ({ title: f.title || '', description: f.description || '' }))}
                secondaryColor={tenant.secondaryColor}
              />
            );
          case 'testimonials':
            return (
              <Testimonials 
                key={index}
                title={section.title ? String(section.title) : 'What Our Clients Say'}
                testimonials={((section.items as any[]) || []).map(t => ({ name: t.name || '', role: t.role || '', text: t.text || '' }))}
                primaryColor={tenant.primaryColor}
              />
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
      <Footer 
        name={tenant.name}
        logoUrl={tenant.logoUrl}
        socialLinks={tenant.socialLinks}
      />
    </main>
  );
}
