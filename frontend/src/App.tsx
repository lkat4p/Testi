import { useEffect, useState, useMemo } from 'react';
import { fetchProducts, deleteProduct } from './api';
import { Product } from './types';
import ProductTable from './components/ProductTable';
import AddProductModal from './components/AddProductModal';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('Failed to load products. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category))).sort()], [products]);

  const filtered = useMemo(() =>
    products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }), [products, search, categoryFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    lowStock: products.filter(p => p.quantity < 5).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
  }), [products]);

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setProducts(ps => ps.filter(p => p.id !== id));
  };

  const handleUpdate = (updated: Product) => {
    setProducts(ps => ps.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">📦</div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Inventory Manager</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Track your products in real time</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-base leading-none">+</span> Add Product
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Low Stock Alerts</p>
            <p className={`text-3xl font-bold mt-1 ${stats.lowStock > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.lowStock}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Inventory Value</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-gray-200 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text" placeholder="Search products, SKUs…"
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${categoryFilter === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-3 animate-pulse">⏳</div>
              <p>Loading products…</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <div className="text-4xl mb-3">⚠️</div>
              <p>{error}</p>
            </div>
          ) : (
            <ProductTable products={filtered} onDelete={handleDelete} onUpdate={handleUpdate} />
          )}

          {!loading && !error && (
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {filtered.length} of {products.length} products
            </div>
          )}
        </div>
      </main>

      {showModal && <AddProductModal onClose={() => setShowModal(false)} onAdd={p => setProducts(ps => [...ps, p])} />}
    </div>
  );
}
