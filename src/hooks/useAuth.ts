'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CustomerType } from '@/types/product';

interface CustomerInfo {
  id: string;
  namePt: string;
  nameJa: string;
  email: string;
  customerType: CustomerType;
  companyName?: string;
}

export function useAuth() {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('customer');
      const token = window.localStorage.getItem('customer_token');
      if (saved && token) {
        const parsed = JSON.parse(saved);
        setCustomer({
          id: parsed.id,
          namePt: parsed.namePt || parsed.name || '',
          nameJa: parsed.nameJa || '',
          email: parsed.email || '',
          customerType: parsed.customerType === 'BUSINESS' ? 'PJ' : 'PF',
          companyName: parsed.companyName,
        });
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const isPJ = customer?.customerType === 'PJ';
  const isPF = !isPJ;
  const isLoggedIn = !!customer;

  const logout = useCallback(() => {
    window.localStorage.removeItem('customer');
    window.localStorage.removeItem('customer_token');
    setCustomer(null);
    window.location.href = '/';
  }, []);

  return { customer, isPJ, isPF, isLoggedIn, loading, logout };
}
