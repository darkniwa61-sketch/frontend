'use client';

import React, { useEffect } from 'react';

interface ThemeProviderProps {
  primaryColor: string;
  secondaryColor: string;
  children: React.ReactNode;
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
  }, [primaryColor, secondaryColor]);

  return <>{children}</>;
};
