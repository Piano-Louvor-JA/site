// Onda 3 F2 — docs localizadas: rotas /xx/docs com fallback pt-BR (SPEC AC2/AC4)
// RED→GREEN: estes testes falham até o localeDir resolver por locale real.
import { describe, expect, it } from 'vitest'

import { docDirFor, docCollectionFor, docLinkFor } from '~/utils/docs-locale'

const AVAILABLE = [
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
]

describe('docs localizadas — resolução de diretório (F2)', () => {
  it('pt-BR resolve para pt-BR', () => {
    expect(docDirFor('pt-BR', AVAILABLE)).toBe('pt-BR')
  })

  it('cada locale traduzida resolve para o próprio diretório', () => {
    for (const loc of AVAILABLE) {
      expect(docDirFor(loc, AVAILABLE)).toBe(loc)
    }
  })

  it('locale sem diretório cai em pt-BR (fallback sem 404)', () => {
    expect(docDirFor('xx-YY', AVAILABLE)).toBe('pt-BR')
    expect(docDirFor('', AVAILABLE)).toBe('pt-BR')
  })

  it('coleção correta por locale (docs_<sem-hífen>)', () => {
    const col = docCollectionFor
    expect(col('pt-BR')).toBe('docs_ptBR')
    expect(col('en')).toBe('docs_en')
    expect(col('pt-BR')).not.toBe('docs_en')
  })
})

// Onda 3 P2 — regressão do sidebar: stem docs/es/faq gerava /docs/docs/es/faq (regex pt-BR)
describe('docs localizadas — link do sidebar (P2 regressão)', () => {
  it('stem de locale traduzida gera link sem prefixo docs/<locale> duplicado', () => {
    expect(docLinkFor('docs/es/faq', 'es')).toBe('/docs/faq')
  })

  it('stem pt-BR (fallback, usedDir=pt-BR) gera /docs/<slug> limpo', () => {
    expect(docLinkFor('docs/pt-BR/install/linux', 'pt-BR')).toBe('/docs/install/linux')
  })

  it('todos os 12 locales geram links limpos (evita /docs/docs/xx)', () => {
    for (const loc of AVAILABLE) {
      const link = docLinkFor(`docs/${loc}/faq`, loc)
      expect(link).toBe('/docs/faq')
      expect(link.startsWith('/docs/docs/')).toBe(false)
    }
  })
})

// Onda 3 P2b — rota interna /docs/* deve ser prefixada pelo locale ativo
// (strategy prefix_except_default): em /es/docs os cards linkam /es/docs/*,
// nunca a rota pt-BR sem prefixo. Mesma semântica do localePath do nuxt-i18n.
function localePathFor(path: string, locale: string, defaultLocale = 'pt-BR'): string {
  if (!path.startsWith('/')) return path
  if (locale === defaultLocale) return path
  return `/${locale}${path}`
}

describe('docs localizadas — localePath dos links internos (P2b)', () => {
  it('pt-BR (default) mantém /docs/* sem prefixo', () => {
    expect(localePathFor('/docs/getting-started', 'pt-BR')).toBe('/docs/getting-started')
    expect(localePathFor('/docs', 'pt-BR')).toBe('/docs')
  })

  it('locale traduzida prefixa os cards do índice', () => {
    expect(localePathFor('/docs/getting-started', 'es')).toBe('/es/docs/getting-started')
    expect(localePathFor('/docs/install/windows', 'ja')).toBe('/ja/docs/install/windows')
    expect(localePathFor('/docs', 'ar')).toBe('/ar/docs')
  })

  it('todos os 11 locales não-default prefixam; pt-BR nunca', () => {
    for (const loc of AVAILABLE) {
      const link = localePathFor('/docs/faq', loc)
      if (loc === 'pt-BR') expect(link).toBe('/docs/faq')
      else expect(link).toBe(`/${loc}/docs/faq`)
    }
  })
})

it('resolve locale padrão sem lista explícita e fallback em links', () => {
  expect(docDirFor('en')).toBe('en')
  expect(docLinkFor('docs/pt-BR/faq', 'unknown')).toBe('/docs/faq')
})
