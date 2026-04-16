"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points?: number;
  rating?: number;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
};

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage (token + user data)
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('wanya_token');
      const storedUser = localStorage.getItem('wanya_user');
      
      if (token) {
        // First, try to use stored user data for immediate UI
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: { user, token } 
            });
          } catch (error) {
            console.error('Error parsing stored user data:', error);
          }
        }

        // Then validate token and fetch fresh data in background
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Update with fresh data from backend
            localStorage.setItem('wanya_user', JSON.stringify(data.user));
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: { user: data.user, token } 
            });
          } else {
            // Token invalid, clear everything
            localStorage.removeItem('wanya_token');
            localStorage.removeItem('wanya_user');
            dispatch({ type: 'LOGIN_FAILURE' });
          }
        } catch (error) {
          console.error('Token validation error:', error);
          // Network error, keep using stored data if available
          if (!storedUser) {
            localStorage.removeItem('wanya_token');
            dispatch({ type: 'LOGIN_FAILURE' });
          }
        }
      } else {
        // No token, clear any stored user data
        localStorage.removeItem('wanya_user');
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };

    initializeAuth();
  }, []);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('wanya_token', data.token);
        localStorage.setItem('wanya_user', JSON.stringify(data.user));
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: data.user, token: data.token } 
        });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('wanya_token', data.token);
        localStorage.setItem('wanya_user', JSON.stringify(data.user));
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: data.user, token: data.token } 
        });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('wanya_token');
    localStorage.removeItem('wanya_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (data: Partial<User>) => {
    // Update localStorage user data as well
    if (state.user) {
      const updatedUser = { ...state.user, ...data };
      localStorage.setItem('wanya_user', JSON.stringify(updatedUser));
    }
    dispatch({ type: 'UPDATE_USER', payload: data });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export convenience functions for backward compatibility
export function useAuthStore() {
  const { state, dispatch, login, register, logout, updateUser } = useAuth();
  
  return {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    
    login,
    register,
    logout,
    updateUser,
    setUser: (user: User) => dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: state.token! } }),
  };
}
