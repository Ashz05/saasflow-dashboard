import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  workspace?: Workspace;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('saasflow_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('saasflow_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('saasflow_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('saasflow_user', JSON.stringify(res.data));
        } catch (err: any) {
          if (err?.response?.status === 401) {
            localStorage.removeItem('saasflow_token');
            localStorage.removeItem('saasflow_refresh_token');
            localStorage.removeItem('saasflow_user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const res = await api.post('/auth/login', { email, password, rememberMe });
    const { access_token, refresh_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('saasflow_token', access_token);
    if (refresh_token) {
      localStorage.setItem('saasflow_refresh_token', refresh_token);
    }
    localStorage.setItem('saasflow_user', JSON.stringify(userData));
  };

  const register = async (email: string, password: string, fullName: string) => {
    const res = await api.post('/auth/register', { email, password, fullName });
    const { access_token, refresh_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('saasflow_token', access_token);
    if (refresh_token) {
      localStorage.setItem('saasflow_refresh_token', refresh_token);
    }
    localStorage.setItem('saasflow_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('saasflow_token');
      localStorage.removeItem('saasflow_refresh_token');
      localStorage.removeItem('saasflow_user');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
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
