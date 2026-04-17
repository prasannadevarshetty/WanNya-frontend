import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/services/api';
import { User } from '@/types';
import { useProfileStore } from '@/store/useProfileStore';
import { useCartStore } from '@/store/useCartStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useSearchStore } from '@/store/useSearchStore';

const setAuthCookie = (token: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `wanya_token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
  }
};

const removeAuthCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'wanya_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Forgot password state
  forgotPasswordEmail: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'apple', id: string, email: string, name?: string, avatar?: string) => Promise<boolean>;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearAuth: () => void;
  loadUser: () => Promise<void>;
  
  // Forgot password actions
  setForgotPasswordEmail: (email: string) => void;
  clearForgotPasswordEmail: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  forgotPasswordEmail: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });
          const { user, token } = response;

          // Store token and user in localStorage
          localStorage.setItem('wanya_token', token);
          localStorage.setItem('wanya_user', JSON.stringify(user));

          // Set cookie for middleware
          setAuthCookie(token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed'
          });
          return false;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register({ name, email, password });
          const { user, token } = response;

          // Store token and user in localStorage
          localStorage.setItem('wanya_token', token);
          localStorage.setItem('wanya_user', JSON.stringify(user));

          // Set cookie for middleware
          setAuthCookie(token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed'
          });
          return false;
        }
      },

      socialLogin: async (provider: 'google' | 'apple', id: string, email: string, name?: string, avatar?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.socialLogin({ provider, id, email, name, avatar });
          const { user, token } = response;

          // Store token and user in localStorage
          localStorage.setItem('wanya_token', token);
          localStorage.setItem('wanya_user', JSON.stringify(user));

          // Set cookie for middleware
          setAuthCookie(token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Social login failed'
          });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.logout();
          
          // Clear stored data
          localStorage.removeItem('wanya_token');
          localStorage.removeItem('wanya_user');
          
          // Clear cookie
          removeAuthCookie();
          
          // Clear all related stores
          useProfileStore.getState().clearProfile();
          useCartStore.getState().clearCart();
          useNotificationStore.getState().clearNotifications();
          useWishlistStore.getState().clearWishlist();
          useOnboardingStore.getState().resetOnboarding();
          useSearchStore.getState().clearSearch();
          
          set(initialState);
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Logout failed'
          });
        }
      },

      setUser: (user) => {
        localStorage.setItem('wanya_user', JSON.stringify(user));
        set({ user });
      },

      updateUser: (updates) => set((state) => {
        if (state.user) {
          const updatedUser = { ...state.user, ...updates };
          localStorage.setItem('wanya_user', JSON.stringify(updatedUser));
          return { user: updatedUser };
        }
        return state;
      }),

      clearAuth: () => {
        localStorage.removeItem('wanya_token');
        localStorage.removeItem('wanya_user');
        // Clear cookie
        removeAuthCookie();
        set(initialState);
      },

      loadUser: async () => {
        const token = localStorage.getItem('wanya_token');
        const storedUser = localStorage.getItem('wanya_user');
        
        if (!token) {
          removeAuthCookie();
          set(initialState);
          return;
        }

        // Ensure cookie is in sync with localStorage
        setAuthCookie(token);

        // If we have stored user data, use it immediately and validate in background
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (e) {
            // Invalid stored user, clear everything
            localStorage.removeItem('wanya_token');
            localStorage.removeItem('wanya_user');
            set(initialState);
            return;
          }
        }

        // Validate token in background (don't log out on failure)
        try {
          const response = await authAPI.getCurrentUser();
          const { user } = response;
          
          // Update stored user data
          localStorage.setItem('wanya_user', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.warn('Token validation failed, but keeping user logged in:', error);
          // Don't log out on validation failure - user might be offline
          // Only clear if we don't have stored user data
          if (!storedUser) {
            localStorage.removeItem('wanya_token');
            set(initialState);
          } else {
            set({ isLoading: false, error: null });
          }
        }
      },

      // Forgot password actions
      setForgotPasswordEmail: (email: string) => {
        set({ forgotPasswordEmail: email });
      },

      clearForgotPasswordEmail: () => {
        set({ forgotPasswordEmail: null });
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.forgotPassword({ email });
          set({ 
            forgotPasswordEmail: email,
            isLoading: false, 
            error: null 
          });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to send OTP'
          });
          return false;
        }
      },

      resetPassword: async (email: string, otp: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.resetPassword({ email, otp, newPassword });
          set({ 
            forgotPasswordEmail: null,
            isLoading: false, 
            error: null 
          });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to reset password'
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
