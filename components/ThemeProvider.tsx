'use client';

import React, { useEffect } from 'react';

interface ThemeProviderProps {
  primaryColor: string;
  secondaryColor: string;
  children: React.ReactNode;
}

function getContrastColor(hexColor: string) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate relative luminance (YIQ formula)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Return dark gray or white based on luminance
  return yiq >= 128 ? '#18181b' : '#ffffff';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  primaryColor, 
  secondaryColor, 
  children 
}) => {
  useEffect(() => {
    // Inject CSS variables into the root element
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', primaryColor);
    root.style.setProperty('--brand-secondary', secondaryColor);
    root.style.setProperty('--brand-primary-fg', getContrastColor(primaryColor));
  }, [primaryColor, secondaryColor]);

  return <>{children}</>;
};
