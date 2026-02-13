import { getRequestConfig } from 'next-intl/server';

export const locales = ['pt', 'ja'] as const;
export const defaultLocale = 'pt' as const;
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
