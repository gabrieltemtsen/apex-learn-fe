'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

export function useAuth() {
  const store = useAuthStore();
  const router = useRouter();

  const requireAuth = () => {
    if (!store.isAuthenticated) {
      router.push('/login');
    }
  };

  const requireRole = (roles: string[]) => {
    if (!store.isAuthenticated) {
      router.push('/login');
      return false;
    }
    if (!store.user || !roles.includes(store.user.role)) {
      router.push('/dashboard');
      return false;
    }
    return true;
  };

  const loginWithCredentials = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = response.data;
    store.login(user, accessToken, refreshToken);
    return user;
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    tenantId?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    const { user, accessToken, refreshToken } = response.data;
    store.login(user, accessToken, refreshToken);
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    store.logout();
    router.push('/');
  };

  return {
    ...store,
    requireAuth,
    requireRole,
    loginWithCredentials,
    register,
    logout,
  };
}
