import { Hero } from '@/components/sections/Hero';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { LeadForm } from '@/components/sections/LeadForm';
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
  const sections = (page?.content as any)?.sections || [];

  return (
    <main className="min-h-screen font-(--font-outfit)">
      {sections.map((section: any, index: number) => {
        switch (section.type) {
          case 'hero':
            return (
              <Hero 
                key={index}
                title={section.title}
                subtitle={section.subtitle}
                backgroundImage={section.backgroundImage}
                primaryColor={tenant.primaryColor}
                ctaLabel={heroCtaLabel}
              />
            );
          case 'feature-grid':
            return (
              <FeatureGrid 
                key={index}
                title={section.title}
                features={section.features}
                secondaryColor={tenant.secondaryColor}
              />
            );
          case 'project-gallery':
            return (
              <ProjectGallery 
                key={index}
                title={section.title}
                images={section.images}
              />
            );
          case 'lead-form':
            return (
              <LeadForm 
                key={index}
                title={section.title}
                description={section.description}
                primaryColor={tenant.primaryColor}
                inquiryOptions={inquiryOptions}
              />
            );
          default:
            return (
              <div key={index} className="p-10 border-2 border-dashed border-red-500 text-center text-red-500 m-4 rounded-xl">
                Unknown section type: <b>{section.type}</b>
              </div>
            );
        }
      })}
    </main>
  );
}
