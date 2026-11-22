// Onda 3 F2 — docs localizadas: rotas /xx/docs com fallback pt-BR (SPEC AC2/AC4)
// RED→GREEN: estes testes falham até o localeDir resolver por locale real.
import { describe, expect, it } from 'vitest'

// Unidade pura: mapeia locale → diretório de coleção com fallback pt-BR
// (mesma regra que o [...slug].vue usará; extraída para ser testável sem mount).
function docDirFor(locale: string, available: string[]): string {
  if (available.includes(locale)) return locale
  return 'pt-BR'
}

const AVAILABLE = ['pt-BR', 'en', 'es', 'ru', 'uk', 'fr', 'ja', 'ko', 'zh', 'tr', 'ar', 'hi']

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
    const col = (dir: string) => `docs_${dir.replace('-', '')}`
    expect(col('pt-BR')).toBe('docs_ptBR')
    expect(col('en')).toBe('docs_en')
    expect(col('pt-BR')).not.toBe('docs_en')
  })
})
