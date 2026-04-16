import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { ThemeProvider } from "../components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multi-Tenant CMS",
  description: "A premium multi-tenant CMS for landing pages",
};

async function getBranding(slug: string | null) {
  if (!slug) return null;
  try {
    // Fetch from our NestJS API
    const res = await fetch(`http://localhost:4000/api/tenants/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch branding:', error);
    return null;
  }
}

// Professional neutral fallback
const DEFAULT_BRANDING = {
  primaryColor: '#171717',
  secondaryColor: '#64748b',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const slug = headerList.get('x-tenant-slug');
  const branding = await getBranding(slug);
  
  const theme = branding || DEFAULT_BRANDING;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col text-foreground bg-background">
        <ThemeProvider primaryColor={theme.primaryColor} secondaryColor={theme.secondaryColor}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
