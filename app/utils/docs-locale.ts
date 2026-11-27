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
  'it',
  'nl',
  'pl',
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

/**
 * Onda 3 P2 — link de navegação do sidebar a partir do stem da coleção.
 * Corrige regressão: regex fixa em docs/pt-BR/ gerava /docs/docs/<locale>/...
 * quando o conteúdo vinha da coleção do locale (stem docs/es/faq).
 */
export function docLinkFor(stem: string, locale: string): string {
  const dir = docDirFor(locale)
  return `/docs/${stem.replace(new RegExp(`^.*docs/${dir}/?`), '')}`
}
