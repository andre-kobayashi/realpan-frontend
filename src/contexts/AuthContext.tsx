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

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  type: 'INDIVIDUAL' | 'BUSINESS';
  businessStatus?: string;
}

interface ApiMessage {
  pt?: string;
  en?: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  customer: Customer;
  message?: ApiMessage;
}

interface RegisterResponse {
  success: boolean;
  message?: ApiMessage;
}

interface AuthContextType {
  customer: Customer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const customerStr = localStorage.getItem('customer');
    if (customerStr) {
      try {
        const parsedCustomer: Customer = JSON.parse(customerStr);
        setCustomer(parsedCustomer);
      } catch {
        localStorage.removeItem('customer');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { data } = await api.post<LoginResponse>('/api/auth/customer/login', {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem('customer_token', data.token);
        localStorage.setItem('customer', JSON.stringify(data.customer));
        setCustomer(data.customer);
      } else {
        throw new Error(data.message?.pt || 'Erro ao fazer login');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro inesperado ao fazer login');
    }
  };

  const logout = (): void => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer');
    setCustomer(null);
    router.push('/');
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await api.post<RegisterResponse>('/api/auth/customer/register', data);

      if (response.data.success) {
        if (data.type === 'INDIVIDUAL') {
          await login(data.email, data.password);
        }
      } else {
        throw new Error(response.data.message?.pt || 'Erro ao criar conta');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro inesperado ao criar conta');
    }
  };

  return (
    <AuthContext.Provider value={{ customer, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}