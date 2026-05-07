'use client';

import { useState } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AdminForm({ initialTenant }: { initialTenant: any }) {
  const router = useRouter();
  
  // Basic tenant fields
  const [name, setName] = useState(initialTenant.name);
  const [primaryColor, setPrimaryColor] = useState(initialTenant.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initialTenant.secondaryColor);
  
  // Page content fields (assuming first section is hero)
  const page = initialTenant.pages?.[0];
  const heroSection = page?.content?.sections?.find((s: any) => s.type === 'hero') || {};
  
  const [heroTitle, setHeroTitle] = useState(heroSection.title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(heroSection.subtitle || '');

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update Tenant Branding
      const tenantRes = await fetch(`http://localhost:4000/api/tenants/${initialTenant.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, primaryColor, secondaryColor }),
      });
      
      if (!tenantRes.ok) throw new Error('Failed to update tenant settings');

      // 2. Update Page Content
      if (page) {
        // Clone existing content to keep other sections intact
        const updatedContent = JSON.parse(JSON.stringify(page.content));
        const heroIndex = updatedContent.sections.findIndex((s: any) => s.type === 'hero');
        
        if (heroIndex >= 0) {
          updatedContent.sections[heroIndex].title = heroTitle;
          updatedContent.sections[heroIndex].subtitle = heroSubtitle;
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
      
      // Refresh router to fetch new data
      router.refresh();

    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save changes: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Brand Settings Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
        <h2 className="text-xl font-bold text-zinc-900 mb-6">Brand Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Tenant Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-900"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
            <p className="text-xs text-zinc-500">The main headline displayed on the landing page.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Hero Subtitle</label>
            <textarea 
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-zinc-700 resize-none"
            />
             <p className="text-xs text-zinc-500">The supportive text displayed below the main headline.</p>
          </div>
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
