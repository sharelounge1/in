import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false
      }),

      setTokens: (token, refreshToken) => set({
        token,
        refreshToken
      }),

      logout: () => set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false
      }),

      checkAuth: async () => {
        const state = get();

        if (!state.token) {
          set({ isLoading: false, isAuthenticated: false });
          return false;
        }

        try {
          // Import apiClient dynamically to avoid circular dependency
          const { apiClient } = await import('@/lib/apiClient');
          const response = await apiClient.get<{ user: User }>('/auth/me');

          if (response.data.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false
            });
            return true;
          }

          set({ isLoading: false, isAuthenticated: false });
          return false;
        } catch {
          // Token is invalid or expired
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false
          });
          return false;
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
