import { useState } from 'react';
import { createProduct } from '../api';
import { Product } from '../types';

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Furniture', 'Sports', 'Home', 'Books', 'Beauty', 'Other'];

interface Props {
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export default function AddProductModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({ name: '', category: 'Electronics', price: '', quantity: '0', description: '', sku: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.sku || !form.price) { setError('Name, SKU and Price are required.'); return; }
    setLoading(true);
    try {
      const product = await createProduct({
        name: form.name, category: form.category,
        price: parseFloat(form.price), quantity: parseInt(form.quantity) || 0,
        description: form.description, sku: form.sku,
      });
      onAdd(product);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type} placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          {field('Product Name *', 'name', 'text', 'e.g. iPhone 15')}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {field('SKU *', 'sku', 'text', 'e.g. ELEC-999')}
          <div className="grid grid-cols-2 gap-3">
            {field('Price ($) *', 'price', 'number', '0.00')}
            {field('Quantity', 'quantity', 'number', '0')}
          </div>
          {field('Description', 'description', 'text', 'Optional description')}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors">
              {loading ? 'Adding…' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
