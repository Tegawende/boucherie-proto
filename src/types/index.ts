export interface Employee {
  id: number;
  name: string;
  pin: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  unit: 'kg' | 'pièce';
  category: 'Bœuf' | 'Poulet' | 'Autres';
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  amountReceived: number;
  change: number;
  employeeId: number;
  employeeName: string;
  date: string;
  timestamp: number;
}

export type Category = 'Tous' | 'Bœuf' | 'Poulet' | 'Autres';
