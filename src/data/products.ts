import type { Product } from '@/types';

export const products: Product[] = [
  // Bœuf
  { id: 1, name: 'Viande de bœuf', price: 1500, unit: 'kg', category: 'Bœuf', image: '/images/products/beef.png' },
  { id: 2, name: 'Côtes de bœuf', price: 1800, unit: 'kg', category: 'Bœuf', image: '/images/products/beef.png' },
  { id: 3, name: 'Foie de bœuf', price: 1200, unit: 'kg', category: 'Bœuf', image: '/images/products/beef.png' },
  { id: 4, name: 'Rognons de bœuf', price: 1000, unit: 'kg', category: 'Bœuf', image: '/images/products/beef.png' },
  { id: 5, name: 'Tripes de bœuf', price: 800, unit: 'kg', category: 'Bœuf', image: '/images/products/beef.png' },
  { id: 6, name: 'Queue de bœuf', price: 1600, unit: 'kg', category: 'Bœuf', image: '/images/products/beef.png' },

  // Poulet
  { id: 7, name: 'Cuisse de poulet', price: 750, unit: 'pièce', category: 'Poulet', image: '/images/products/chicken.png' },
  { id: 8, name: 'Poulet entier', price: 3500, unit: 'pièce', category: 'Poulet', image: '/images/products/chicken.png' },
  { id: 9, name: 'Ailes de poulet', price: 500, unit: 'pièce', category: 'Poulet', image: '/images/products/chicken.png' },
  { id: 10, name: 'Blanc de poulet', price: 600, unit: 'pièce', category: 'Poulet', image: '/images/products/chicken.png' },
  { id: 11, name: 'Gésiers de poulet', price: 400, unit: 'pièce', category: 'Poulet', image: '/images/products/chicken.png' },

  // Autres
  { id: 12, name: 'Viande de mouton', price: 2000, unit: 'kg', category: 'Autres', image: '/images/products/beef.png' }, // Fallback to beef for red meat
  { id: 13, name: 'Viande de chèvre', price: 1800, unit: 'kg', category: 'Autres', image: '/images/products/beef.png' }, // Fallback to beef for red meat
  { id: 14, name: 'Saucisses', price: 1200, unit: 'kg', category: 'Autres', image: '/images/products/sausages.png' },
  { id: 15, name: 'Merguez', price: 1400, unit: 'kg', category: 'Autres', image: '/images/products/sausages.png' },
];
