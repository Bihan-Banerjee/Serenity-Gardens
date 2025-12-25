import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, User } from '@/lib/auth';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: true,

      setAuth: (token: string, user: User) => {
        authService.saveAuth(token, user);
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: user.isAdmin || false,
          isLoading: false,
        });
      },

      logout: () => {
        authService.logout();
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        });
      },

      checkAuth: async () => {
        const token = authService.getToken();
        const savedUser = authService.getUser();
        
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          const user = await authService.getMe();
          set({
            token,
            user,
            isAuthenticated: true,
            isAdmin: user.isAdmin || false,
            isLoading: false,
          });
        } catch {
          authService.logout();
          set({
            token: null,
            user: savedUser,
            isAuthenticated: !!savedUser,
            isAdmin: savedUser?.isAdmin || false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
