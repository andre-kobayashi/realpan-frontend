import type { Product, Category, RawProduct } from '@/types/product';

// ═══════════════════════════════════════════════════
// ORDEM DAS CATEGORIAS - PÃES PRIMEIRO, TODOS NO FINAL
// ═══════════════════════════════════════════════════
const CATEGORY_ORDER = [
  'breads',        // Pães - CARRO CHEFE
  'pasteis',       // Pastéis
  'salgados',      // Salgados
  'salgadinhos',   // Salgadinhos
  'frozen',        // Congelados
  'sweets',        // Doces
  'cakes',         // Bolos
  'temperos',      // Temperos
  'all',           // Todos - NO FINAL
];

function normalizeProduct(raw: RawProduct, categoryId: string): Product {
  return {
    id: raw.hinban,
    slug: raw.slug || raw.hinban,
    name: raw.name,
    description: raw.description || { pt: '', ja: '' },
    image: raw.image || `/products/${raw.hinban}.webp`,
    category: categoryId,
    
    // Preço - André vai preencher
    price: (raw as any).price || 0,
    originalPrice: (raw as any).originalPrice,
    
    // Info adicional
    weight: raw.weight,
    quantity: (raw as any).quantity,
    jan: raw.jan,
    storageType: raw.storageType,
    
    // Badges
    isNew: (raw as any).isNew || false,
    isBestseller: (raw as any).isBestseller || false,
    freeShipping: (raw as any).freeShipping || false,
  };
}

export async function loadAllProducts(): Promise<Product[]> {
  const files = [
    'breads',
    'pasteis',
    'salgados',
    'salgadinhos',
    'frozen',
    'sweets',
    'cakes',
    'temperos',
  ];

  const products: Product[] = [];

  for (const file of files) {
    try {
      const mod = await import(`@/data/catalog/${file}.json`);
      const raw = mod.default || mod;
      
      if (raw.products && Array.isArray(raw.products)) {
        raw.products.forEach((p: RawProduct) => {
          products.push(normalizeProduct(p, file));
        });
      }
    } catch (err) {
      console.warn(`Failed to load ${file}.json:`, err);
    }
  }

  return products;
}

export async function loadCategories(): Promise<Category[]> {
  try {
    const mod = await import('@/data/catalog/categories.json');
    const raw = mod.default || mod;
    
    if (!raw.categories || !Array.isArray(raw.categories)) {
      return getDefaultCategories();
    }

    // Criar mapa de categorias (aceita com ou sem slug)
    const categoriesMap = new Map<string, Category>();
    
    raw.categories.forEach((cat: any) => {
      categoriesMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.id,
        description: cat.description,
        icon: cat.icon,
      });
    });

    // Reordenar conforme CATEGORY_ORDER
    const orderedCategories: Category[] = [];
    
    for (const catId of CATEGORY_ORDER) {
      const cat = categoriesMap.get(catId);
      if (cat) {
        orderedCategories.push(cat);
      }
    }

    return orderedCategories;
  } catch (err) {
    console.warn('Failed to load categories.json:', err);
    return getDefaultCategories();
  }
}

function getDefaultCategories(): Category[] {
  return [
    {
      id: 'breads',
      name: { pt: 'Pães', ja: 'パン' },
      slug: 'breads',
    },
    {
      id: 'pasteis',
      name: { pt: 'Pastéis', ja: 'パステル' },
      slug: 'pasteis',
    },
    {
      id: 'salgados',
      name: { pt: 'Salgados', ja: '塩味' },
      slug: 'salgados',
    },
    {
      id: 'frozen',
      name: { pt: 'Congelados', ja: '冷凍食品' },
      slug: 'frozen',
    },
    {
      id: 'all',
      name: { pt: 'Todos', ja: 'すべて' },
      slug: 'all',
    },
  ];
}