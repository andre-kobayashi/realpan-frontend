import Image from 'next/image';
import { ProductBadges } from './ProductBadges';
import { ProductMeta } from './ProductMeta';
import type { Product } from '@/types/product';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <div className="border border-neutral-200 bg-white p-4">
      {/* Image */}
      <div className="relative mb-4 aspect-square w-full bg-neutral-100">
        {typeof product.image === 'string' && product.image.length > 0 ? (
          <Image
            src={product.image}
            alt={product.name.ja}
            fill
            className="object-contain"
          />
        ) : null}
      </div>

      <ProductBadges
        storage={product.storage}
        sell={product.sell}
      />

      <div className="mt-3">
        <ProductMeta
          name={product.name}
          description={product.description}
        />
      </div>
    </div>
  );
}