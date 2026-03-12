'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { CartItem, Product, CustomerType } from '@/types/product';

const TAX_RATE = 0.08;
const STORAGE_KEY = 'realpan_cart';

interface CartContextType {
  items: CartItem[];
  customerType: CustomerType;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerType: (type: CustomerType) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerType, setCustomerType] = useState<CustomerType>('PF');
  const initialized = useRef(false);

  // Carregar do localStorage na montagem
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.customerType === 'PJ') setCustomerType('PJ');
      }
    } catch { /* ignore */ }
  }, []);

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (!initialized.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, customerType }));
    } catch { /* ignore */ }
  }, [items, customerType]);

  const getUnitPrice = useCallback((product: Product) => {
    if (customerType === 'PJ') {
      return product.wholesalePrice;
    }
    return product.hasPromo && product.promoPrice
      ? product.promoPrice
      : product.retailPrice;
  }, [customerType]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      const unitPrice = getUnitPrice(product);
      const unitPriceWithTax = Math.ceil(unitPrice * (1 + TAX_RATE));

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(i =>
          i.productId === product.id
            ? { ...i, quantity: newQty, unitPrice, unitPriceWithTax }
            : i
        );
      }

      return [...prev, {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        unitPrice,
        unitPriceWithTax,
        quantity: Math.min(quantity, product.stock),
        wholesaleUnit: product.wholesaleUnit,
        unitsPerBox: product.unitsPerBox,
        stock: product.stock,
      }];
    });
  }, [getUnitPrice]);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  // Totais
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const tax = Math.ceil(subtotal * TAX_RATE);
  const total = subtotal + tax;

  return (
    <CartContext.Provider value={{
      items, customerType, itemCount, subtotal, tax, total,
      addItem, removeItem, updateQuantity, clearCart, setCustomerType,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
