'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: 'INDIVIDUAL' | 'BUSINESS';
  businessStatus?: string;
}

interface AuthContextType {
  customer: Customer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Carregar cliente do localStorage
    const customerStr = localStorage.getItem('customer');
    if (customerStr) {
      setCustomer(JSON.parse(customerStr));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/api/auth/customer/login', { email, password });
      
      if (data.success) {
        localStorage.setItem('customer_token', data.token);
        localStorage.setItem('customer', JSON.stringify(data.customer));
        setCustomer(data.customer);
      } else {
        throw new Error(data.message?.pt || 'Erro ao fazer login');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer');
    setCustomer(null);
    router.push('/');
  };

  const register = async (data: any) => {
    try {
      const response = await api.post('/api/auth/customer/register', data);
      
      if (response.data.success) {
        // Se for PF, faz login automaticamente
        if (data.type === 'INDIVIDUAL') {
          await login(data.email, data.password);
        }
      } else {
        throw new Error(response.data.message?.pt || 'Erro ao criar conta');
      }
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ customer, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
