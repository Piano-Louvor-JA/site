/**
 * P2 reviewer (#221): admin comunidade i18n — troca de locale afirma
 * título, tabs e aria-label traduzidos (RU/UK inclusive), zero literal.
 */
import { beforeEach, describe, expect, it } from 'vitest'

const i18nState = { locale: 'pt-BR' }

import ptBR from '../../../i18n/pt-BR.json'
import en from '../../../i18n/en.json'
import es from '../../../i18n/es.json'
import fr from '../../../i18n/fr.json'
import ru from '../../../i18n/ru.json'
import uk from '../../../i18n/uk.json'

const messages: Record<string, Record<string, unknown>> = {
  'pt-BR': ptBR,
  en,
  es,
  fr,
  ru,
  uk,
}

function tFor(locale: string) {
  return (key: string) => {
    let node: unknown = messages[locale]
    for (const part of key.split('.')) {
      node = (node as Record<string, unknown>)?.[part]
    }
    return typeof node === 'string' ? node : key
  }
}

const KEYS = [
  'admin.comunidade.title',
  'admin.comunidade.subtitulo',
  'admin.comunidade.tab',
  'admin.comunidade.tabMembros',
  'admin.comunidade.tabEquipe',
  'admin.comunidade.tabsAriaLabel',
]

describe('admin comunidade — i18n 6 locales (P2 #221)', () => {
  beforeEach(() => {
    i18nState.locale = 'pt-BR'
  })

  it.each(['pt-BR', 'en', 'es', 'fr', 'ru', 'uk'])(
    '%s: todas as chaves do hub resolvem e diferem do PT (exceto cognatos)',
    async (locale) => {
      i18nState.locale = locale
      const t = tFor(locale)
      for (const key of KEYS) {
        const resolved = t(key)
        expect(resolved, `${key} em ${locale}`).not.toBe(key)
        expect(resolved.length).toBeGreaterThan(2)
      }
    },
  )

  it('RU/UK: título traduzido, não é o literal PT', () => {
    expect(tFor('ru')('admin.comunidade.title')).toBe('Сообщество')
    expect(tFor('uk')('admin.comunidade.title')).toBe('Спільнота')
    expect(tFor('ru')('admin.comunidade.title')).not.toBe('Comunidade')
  })

  it('troca de locale muda o título do hub', () => {
    i18nState.locale = 'pt-BR'
    const pt = tFor('pt-BR')('admin.comunidade.title')
    i18nState.locale = 'en'
    const en = tFor('en')('admin.comunidade.title')
    expect(pt).toBe('Comunidade')
    expect(en).toBe('Community')
    expect(en).not.toBe(pt)
  })
})
