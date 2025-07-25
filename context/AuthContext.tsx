import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'customer@indosecure.com',
    role: 'customer',
    phone: '+91 9876543210',
    address: '123 Main Street, Mumbai, Maharashtra',
    monthlyIncome: 75000,
    creditScore: 750,
    employmentType: 'salaried',
    yearsOfEmployment: 5
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'officer@indosecure.com',
    role: 'loan_officer',
    phone: '+91 9876543211'
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    email: 'rajesh@indosecure.com',
    role: 'customer',
    phone: '+91 9876543212',
    address: '456 Park Avenue, Delhi',
    monthlyIncome: 120000,
    creditScore: 780,
    employmentType: 'self_employed',
    yearsOfEmployment: 8
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('indosecure_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('indosecure_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('indosecure_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};