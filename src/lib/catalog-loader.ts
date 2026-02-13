import type { Product } from '@/types/product';

// Tipo para produtos cru do JSON
type RawProduct = {
  hinban: string;
  slug: string;
  name: { pt: string; ja: string };
  description?: { pt: string; ja: string };
  weight?: string;
  jan?: string;
  storageType?: 'frozen' | 'refrigerated' | 'ambient';
  category?: string;
  image?: string;
};

// Tipo para arquivos JSON
type CatalogFile = 
  | { products: RawProduct[] }
  | { category: string; storageType?: string; items: RawProduct[] };

// Mapeamento: arquivo → categoria do sistema
const CATEGORY_MAP: Record<string, string> = {
  'breads':       'breads',
  'frozen':       'frozen',
  'salgados':     'savory',
  'pasteis':      'pastel',
  'salgadinhos':  'others',
  'sweets':       'sweets',
  'temperos':     'spices',
  'cakes':        'cakes',
};

// Adiciona campos faltantes e normaliza
function normalizeProduct(
  raw: RawProduct,
  categoryId: string,
  fileStorageType?: string
): Product {
  // Determina storageType
  const storageType = raw.storageType || fileStorageType || 'ambient';
  
  return {
    id: raw.hinban,
    slug: raw.slug || raw.hinban,
    name: raw.name,
    subtitle: undefined, // Não temos no novo schema
    description: raw.description || { pt: '', ja: '' },
    image: raw.image || `/products/${raw.hinban}.webp`,
    category: categoryId,
    storageType: storageType as 'frozen' | 'refrigerated' | 'ambient',
    
    // Campos que não estão nos JSONs — valores default
    isBestseller: false,
    isNew: false,
    
    // Todos os produtos disponíveis para PJ e PF (default)
    sales: {
      pj: { enabled: true,  unit: { pt: 'caixa', ja: 'ケース' } },
      pf: { enabled: true,  unit: { pt: 'unid',  ja: '個' } },
    },
    
    weight: raw.weight ? { pt: raw.weight, ja: raw.weight } : undefined,
    tags: [categoryId], // Tag simples por categoria
  };
}

// Carrega um arquivo de catálogo e retorna produtos normalizados
async function loadCatalogFile(
  filename: string,
  categoryId: string
): Promise<Product[]> {
  try {
    const data = await import(`@/data/catalog/${filename}.json`);
    const file: CatalogFile = data.default || data;
    
    let rawProducts: RawProduct[] = [];
    let fileStorageType: string | undefined;
    
    // Normaliza estrutura: products vs items
    if ('products' in file) {
      rawProducts = file.products;
    } else if ('items' in file) {
      rawProducts = file.items;
      fileStorageType = file.storageType;
    }
    
    return rawProducts.map((raw) => 
      normalizeProduct(raw, categoryId, fileStorageType)
    );
  } catch (error) {
    console.warn(`Erro ao carregar ${filename}.json:`, error);
    return [];
  }
}

// Carrega TODOS os produtos do catálogo
export async function loadAllProducts(): Promise<Product[]> {
  const catalogFiles = Object.keys(CATEGORY_MAP);
  
  const productArrays = await Promise.all(
    catalogFiles.map((filename) => 
      loadCatalogFile(filename, CATEGORY_MAP[filename])
    )
  );
  
  // Une todos em um array único
  return productArrays.flat();
}

// Carrega categorias
export async function loadCategories() {
  try {
    const data = await import('@/data/catalog/categories.json');
    return (data.default || data).categories;
  } catch (error) {
    console.warn('Erro ao carregar categories.json:', error);
    return [];
  }
}
