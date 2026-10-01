/**
 * Exibe nome legível de país a partir do código ISO 3166-1 alpha-2.
 *
 * Painel "Audiência por País" recebe códigos crus (ex: "BR") da API de geo
 * telemetry. Este helper converte para o nome localizado via Intl.DisplayNames,
 * com fallback de locale pt-BR → en → es e fallback gracioso para o código
 * ISO cru quando o runtime não suporta Intl.DisplayNames ou o código é
 * inválido/desconhecido.
 */

export type CountryLocale = 'pt-BR' | 'en' | 'es'

const LOCALE_FALLBACK_CHAIN: CountryLocale[] = ['pt-BR', 'en', 'es']

const UNKNOWN_LABELS: Record<CountryLocale, string> = {
  'pt-BR': 'Desconhecido',
  en: 'Unknown',
  es: 'Desconocido',
}

const displayNamesCache = new Map<CountryLocale, Intl.DisplayNames>()

/** Limpa o cache de instâncias Intl.DisplayNames (isolamento entre testes). */
export function resetCountryDisplayCache(): void {
  displayNamesCache.clear()
}

function hasDisplayNamesSupport(): boolean {
  return typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function'
}

function getDisplayNames(locale: CountryLocale): Intl.DisplayNames | null {
  if (!hasDisplayNamesSupport()) return null

  const candidates =
    locale === LOCALE_FALLBACK_CHAIN[0]
      ? LOCALE_FALLBACK_CHAIN
      : [locale, ...LOCALE_FALLBACK_CHAIN.filter((l) => l !== locale)]

  for (const candidate of candidates) {
    const cached = displayNamesCache.get(candidate)
    if (cached) return cached
    try {
      const dn = new Intl.DisplayNames([candidate], { type: 'region' })
      displayNamesCache.set(candidate, dn)
      return dn
    } catch {
      // Locale não suportado neste runtime — tenta o próximo do fallback chain
    }
  }
  return null
}

export function formatCountryName(
  code: string | null | undefined,
  locale: CountryLocale = 'pt-BR',
): string {
  const raw = (code ?? '').trim()
  if (!raw || raw.toLowerCase() === 'unknown') {
    return UNKNOWN_LABELS[locale] ?? UNKNOWN_LABELS['pt-BR']
  }

  const iso = raw.toUpperCase()
  const dn = getDisplayNames(locale)
  if (dn) {
    try {
      const name = dn.of(iso)
      if (name && name !== iso) return name
    } catch {
      // Código inválido/desconhecido — cai para o ISO cru abaixo
    }
  }
  return iso
}
