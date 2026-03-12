import api from '@/lib/api';
import type { ApiProduct, ApiCategory, Product, Category } from '@/types/product';

const TAX_RATE = 0.08; // 消費税 8%

// ═══════════════════════════════════════════════════
// Normalizar produto da API para formato do frontend
// ═══════════════════════════════════════════════════
function normalizeProduct(raw: ApiProduct): Product {
  const markup = raw.retailMarkup || 0.6;
  const retailPrice = Math.ceil(raw.originalPrice / markup);

  // Verificar se promo está ativa
  const now = new Date();
  const promoStart = raw.promoStartDate ? new Date(raw.promoStartDate) : null;
  const promoEnd = raw.promoEndDate ? new Date(raw.promoEndDate) : null;
  const promoActive = raw.promoPrice
    && (!promoStart || now >= promoStart)
    && (!promoEnd || now <= promoEnd);

  const effectiveRetailPrice = promoActive && raw.promoPrice ? raw.promoPrice : retailPrice;

  return {
    id: raw.id,
    slug: raw.slug,
    hinban: raw.hinban,
    janCode: raw.janCode,
    name: { pt: raw.namePt, ja: raw.nameJa },
    description: {
      pt: raw.descriptionPt || '',
      ja: raw.descriptionJa || '',
    },
    shortDesc: {
      pt: raw.shortDescPt || '',
      ja: raw.shortDescJa || '',
    },
    image: raw.primaryImage || (raw.images?.[0]) || `/products/${raw.hinban}.webp`,
    images: raw.images || [],
    categoryId: raw.categoryId,
    categoryName: {
      pt: raw.category?.namePt || '',
      ja: raw.category?.nameJa || '',
    },

    // Preços (YEN inteiro, arredondamento japonês para cima)
    retailPrice,
    retailPriceWithTax: Math.ceil(effectiveRetailPrice * (1 + TAX_RATE)),
    wholesalePrice: raw.originalPrice,
    promoPrice: promoActive ? raw.promoPrice : null,
    hasPromo: !!promoActive,

    // Atacado
    wholesaleUnit: raw.wholesaleUnit || 'UNIT',
    unitsPerBox: raw.unitsPerBox,
    boxPrice: raw.boxPrice,

    // Specs
    weight: raw.weight || (raw.weightGrams ? `${raw.weightGrams}g` : null),
    quantityInfo: raw.quantityInfo,
    storageType: raw.storageType || 'AMBIENT',
    shelfLife: raw.shelfLife || (raw.shelfLifeDays ? `${raw.shelfLifeDays}日` : null),
    allergens: raw.allergens || [],
    stock: raw.stock ?? 0,

    // Flags
    isNew: raw.isNew || false,
    isBestseller: raw.isBestseller || false,
    isFeatured: raw.isFeatured || false,
    isOnSale: raw.isOnSale || false,
  };
}

function normalizeCategory(raw: ApiCategory): Category {
  return {
    id: raw.id,
    name: { pt: raw.namePt, ja: raw.nameJa },
    slug: raw.slug,
    description: {
      pt: raw.descriptionPt || '',
      ja: raw.descriptionJa || '',
    },
    image: raw.image,
    sortOrder: raw.sortOrder ?? 99,
  };
}

// ═══════════════════════════════════════════════════
// API calls
// ═══════════════════════════════════════════════════
let productsCache: Product[] | null = null;
let categoriesCache: Category[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60_000; // 1 minuto

export async function loadAllProducts(): Promise<Product[]> {
  const now = Date.now();
  if (productsCache && now - lastFetchTime < CACHE_TTL) {
    return productsCache;
  }

  try {
    const { data } = await api.get<{ success: boolean; data: ApiProduct[] }>('/api/products');
    if (data.success && Array.isArray(data.data)) {
      productsCache = data.data
        .filter(p => p.isActive && p.stock > 0)
        .map(normalizeProduct);
      lastFetchTime = now;
      return productsCache;
    }
  } catch (err) {
    console.error('[catalog-loader] Failed to load products from API:', err);
  }

  // Retornar cache antigo se disponível
  return productsCache || [];
}

export async function loadProduct(idOrSlug: string): Promise<Product | null> {
  try {
    const { data } = await api.get<{ success: boolean; data: ApiProduct }>(
      `/api/products/${idOrSlug}`
    );
    if (data.success && data.data) {
      return normalizeProduct(data.data);
    }
  } catch (err) {
    console.error('[catalog-loader] Failed to load product:', err);
  }
  return null;
}

export async function loadCategories(): Promise<Category[]> {
  const now = Date.now();
  if (categoriesCache && now - lastFetchTime < CACHE_TTL) {
    return categoriesCache;
  }

  try {
    const { data } = await api.get<{ success: boolean; data: ApiCategory[] }>('/api/categories');
    if (data.success && Array.isArray(data.data)) {
      const cats = data.data
        .filter(c => c.isActive)
        .map(normalizeCategory)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      // Adicionar "Todos" no final
      cats.push({
        id: 'all',
        name: { pt: 'Todos', ja: 'すべて' },
        slug: 'all',
        description: { pt: '', ja: '' },
        image: null,
        sortOrder: 999,
      });

      categoriesCache = cats;
      return cats;
    }
  } catch (err) {
    console.error('[catalog-loader] Failed to load categories from API:', err);
  }

  return categoriesCache || [];
}

/** Limpar cache (chamar depois de login/logout para recalcular preços) */
export function clearCatalogCache() {
  productsCache = null;
  categoriesCache = null;
  lastFetchTime = 0;
}
