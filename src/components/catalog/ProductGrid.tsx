import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';

type Props = {
  products: Product[];
  onContact?: (productName: string) => void;
};

export function ProductGrid({ products, onContact }: Props) {
  const handleContact = onContact || (() => {});

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onContact={handleContact} 
        />
      ))}
    </div>
  );
}
