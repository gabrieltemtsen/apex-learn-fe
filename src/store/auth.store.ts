import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarUrl?: string;
  points?: number;
  streak?: number;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (data: { user?: User | null; accessToken?: string | null; isAuthenticated?: boolean }) => void;
  logoutLocal: () => void;
  setUser: (user: User | null) => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      setSession: (data) =>
        set((s) => ({
          ...s,
          ...(data.user !== undefined ? { user: data.user } : {}),
          ...(data.accessToken !== undefined ? { accessToken: data.accessToken } : {}),
          ...(data.isAuthenticated !== undefined ? { isAuthenticated: data.isAuthenticated } : {}),
        })),
      logoutLocal: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'apexlearn-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
