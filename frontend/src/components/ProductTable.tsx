import { Product } from '../types';
import StockBadge from './StockBadge';
import QuantityEditor from './QuantityEditor';

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
  onUpdate: (updated: Product) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: 'bg-blue-100 text-blue-700',
  Clothing: 'bg-purple-100 text-purple-700',
  Food: 'bg-orange-100 text-orange-700',
  Furniture: 'bg-amber-100 text-amber-700',
  Sports: 'bg-green-100 text-green-700',
  Home: 'bg-teal-100 text-teal-700',
  Books: 'bg-indigo-100 text-indigo-700',
  Beauty: 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-700',
};

export default function ProductTable({ products, onDelete, onUpdate }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-3">📦</div>
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Try adjusting your search or add a new product</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Product</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Category</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">SKU</th>
            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Price</th>
            <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Quantity</th>
            <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map(product => (
            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                {product.description && <div className="text-xs text-gray-400 truncate max-w-xs">{product.description}</div>}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Other']}`}>
                  {product.category}
                </span>
              </td>
              <td className="py-3 px-4 text-xs text-gray-500 font-mono">{product.sku}</td>
              <td className="py-3 px-4 text-right font-semibold text-gray-800 text-sm">${product.price.toFixed(2)}</td>
              <td className="py-3 px-4">
                <div className="flex justify-center">
                  <QuantityEditor product={product} onUpdate={onUpdate} />
                </div>
              </td>
              <td className="py-3 px-4 text-center"><StockBadge quantity={product.quantity} /></td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => { if (window.confirm(`Delete "${product.name}"?`)) onDelete(product.id); }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-sm px-2 py-1 rounded transition-all"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
