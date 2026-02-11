'use client';

import { createContext, useContext, useState } from 'react';

type CustomerType = 'PJ' | 'PF';

const CustomerTypeContext = createContext<{
  type: CustomerType;
  setType: (t: CustomerType) => void;
}>({
  type: 'PF',
  setType: () => {}
});

export function CustomerTypeProvider({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState<CustomerType>('PF');

  return (
    <CustomerTypeContext.Provider value={{ type, setType }}>
      {children}
    </CustomerTypeContext.Provider>
  );
}

export function useCustomerType() {
  return useContext(CustomerTypeContext);
}