export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  sku: string;
}

export type StockLevel = 'low' | 'medium' | 'good';

export function getStockLevel(quantity: number): StockLevel {
  if (quantity < 5) return 'low';
  if (quantity < 20) return 'medium';
  return 'good';
}
