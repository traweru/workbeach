/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthState } from '../Types/Student';

interface AuthContextType extends AuthState {
  login: (userData: User, token: string) => void; // Добавляем токен
  logout: () => void;
  hasRole: (role: string) => boolean;
  getToken: () => string | null; // Добавляем метод для получения токена
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (userData && token) {
      const user = JSON.parse(userData);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token); // Сохраняем токен
    setAuthState({
      user: userData,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const hasRole = (role: string): boolean => {
    if (!authState.user?.roles) return false;
    return authState.user.roles.split(',').includes(role);
  };

  const getToken = (): string | null => {
    return localStorage.getItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, hasRole, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};