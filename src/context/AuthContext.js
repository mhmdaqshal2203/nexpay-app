'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('nexpay_auth');
    if (stored) {
      setIsAuthenticated(true);
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        sessionStorage.setItem('nexpay_auth', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      }
      
      return { success: false, message: data.error || 'Username atau password salah!' };
    } catch (error) {
      return { success: false, message: 'Koneksi ke server gagal' };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('nexpay_auth');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      sessionStorage.setItem('nexpay_auth', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
