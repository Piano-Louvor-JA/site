import { afterEach, describe, expect, it } from 'vitest'
import { formatCountryName, resetCountryDisplayCache } from '~/utils/country-display'

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
})
