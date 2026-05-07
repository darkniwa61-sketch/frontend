import { notFound } from 'next/navigation';
import AdminForm from './AdminForm';

async function getTenant(slug: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/tenants/${slug}`, {
      cache: 'no-store', // Always get fresh data for admin
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch tenant:', error);
    return null;
  }
}

export default async function AdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.slug);

  if (!tenant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <header className="bg-white border-b border-zinc-200 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Editing: {tenant.name}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Admin CMS Editor &middot; {tenant.slug}.localhost:3000
            </p>
          </div>
          <a href="/" className="text-sm font-medium text-brand-primary hover:underline">
            &larr; Back to Directory
          </a>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-8 py-12">
        <AdminForm initialTenant={tenant} />
      </main>
    </div>
  );
}
