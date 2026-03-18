'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

interface TenantTheme {
  primaryColor: string;
  backgroundColor: string;
  logoUrl?: string;
  name: string;
  slug: string;
}

const defaultTheme: TenantTheme = {
  primaryColor: '#6366f1',
  backgroundColor: '#0f172a',
  name: 'ApexLearn',
  slug: 'default',
};

const TenantContext = createContext<TenantTheme>(defaultTheme);

export function useTenant() {
  return useContext(TenantContext);
}

interface TenantProviderProps {
  children: React.ReactNode;
  slug?: string;
}

export default function TenantProvider({ children, slug }: TenantProviderProps) {
  const [theme, setTheme] = useState<TenantTheme>(defaultTheme);

  useEffect(() => {
    if (!slug) return;
    api.get(`/tenants/${slug}`).then((res) => {
      setTheme({
        primaryColor: res.data.primaryColor || defaultTheme.primaryColor,
        backgroundColor: res.data.backgroundColor || defaultTheme.backgroundColor,
        logoUrl: res.data.logoUrl,
        name: res.data.name,
        slug: res.data.slug,
      });
    }).catch(() => {});
  }, [slug]);

  return (
    <TenantContext.Provider value={theme}>
      <style>{`
        :root {
          --color-primary: ${theme.primaryColor};
          --color-bg: ${theme.backgroundColor};
        }
      `}</style>
      {children}
    </TenantContext.Provider>
  );
}
