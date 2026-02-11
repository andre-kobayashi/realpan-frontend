export type LocaleText = {
  pt: string;
  ja: string;
};

export type SellMode = 'box' | 'unit';
export type StorageType = 'ambient' | 'chilled' | 'frozen';

export type Product = {
  id: string;
  name: LocaleText;
  description?: LocaleText;
  image?: string;
  storage?: StorageType;
  sell?: {
    allowed?: SellMode[];
  };
};