import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';

type Props = {
  products: Product[];
  onContact?: (productName: string) => void;
};

export function ProductGrid({ products, onContact }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onContact={onContact} />
      ))}
    </div>
  );
}
