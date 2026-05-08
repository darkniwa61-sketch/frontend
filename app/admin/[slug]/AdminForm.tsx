'use client';

import { useState, useRef } from 'react';
import { Save, Loader2, CheckCircle2, Plus, Trash2, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Tenant {
  slug: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  socialLinks?: Record<string, string> | null;
  pages: {
    content: {
      sections: Record<string, unknown>[];
    };
  }[];
}

export default function AdminForm({ initialTenant }: { initialTenant: Tenant }) {
  const router = useRouter();
  
  // Basic tenant fields
  const [name, setName] = useState(initialTenant.name);
  const [primaryColor, setPrimaryColor] = useState(initialTenant.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initialTenant.secondaryColor);
  const [logoUrl, setLogoUrl] = useState(initialTenant.logoUrl || '');
  const [contactPhone, setContactPhone] = useState(initialTenant.contactPhone || '');
  const [contactEmail, setContactEmail] = useState(initialTenant.contactEmail || '');
  const [facebookUrl, setFacebookUrl] = useState(initialTenant.socialLinks?.facebook || '');
  const [linkedinUrl, setLinkedinUrl] = useState(initialTenant.socialLinks?.linkedin || '');
  
  // Page content fields
  const page = initialTenant.pages?.[0];
  
  // Hero Section State
  const heroSection = page?.content?.sections?.find((s) => s.type === 'hero') || {};
  const [heroTitle, setHeroTitle] = useState((heroSection.title as string) || '');
  const [heroSubtitle, setHeroSubtitle] = useState((heroSection.subtitle as string) || '');
  const [heroBg, setHeroBg] = useState((heroSection.backgroundImage as string) || '');
  const [ctaText, setCtaText] = useState((heroSection.ctaText as string) || '');

  // Lead Form Section State
  const leadFormSection = page?.content?.sections?.find((s) => s.type === 'lead-form') || {};
  const [leadFormTitle, setLeadFormTitle] = useState((leadFormSection.title as string) || 'Connect with us');
  const [leadFormDesc, setLeadFormDesc] = useState((leadFormSection.description as string) || 'Send us a message and we will get back to you shortly.');
  const [leadFormAddress, setLeadFormAddress] = useState((leadFormSection.address as string) || '123 Amity Blvd, New York, NY 10001');

  // Real Estate State (St. Joseph)

  const projectsSection = page?.content?.sections?.find((s) => s.type === 'projects') || {};
  const [devProjects, setDevProjects] = useState<{
    name: string, 
    status: string, 
    description: string,
    price?: string,
    location?: string,
    beds?: string,
    baths?: string,
    sqft?: string,
    image?: string
  }[]>((projectsSection.items as any) || []);

  // Construction State (Starblue)
  const productsSection = page?.content?.sections?.find((s) => s.type === 'products') || {};
  const [products, setProducts] = useState<{name: string, details: string}[]>((productsSection.items as any) || []);
  
  const logisticsSection = page?.content?.sections?.find((s) => s.type === 'logistics') || {};
  const [logisticsInfo, setLogisticsInfo] = useState((logisticsSection.info as string) || '');
  const [qualityGuarantee, setQualityGuarantee] = useState((logisticsSection.quality as string) || '');

  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Keep track of which field we are uploading for when the input changes
  const uploadTargetRef = useRef<{ type: 'logo' | 'hero' | 'project', index?: number } | null>(null);

  const isRealEstate = initialTenant.slug === 'st-joseph';
  const isConstruction = initialTenant.slug === 'starblue';

  const handleUploadClick = (target: { type: 'logo' | 'hero' | 'project', index?: number }) => {
    uploadTargetRef.current = target;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetRef.current) return;

    const target = uploadTargetRef.current;
    const fieldId = target.type === 'project' ? `project-${target.index}` : target.type;
    setUploadingField(fieldId);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      if (target.type === 'logo') setLogoUrl(data.url);
      if (target.type === 'hero') setHeroBg(data.url);
      if (target.type === 'project' && target.index !== undefined) {
        const newProj = [...devProjects];
        newProj[target.index].image = data.url;
        setDevProjects(newProj);
      }
      
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    } finally {
      setUploadingField(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };


  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update Tenant Branding
      const tenantRes = await fetch(`http://localhost:4000/api/tenants/${initialTenant.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          primaryColor, 
          secondaryColor,
          logoUrl: logoUrl.trim() || null,
          contactPhone: contactPhone.trim() || null,
          contactEmail: contactEmail.trim() || null,
          socialLinks: {
            facebook: facebookUrl.trim() || null,
            linkedin: linkedinUrl.trim() || null,
          }
        }),
      });
      
      if (!tenantRes.ok) throw new Error('Failed to update tenant settings');

      // 2. Update Page Content
      if (page) {
        const updatedContent = JSON.parse(JSON.stringify(page.content));
        
        // Remove legacy feature-grid if it exists to replace Exclusive Amenities
        updatedContent.sections = updatedContent.sections.filter((s: any) => s.type !== 'feature-grid');

        const upsertSection = (type: string, data: any) => {
          const idx = updatedContent.sections.findIndex((s: any) => s.type === type);
          if (idx >= 0) {
            updatedContent.sections[idx] = { ...updatedContent.sections[idx], ...data };
          } else {
            updatedContent.sections.push({ type, ...data });
          }
        };

        // Hero
        upsertSection('hero', {
          title: heroTitle,
          subtitle: heroSubtitle,
          ctaText: ctaText,
          ...(heroBg.trim() ? { backgroundImage: heroBg } : {})
        });

        // Lead Form
        upsertSection('lead-form', {
          title: leadFormTitle,
          description: leadFormDesc,
          address: leadFormAddress,
        });

        if (isRealEstate) {
          upsertSection('projects', { items: devProjects });
        }

        if (isConstruction) {
          upsertSection('products', { items: products });
          upsertSection('logistics', { info: logisticsInfo, quality: qualityGuarantee });
        }

        const pageRes = await fetch(`http://localhost:4000/api/tenants/${initialTenant.slug}/page`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: updatedContent }),
        });
        
        if (!pageRes.ok) throw new Error('Failed to update page content');
      }

      toast.success('Changes saved successfully!', {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      });
      
      router.refresh();

    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to save changes: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Brand Settings Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
        <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
          System Setup & Branding
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Official Company Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Company Logo</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-900"
              />
              <button
                onClick={() => handleUploadClick({ type: 'logo' })}
                disabled={uploadingField === 'logo'}
                className="px-4 py-3 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors font-semibold flex items-center gap-2 border border-zinc-200 disabled:opacity-50"
              >
                {uploadingField === 'logo' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                Upload
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 pt-6 border-t border-zinc-100">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Contact Phone</label>
            <input 
              type="text" 
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Contact Email</label>
            <input 
              type="email" 
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@company.com"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-900"
            />
          </div>
        </div>
      </section>

      {/* The Hook Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
        <h2 className="text-xl font-bold text-zinc-900 mb-6">The "Hook" (Promotional Content)</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Hero Headline (Big Text)</label>
            <input 
              type="text" 
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="e.g. Building the Foundations of Tomorrow."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-xl font-bold text-zinc-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">The Slogan (Sub-headline)</label>
            <textarea 
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-700 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Call to Action (CTA) Text</label>
            <input 
              type="text" 
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. View Projects, Request Quote, Contact Us"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Hero Background Image URL</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="https://images.unsplash.com/photo-..."
                value={heroBg}
                onChange={(e) => setHeroBg(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm text-zinc-900"
              />
              <button
                onClick={() => handleUploadClick({ type: 'hero' })}
                disabled={uploadingField === 'hero'}
                className="px-4 py-3 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors font-semibold flex items-center gap-2 border border-zinc-200 disabled:opacity-50 shrink-0"
              >
                {uploadingField === 'hero' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                Upload
              </button>
            </div>
            {heroBg && (
              <div className="mt-4 h-32 w-full rounded-xl bg-cover bg-center border border-zinc-200" style={{ backgroundImage: `url(${heroBg})` }} />
            )}
          </div>
        </div>
      </section>

      {/* Lead Form Settings */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
        <h2 className="text-xl font-bold text-zinc-900 mb-6">Lead Generation Form Settings</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Form Title</label>
            <input 
              type="text" 
              value={leadFormTitle}
              onChange={(e) => setLeadFormTitle(e.target.value)}
              placeholder="e.g. Ready to get started?"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Form Description</label>
            <textarea 
              value={leadFormDesc}
              onChange={(e) => setLeadFormDesc(e.target.value)}
              rows={2}
              placeholder="Brief text explaining what happens after they submit..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-700 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Physical Address</label>
            <input 
              type="text" 
              value={leadFormAddress}
              onChange={(e) => setLeadFormAddress(e.target.value)}
              placeholder="123 Example Street, City, State 12345"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-900"
            />
          </div>
        </div>
      </section>

      {/* Conditionally Rendered Real Estate Section */}
      {isRealEstate && (
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900 mb-6 text-brand-primary">Real Estate Features (St. Joseph)</h2>
          
          <div className="space-y-8">
            <div className="space-y-4 pt-6 border-zinc-100">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-zinc-700 uppercase tracking-widest">Featured Listings / Projects</label>
                <button 
                  onClick={() => setDevProjects([...devProjects, {name: '', status: 'Available', description: '', price: '', location: '', beds: '', baths: '', sqft: '', image: ''}])}
                  className="text-xs font-semibold text-brand-primary flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add Property
                </button>
              </div>
              {devProjects.map((proj, idx) => (
                <div key={idx} className="space-y-4 bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 relative group">
                  <button 
                    onClick={() => setDevProjects(devProjects.filter((_, i) => i !== idx))}
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Property Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Modern Downtown Penthouse"
                          value={proj.name}
                          onChange={(e) => {
                            const newProj = [...devProjects];
                            newProj[idx].name = e.target.value;
                            setDevProjects(newProj);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Price</label>
                          <input 
                            type="text" 
                            placeholder="$2,500,000"
                            value={proj.price}
                            onChange={(e) => {
                              const newProj = [...devProjects];
                              newProj[idx].price = e.target.value;
                              setDevProjects(newProj);
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Status</label>
                          <select 
                            value={['Developed', 'Sold', 'Developing'].includes(proj.status) ? proj.status : 'Other'}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newProj = [...devProjects];
                              if (val === 'Other') {
                                newProj[idx].status = '';
                              } else {
                                newProj[idx].status = val;
                              }
                              setDevProjects(newProj);
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none"
                          >
                            <option value="Developed">Developed</option>
                            <option value="Sold">Sold</option>
                            <option value="Developing">Developing</option>
                            <option value="Other">Other (Custom)</option>
                          </select>
                          {!['Developed', 'Sold', 'Developing'].includes(proj.status) && (
                            <input 
                              type="text" 
                              autoFocus
                              placeholder="Type custom status (e.g. Pre-selling)..."
                              value={proj.status}
                              onChange={(e) => {
                                const newProj = [...devProjects];
                                newProj[idx].status = e.target.value;
                                setDevProjects(newProj);
                              }}
                              className="w-full px-4 py-2 rounded-lg border-2 border-brand-primary/30 bg-violet-50 text-sm outline-none mt-2 animate-in fade-in slide-in-from-top-1 shadow-sm"
                            />
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Location</label>
                        <input 
                          type="text" 
                          placeholder="Miami Beach, FL"
                          value={proj.location}
                          onChange={(e) => {
                            const newProj = [...devProjects];
                            newProj[idx].location = e.target.value;
                            setDevProjects(newProj);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Beds</label>
                          <input type="text" value={proj.beds} onChange={(e) => { const n = [...devProjects]; n[idx].beds = e.target.value; setDevProjects(n); }} className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Baths</label>
                          <input type="text" value={proj.baths} onChange={(e) => { const n = [...devProjects]; n[idx].baths = e.target.value; setDevProjects(n); }} className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Sqft</label>
                          <input type="text" value={proj.sqft} onChange={(e) => { const n = [...devProjects]; n[idx].sqft = e.target.value; setDevProjects(n); }} className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none" />
                        </div>
                      </div>
                      
                        <div className="flex gap-2 items-end">
                          <div className="flex-1 space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Featured Image URL</label>
                            <input 
                              type="text" 
                              value={proj.image}
                              onChange={(e) => {
                                const newProj = [...devProjects];
                                newProj[idx].image = e.target.value;
                                setDevProjects(newProj);
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            {proj.image && (
                              <div className="w-10 h-10 rounded-lg bg-cover bg-center border border-zinc-200" style={{ backgroundImage: `url(${proj.image})` }} />
                            )}
                            <button
                              onClick={() => handleUploadClick({ type: 'project', index: idx })}
                              disabled={uploadingField === `project-${idx}`}
                              className="px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors shrink-0"
                            >
                              {uploadingField === `project-${idx}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
              {devProjects.length === 0 && <p className="text-xs text-zinc-500 italic">No properties added yet.</p>}
            </div>
          </div>
        </section>
      )}

      {/* Conditionally Rendered Construction Section */}
      {isConstruction && (
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900 mb-6 text-brand-primary">Construction Features (Starblue)</h2>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-zinc-700">Product Catalog</label>
                <button 
                  onClick={() => setProducts([...products, {name: '', details: ''}])}
                  className="text-xs font-semibold text-brand-primary flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add Product
                </button>
              </div>
              {products.map((prod, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      placeholder="Material Name (e.g., G1, Crushed Stone)"
                      value={prod.name}
                      onChange={(e) => {
                        const newProd = [...products];
                        newProd[idx].name = e.target.value;
                        setProducts(newProd);
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Specifications/Details"
                      value={prod.details}
                      onChange={(e) => {
                        const newProd = [...products];
                        newProd[idx].details = e.target.value;
                        setProducts(newProd);
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 text-sm outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => setProducts(products.filter((_, i) => i !== idx))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {products.length === 0 && <p className="text-xs text-zinc-500 italic">No products added.</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Logistics Info</label>
              <textarea 
                value={logisticsInfo}
                onChange={(e) => setLogisticsInfo(e.target.value)}
                placeholder="Delivery options, pickup details..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-700 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Quality Guarantee / Certifications</label>
              <textarea 
                value={qualityGuarantee}
                onChange={(e) => setQualityGuarantee(e.target.value)}
                placeholder="Any standards for materials..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-700 resize-none"
              />
            </div>
          </div>
        </section>
      )}





      {/* Save Actions Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-zinc-200 p-4 px-8 z-50">
        <div className="max-w-5xl mx-auto flex justify-end items-center gap-4">
          <button 
            onClick={() => window.open(`http://${initialTenant.slug}.localhost:3000`, '_blank')}
            className="px-6 py-3 rounded-xl font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Preview Site
          </button>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
