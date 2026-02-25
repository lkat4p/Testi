import { getStockLevel } from '../types';

interface Props { quantity: number }

export default function StockBadge({ quantity }: Props) {
  const level = getStockLevel(quantity);
  const styles = {
    low: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    good: 'bg-green-100 text-green-700 border-green-200',
  };
  const labels = { low: 'Low Stock', medium: 'Medium', good: 'In Stock' };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles[level]}`}>
      {labels[level]}
    </span>
  );
}
