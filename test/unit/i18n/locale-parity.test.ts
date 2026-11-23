import { describe, expect, it } from 'vitest'
import ptBR from '../../../i18n/pt-BR.json'
import en from '../../../i18n/en.json'
import es from '../../../i18n/es.json'
import ru from '../../../i18n/ru.json'
import uk from '../../../i18n/uk.json'
import fr from '../../../i18n/fr.json'
import ja from '../../../i18n/ja.json'
import ko from '../../../i18n/ko.json'
import zh from '../../../i18n/zh.json'
import tr from '../../../i18n/tr.json'
import rawPtBR from '../../../assets/i18n/pt-BR.json'
import rawEn from '../../../assets/i18n/en.json'
import rawEs from '../../../assets/i18n/es.json'
import rawRu from '../../../assets/i18n/ru.json'
import rawUk from '../../../assets/i18n/uk.json'
import rawFr from '../../../assets/i18n/fr.json'

type Messages = Record<string, unknown>

function flatten(obj: Messages, prefix = ''): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flatten(value as Messages, path))
    } else {
      out[path] = value
    }
  }
  return out
}

function placeholders(value: unknown): string[] {
  if (typeof value !== 'string') return []
  return value.match(/\{[a-zA-Z]+\}/g) ?? []
}

const RUNTIME_LOCALES: Record<string, Messages> = {
  'pt-BR': ptBR as Messages,
  en: en as Messages,
  es: es as Messages,
  ru: ru as Messages,
  uk: uk as Messages,
  fr: fr as Messages,
  ja: ja as Messages,
  ko: ko as Messages,
  zh: zh as Messages,
  tr: tr as Messages,
}

const RAW_LOCALES: Record<string, Messages> = {
  'pt-BR': rawPtBR as Messages,
  en: rawEn as Messages,
  es: rawEs as Messages,
  ru: rawRu as Messages,
  uk: rawUk as Messages,
  fr: rawFr as Messages,
}

describe('i18n locale parity contract', () => {
  const baseFlat = flatten(RUNTIME_LOCALES['pt-BR'])
  const baseKeys = Object.keys(baseFlat).sort()

  it('pt-BR runtime base has the expected key count', () => {
    expect(baseKeys.length).toBeGreaterThanOrEqual(600)
  })

  for (const locale of ['en', 'es', 'ru', 'uk', 'fr', 'ja', 'ko', 'zh', 'tr']) {
    it(`runtime locale ${locale} has exactly the same keys as pt-BR`, () => {
      const flat = flatten(RUNTIME_LOCALES[locale])
      expect(Object.keys(flat).sort()).toEqual(baseKeys)
    })
  }

  const rawBaseFlat = flatten(RAW_LOCALES['pt-BR'])
  const rawBaseKeys = Object.keys(rawBaseFlat).sort()

  for (const locale of ['en', 'es', 'ru', 'uk', 'fr']) {
    it(`raw locale ${locale} has exactly the same keys as pt-BR`, () => {
      const flat = flatten(RAW_LOCALES[locale])
      expect(Object.keys(flat).sort()).toEqual(rawBaseKeys)
    })
  }

  for (const locale of ['ru', 'uk', 'fr', 'ja', 'ko', 'zh', 'tr']) {
    it(`runtime locale ${locale} preserves placeholders from pt-BR`, () => {
      const flat = flatten(RUNTIME_LOCALES[locale])
      for (const key of baseKeys) {
        expect(placeholders(flat[key]).sort()).toEqual(placeholders(baseFlat[key]).sort())
      }
    })
  }

  for (const locale of ['ru', 'uk', 'fr']) {
    it(`raw locale ${locale} preserves placeholders from pt-BR`, () => {
      const flat = flatten(RAW_LOCALES[locale])
      for (const key of rawBaseKeys) {
        expect(placeholders(flat[key]).sort()).toEqual(placeholders(rawBaseFlat[key]).sort())
      }
    })
  }
})
