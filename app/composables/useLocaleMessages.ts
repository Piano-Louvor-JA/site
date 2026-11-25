/**
 * Access raw locale messages bypassing vue-i18n's AST compilation.
 *
 * @nuxtjs/i18n pre-compiles all locale JSON into AST nodes at build time.
 * This means $tm() and messages.value return objects like {t:0,b:{t:2,...}}
 * instead of the original strings/arrays.
 *
 * We import the raw locale data from TS modules in assets/i18n/ which
 * bypass @nuxtjs/i18n's AST transform entirely.
 */

import ptBR from '../../assets/i18n/pt-BR'
import en from '../../assets/i18n/en'
import es from '../../assets/i18n/es'
import ru from '../../assets/i18n/ru'
import uk from '../../assets/i18n/uk'
import fr from '../../assets/i18n/fr'
// ?raw keeps these JSON catalogues out of the i18n AST compilation.
import jaRaw from '../../assets/i18n/ja.json?raw'
import koRaw from '../../assets/i18n/ko.json?raw'
import zhRaw from '../../assets/i18n/zh.json?raw'
import trRaw from '../../assets/i18n/tr.json?raw'
import arRaw from '../../assets/i18n/ar.json?raw'
import hiRaw from '../../assets/i18n/hi.json?raw'

const localeData: Record<string, Record<string, unknown>> = {
  'pt-BR': ptBR,
  en,
  es,
  ru,
  uk,
  fr,
  ja: JSON.parse(jaRaw),
  ko: JSON.parse(koRaw),
  zh: JSON.parse(zhRaw),
  tr: JSON.parse(trRaw),
  ar: JSON.parse(arRaw),
  hi: JSON.parse(hiRaw),
}

export function isNullish(v: unknown): boolean {
  return v === null || v === undefined
}

export function deepGet(obj: unknown, path: string): unknown {
  // Stryker disable next-line ConditionalExpression, LogicalOperator -- equivalent paths
  if (isNullish(obj)) return undefined
  const parts = path.split('.')
  let cur: unknown = obj
  for (const p of parts) {
    // Stryker disable next-line ConditionalExpression, LogicalOperator -- typeof null===object but access throws
    if (isNullish(cur)) return undefined
    // Stryker disable next-line ConditionalExpression, EqualityOperator -- equivalent for valid paths
    if (typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur
}

export function useLocaleMessages() {
  const { locale } = useI18n()

  function raw<T = unknown>(key: string): T | undefined {
    return deepGet(localeData[locale.value], key) as T | undefined
  }

  function has(key: string): boolean {
    return raw(key) !== undefined
  }

  return { raw, has }
}
