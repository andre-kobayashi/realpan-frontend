export type BilingualText = {
  pt: string;
  ja: string;
};

export type Product = {
  id: string;
  slug: string;
  name: BilingualText;
  description: BilingualText;
  image: string;
  category: string;
  
  // Preço (André vai preencher depois)
  price: number;
  originalPrice?: number; // Para mostrar desconto
  
  // Info adicional
  weight?: string;
  quantity?: string; // Ex: "3個入り", "1袋"
  jan?: string;
  storageType?: 'refrigerated' | 'frozen' | 'ambient';
  
  // Badges opcionais
  isNew?: boolean;
  isBestseller?: boolean;
  freeShipping?: boolean;
};

export type Category = {
  id: string;
  name: BilingualText;
  slug: string;
  description?: BilingualText;
  icon?: string;
};

export type RawProduct = Omit<Product, 'id' | 'slug'> & {
  hinban: string;
  slug?: string;
};