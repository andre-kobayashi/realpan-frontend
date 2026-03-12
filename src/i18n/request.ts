import { getRequestConfig } from 'next-intl/server';

export const locales = ['ja', 'pt'] as const;
export const defaultLocale = 'ja' as const; // ✅ JAPONÊS COMO PADRÃO
export type Locale = (typeof locales)[number];

// Namespaces registrados — adicione novos arquivos aqui ao criar novas páginas
const namespaces = [
  'navigation',
  'home',
  'about',
  'feature',
  'services',
  'products',
  'contact',
  'footer',
  'privacy',
  'terms',
  'auth',
  'addresses',
  'legal',
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  // Carrega e mescla todos os arquivos de mensagens do locale
  const moduleEntries = await Promise.all(
    namespaces.map(async (ns) => {
      const mod = await import(`../messages/${locale}/${ns}.json`);
      return [ns, mod.default] as [string, Record<string, unknown>];
    })
  );

  const messages = Object.fromEntries(moduleEntries);

  return { locale, messages };
});