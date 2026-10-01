import { afterEach, describe, expect, it } from 'vitest'
import {
  formatCountryName,
  resetCountryDisplayCache,
  type CountryLocale,
} from '~/utils/country-display'

const REAL_DISPLAY_NAMES = Intl.DisplayNames

function stubDisplayNames(impl?: (code: string) => string) {
  const RealIntl = Intl as typeof Intl
  class StubDisplayNames {
    constructor(_locales: string | string[], _options?: { type?: string }) {}
    of(code: string): string {
      if (!impl) throw new RangeError('invalid_code')
      return impl(code)
    }
  }
  Object.defineProperty(RealIntl, 'DisplayNames', {
    configurable: true,
    writable: true,
    value: impl === undefined ? undefined : StubDisplayNames,
  })
}

afterEach(() => {
  Object.defineProperty(Intl, 'DisplayNames', {
    configurable: true,
    writable: true,
    value: REAL_DISPLAY_NAMES,
  })
  resetCountryDisplayCache()
})

describe('formatCountryName', () => {
  it('exibe "Brasil" em vez de "BR" no locale padrão pt-BR', () => {
    expect(formatCountryName('BR')).toBe('Brasil')
  })

  it('exibe nome localizado por locale (en/es)', () => {
    expect(formatCountryName('ES', 'en')).toBe('Spain')
    expect(formatCountryName('ES', 'es')).toBe('España')
  })

  it('normaliza código em minúsculas e com espaços', () => {
    expect(formatCountryName(' br ')).toBe('Brasil')
  })

  it('aceita "unknown" (qualquer casing) exibindo rótulo localizado', () => {
    expect(formatCountryName('unknown')).toBe('Desconhecido')
    expect(formatCountryName('UNKNOWN', 'en')).toBe('Unknown')
    expect(formatCountryName('Unknown', 'es')).toBe('Desconocido')
  })

  it('código vazio/null/undefined exibe rótulo localizado', () => {
    expect(formatCountryName('')).toBe('Desconhecido')
    expect(formatCountryName(null)).toBe('Desconhecido')
    expect(formatCountryName(undefined, 'en')).toBe('Unknown')
  })

  it('faz fallback para o código ISO cru quando o código é inválido', () => {
    const RealDN = REAL_DISPLAY_NAMES
    class ThrowingDN {
      constructor(_l: string | string[], _o?: { type?: string }) {}
      of(_code: string): string {
        throw new RangeError('invalid_code')
      }
    }
    Object.defineProperty(Intl, 'DisplayNames', {
      configurable: true,
      writable: true,
      value: ThrowingDN,
    })
    expect(formatCountryName('XX')).toBe('XX')
    Object.defineProperty(Intl, 'DisplayNames', {
      configurable: true,
      writable: true,
      value: RealDN,
    })
  })

  it('faz fallback para o código ISO cru quando Intl.DisplayNames não existe', () => {
    stubDisplayNames(undefined)
    expect(formatCountryName('BR')).toBe('BR')
    expect(formatCountryName('unknown')).toBe('Desconhecido')
  })

  it('faz fallback para o ISO cru quando of() devolve o próprio código', () => {
    stubDisplayNames((code) => code)
    expect(formatCountryName('BR')).toBe('BR')
  })

  it('faz fallback para o ISO cru quando of() não devolve nome', () => {
    stubDisplayNames(() => '')
    expect(formatCountryName('BR')).toBe('BR')
  })

  it('reusa o Intl.DisplayNames em cache na segunda consulta do mesmo locale', () => {
    expect(formatCountryName('BR')).toBe('Brasil')
    expect(formatCountryName('PT')).toBe('Portugal')
  })

  it('tenta o próximo locale quando o primeiro não é suportado', () => {
    class SelectiveDisplayNames {
      constructor(locales: string | string[]) {
        const locale = Array.isArray(locales) ? locales[0] : locales
        if (locale !== 'en') throw new RangeError(locale)
      }
      of(code: string): string {
        return code === 'BR' ? 'Brazil' : code
      }
    }
    Object.defineProperty(Intl, 'DisplayNames', {
      configurable: true,
      writable: true,
      value: SelectiveDisplayNames,
    })
    expect(formatCountryName('BR')).toBe('Brazil')
  })

  it('devolve o ISO cru quando nenhum locale do fallback é suportado', () => {
    class AlwaysThrowDisplayNames {
      constructor() {
        throw new RangeError('unsupported')
      }
      of(): string {
        return 'não chega'
      }
    }
    Object.defineProperty(Intl, 'DisplayNames', {
      configurable: true,
      writable: true,
      value: AlwaysThrowDisplayNames,
    })
    expect(formatCountryName('BR')).toBe('BR')
  })

  it('usa o rótulo pt-BR quando o locale pedido não tem rótulo', () => {
    expect(formatCountryName('', 'de' as CountryLocale)).toBe('Desconhecido')
  })
})
