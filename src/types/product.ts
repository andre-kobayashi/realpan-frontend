export type LocaleText = {
  pt: string;
  ja: string;
};

export type StorageType = 'frozen' | 'refrigerated' | 'ambient';

export type Product = {
  id: string;
  slug: string;
  name: LocaleText;
  subtitle?: LocaleText;
  description: LocaleText;
  image: string;
  category: string;
  storageType: StorageType;
  isNew?: boolean;
  isBestseller?: boolean;
  sales: {
    pj: { enabled: boolean; unit: LocaleText };
    pf: { enabled: boolean; unit: LocaleText };
  };
  weight?: LocaleText;
  tags: string[];
};

export type Category = {
  id: string;
  name: LocaleText;
};
