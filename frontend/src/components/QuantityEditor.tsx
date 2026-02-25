import { useState } from 'react';
import { updateQuantity } from '../api';
import { Product } from '../types';

interface Props {
  product: Product;
  onUpdate: (updated: Product) => void;
}

export default function QuantityEditor({ product, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  const change = async (delta: number) => {
    const newQty = Math.max(0, product.quantity + delta);
    setLoading(true);
    try {
      const updated = await updateQuantity(product.id, newQty);
      onUpdate(updated);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => change(-1)}
        disabled={loading || product.quantity === 0}
        className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 font-bold text-gray-600 transition-colors"
      >
        −
      </button>
      <span className="w-10 text-center font-semibold text-gray-800">{product.quantity}</span>
      <button
        onClick={() => change(1)}
        disabled={loading}
        className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 font-bold text-gray-600 transition-colors"
      >
        +
      </button>
    </div>
  );
}
