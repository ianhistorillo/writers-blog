import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { users } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would call an API to validate credentials
    // For demo purposes, we'll just check against mock data
    // Assuming "password" is always "password" for demo
    
    if (password !== 'password') {
      return false;
    }
    
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      // Store auth state in localStorage in a real app
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    // Clear auth state from localStorage in a real app
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};