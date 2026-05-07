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
  
  // Page content fields
  const page = initialTenant.pages?.[0];
  
  // Hero Section State
  const heroSection = page?.content?.sections?.find((s) => s.type === 'hero') || {};
  const [heroTitle, setHeroTitle] = useState((heroSection.title as string) || '');
  const [heroSubtitle, setHeroSubtitle] = useState((heroSection.subtitle as string) || '');
  const [heroBg, setHeroBg] = useState((heroSection.backgroundImage as string) || '');

  // Gallery Section State
  const gallerySection = page?.content?.sections?.find((s) => s.type === 'project-gallery') || {};
  const [galleryImages, setGalleryImages] = useState<string[]>((gallerySection.images as string[]) || []);

  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Keep track of which field we are uploading for when the input changes
  const uploadTargetRef = useRef<{ type: 'logo' | 'hero' | 'gallery', index?: number } | null>(null);

  const handleUploadClick = (target: { type: 'logo' | 'hero' | 'gallery', index?: number }) => {
    uploadTargetRef.current = target;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetRef.current) return;

    const target = uploadTargetRef.current;
    const fieldId = target.type === 'gallery' ? `gallery-${target.index}` : target.type;
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
      if (target.type === 'gallery' && target.index !== undefined) {
        handleUpdateGalleryImage(target.index, data.url);
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

  const handleAddGalleryImage = () => {
    setGalleryImages([...galleryImages, '']);
  };

  const handleUpdateGalleryImage = (index: number, val: string) => {
    const newImages = [...galleryImages];
    newImages[index] = val;
    setGalleryImages(newImages);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
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
          logoUrl: logoUrl.trim() || null
        }),
      });
      
      if (!tenantRes.ok) throw new Error('Failed to update tenant settings');

      // 2. Update Page Content
      if (page) {
        const updatedContent = JSON.parse(JSON.stringify(page.content));
        
        // Hero
        const heroIndex = updatedContent.sections.findIndex((s: Record<string, unknown>) => s.type === 'hero');
        if (heroIndex >= 0) {
          updatedContent.sections[heroIndex].title = heroTitle;
          updatedContent.sections[heroIndex].subtitle = heroSubtitle;
          if (heroBg.trim()) {
            updatedContent.sections[heroIndex].backgroundImage = heroBg;
          }
        }

        // Gallery
        const galleryIndex = updatedContent.sections.findIndex((s: Record<string, unknown>) => s.type === 'project-gallery');
        if (galleryIndex >= 0) {
          updatedContent.sections[galleryIndex].images = galleryImages.filter(img => img.trim() !== '');
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
          Brand Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Tenant Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Logo Image URL</label>
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
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Primary Color</label>
            <div className="flex gap-3 items-center">
              <input 
                type="color" 
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 p-1 rounded-lg border border-zinc-200 cursor-pointer"
              />
              <input 
                type="text" 
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm outline-none text-zinc-900 uppercase"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Secondary Color</label>
            <div className="flex gap-3 items-center">
              <input 
                type="color" 
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-12 p-1 rounded-lg border border-zinc-200 cursor-pointer"
              />
              <input 
                type="text" 
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm outline-none text-zinc-900 uppercase"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Website Content Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
        <h2 className="text-xl font-bold text-zinc-900 mb-6">Website Content (Hero)</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Hero Title</label>
            <input 
              type="text" 
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-xl font-bold text-zinc-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Hero Subtitle</label>
            <textarea 
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-700 resize-none"
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

      {/* Gallery Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900">Project Gallery Images</h2>
          <button 
            onClick={handleAddGalleryImage}
            className="flex items-center gap-2 text-sm font-semibold text-brand-primary bg-brand-primary/10 px-4 py-2 rounded-full hover:bg-brand-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>
        
        <div className="space-y-4">
          {galleryImages.length === 0 && (
            <p className="text-zinc-500 text-sm italic">No gallery images added yet.</p>
          )}
          {galleryImages.map((img, index) => (
            <div key={index} className="flex gap-4 items-start bg-zinc-50 p-4 rounded-xl border border-zinc-100">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..."
                    value={img}
                    onChange={(e) => handleUpdateGalleryImage(index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm text-zinc-900"
                  />
                  <button
                    onClick={() => handleUploadClick({ type: 'gallery', index })}
                    disabled={uploadingField === `gallery-${index}`}
                    className="px-4 py-3 rounded-lg bg-white text-zinc-700 hover:bg-zinc-100 transition-colors font-semibold flex items-center gap-2 border border-zinc-200 disabled:opacity-50 shrink-0"
                  >
                    {uploadingField === `gallery-${index}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {img ? (
                <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-zinc-200" style={{ backgroundImage: `url(${img})` }} />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-zinc-200 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5 text-zinc-400" />
                </div>
              )}
              <button 
                onClick={() => handleRemoveGalleryImage(index)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-0.5 shrink-0"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </section>

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
