import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export type UserRole = 'customer' | 'helper' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  pincode: string;
  address: string;
  language?: string;
  helperId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  helper: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { identifier: string; password: string }) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  registerCustomer: (payload: any) => Promise<{ success: boolean; message: string }>;
  registerHelper: (payload: any) => Promise<{ success: boolean; message: string; helper?: any }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [helper, setHelper] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.getMe();
      if (res.authenticated && res.user) {
        setUser(res.user);
        setHelper(res.helper || null);
      } else {
        setUser(null);
        setHelper(null);
      }
    } catch {
      setUser(null);
      setHelper(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: { identifier: string; password: string }) => {
    try {
      const res = await authAPI.login(credentials);
      if (res.success && res.user) {
        setUser(res.user);
        setHelper(res.helper || null);
        return { success: true, message: res.message, role: res.user.role };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login error' };
    }
  };

  const registerCustomer = async (payload: any) => {
    try {
      const res = await authAPI.registerCustomer(payload);
      if (res.success && res.user) {
        setUser(res.user);
        setHelper(null);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration error' };
    }
  };

  const registerHelper = async (payload: any) => {
    try {
      const res = await authAPI.registerHelper(payload);
      if (res.success && res.user) {
        setUser(res.user);
        setHelper(res.helper || null);
        return { success: true, message: res.message, helper: res.helper };
      }
      return { success: false, message: res.message || 'Helper registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Helper registration error' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
      setHelper(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        helper,
        isAuthenticated: !!user,
        isLoading,
        login,
        registerCustomer,
        registerHelper,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
