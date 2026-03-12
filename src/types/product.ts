// ═══════════════════════════════════════════════════
// Types matching the Real Pan API (api.realpan.jp)
// ═══════════════════════════════════════════════════

export type BilingualText = {
  pt: string;
  ja: string;
};

/** Product as returned by GET /api/products */
export interface ApiProduct {
  id: string;
  hinban: string;
  janCode: string | null;
  slug: string;

  namePt: string;
  nameJa: string;
  descriptionPt: string | null;
  descriptionJa: string | null;
  shortDescPt: string | null;
  shortDescJa: string | null;

  categoryId: string;
  category: ApiCategory | null;

  images: string[];
  primaryImage: string | null;

  // Preços — inteiro em YEN (sem centavos)
  originalPrice: number;       // Preço base (atacado PJ)
  retailMarkup: number;        // Ex: 0.6 → varejo = originalPrice / 0.6
  promoPrice: number | null;
  promoStartDate: string | null;
  promoEndDate: string | null;

  // Venda atacado
  wholesaleUnit: 'UNIT' | 'BOX';
  unitsPerBox: number | null;
  boxPrice: number | null;

  // Especificações
  weight: string | null;
  weightGrams: number | null;
  quantityInfo: string | null;
  storageType: 'AMBIENT' | 'FROZEN_READY' | 'FROZEN_RAW' | 'REFRIGERATED';
  shelfLife: string | null;
  shelfLifeDays: number | null;
  allergens: string[];

  // Stock
  stock: number;

  // Flags
  isActive: boolean;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isOnSale: boolean;

  createdAt: string;
  updatedAt: string;
}

/** Category as returned by GET /api/categories */
export interface ApiCategory {
  id: string;
  namePt: string;
  nameJa: string;
  slug: string;
  descriptionPt: string | null;
  descriptionJa: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
}

/** Normalized product for frontend components */
export interface Product {
  id: string;
  slug: string;
  hinban: string;
  janCode: string | null;
  name: BilingualText;
  description: BilingualText;
  shortDesc: BilingualText;
  image: string;
  images: string[];
  categoryId: string;
  categoryName: BilingualText;

  // Preços calculados (YEN inteiro)
  retailPrice: number;         // Preço varejo PF (com markup)
  retailPriceWithTax: number;  // Preço PF + 8% imposto
  wholesalePrice: number;      // Preço atacado PJ (originalPrice)
  promoPrice: number | null;
  hasPromo: boolean;

  // Atacado
  wholesaleUnit: 'UNIT' | 'BOX';
  unitsPerBox: number | null;
  boxPrice: number | null;

  // Specs
  weight: string | null;
  quantityInfo: string | null;
  storageType: string;
  shelfLife: string | null;
  allergens: string[];
  stock: number;

  // Flags
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
}

/** Category for frontend */
export interface Category {
  id: string;
  name: BilingualText;
  slug: string;
  description: BilingualText;
  image: string | null;
  sortOrder: number;
}

/** Cart item */
export interface CartItem {
  productId: string;
  slug: string;
  name: BilingualText;
  image: string;
  unitPrice: number;        // Preço unitário (PF ou PJ dependendo do tipo)
  unitPriceWithTax: number; // Com imposto
  quantity: number;
  wholesaleUnit: 'UNIT' | 'BOX';
  unitsPerBox: number | null;
  stock: number;
}

/** Customer type */
export type CustomerType = 'PF' | 'PJ';
