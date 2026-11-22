/**
 * Onda 3 F2 — resolução de locale para docs localizadas.
 * Regra SPEC AC4: locale com coleção própria consulta a própria coleção;
 * sem conteúdo (ou locale desconhecida) → fallback pt-BR, nunca 404.
 */
export const DOCS_AVAILABLE_LOCALES = [
  'pt-BR',
  'en',
  'es',
  'ru',
  'uk',
  'fr',
  'ja',
  'ko',
  'zh',
  'tr',
  'ar',
  'hi',
] as const

export type DocsLocale = (typeof DOCS_AVAILABLE_LOCALES)[number]

export function docDirFor(
  locale: string,
  available: readonly string[] = DOCS_AVAILABLE_LOCALES,
): string {
  if (available.includes(locale)) return locale
  return 'pt-BR'
}

export function docCollectionFor(locale: string): string {
  return `docs_${docDirFor(locale).replace('-', '')}`
}
