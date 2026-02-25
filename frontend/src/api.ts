import { Product } from './types';

const BASE = '/api';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create product');
  }
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${BASE}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function updateQuantity(id: number, quantity: number): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}/quantity`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Failed to update quantity');
  return res.json();
}
