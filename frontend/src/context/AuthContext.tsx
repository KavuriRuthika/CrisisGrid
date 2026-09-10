import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchRole: (newRole: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user_data');
    return saved ? JSON.parse(saved) : {
      id: 2,
      email: 'authority@crisis.gov',
      username: 'authority',
      full_name: 'Disaster Operations Commander',
      role: 'AUTHORITY',
      phone: '+1-800-555-0102',
      is_active: true
    };
  });

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user_data', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
  };

  const switchRole = (newRole: Role) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('user_data', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, role: user?.role || 'AUTHORITY', login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
