import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { CartItem, Product, Sale } from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'boucherie-sales';

interface SalesContextType {
  cart: CartItem[];
  sales: Sale[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  completeSale: (amountReceived: number, employeeId: number, employeeName: string) => Sale;
  getSalesByDate: (date: string) => Sale[];
  getTodaySales: () => Sale[];
  getTodayTotal: () => number;
}

const SalesContext = createContext<SalesContextType | null>(null);

function loadSales(): Sale[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading sales from localStorage:', error);
  }
  return [];
}

function saveSales(sales: Sale[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  } catch (error) {
    console.error('Error saving sales to localStorage:', error);
  }
}

export function SalesProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>(loadSales);

  useEffect(() => {
    saveSales(sales);
  }, [sales]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentCart, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((currentCart) => currentCart.filter((item) => item.product.id !== productId));
    } else {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return Math.round(cart.reduce((total, item) => total + item.product.price * item.quantity, 0));
  }, [cart]);

  const completeSale = useCallback(
    (amountReceived: number, employeeId: number, employeeName: string): Sale => {
      const total = Math.round(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
      const change = amountReceived - total;
      const now = new Date();

      const sale: Sale = {
        id: generateId(),
        items: [...cart],
        total,
        amountReceived,
        change,
        employeeId,
        employeeName,
        date: now.toISOString(),
        timestamp: now.getTime(),
      };

      setSales((currentSales) => [sale, ...currentSales]);
      setCart([]);
      return sale;
    },
    [cart]
  );

  const getSalesByDate = useCallback(
    (date: string): Sale[] => {
      return sales.filter((sale) => sale.date.startsWith(date));
    },
    [sales]
  );

  const getTodaySales = useCallback((): Sale[] => {
    const today = new Date().toISOString().split('T')[0];
    return getSalesByDate(today);
  }, [getSalesByDate]);

  const getTodayTotal = useCallback((): number => {
    return getTodaySales().reduce((total, sale) => total + sale.total, 0);
  }, [getTodaySales]);

  return (
    <SalesContext.Provider
      value={{
        cart,
        sales,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        completeSale,
        getSalesByDate,
        getTodaySales,
        getTodayTotal,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
}
