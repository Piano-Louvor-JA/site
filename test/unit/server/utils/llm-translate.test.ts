import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TRANSLATE_LOCALES } from '~~/server/utils/llm-translate'

/**
 * SPEC site-email-i18n-12: translateChangelog cobre os 11 locales-alvo
 * (todos menos pt-BR, fonte), com glossário específico nos prompts de ar/hi.
 */

const EXPECTED_LOCALES = ['en', 'es', 'ru', 'uk', 'fr', 'ja', 'ko', 'zh', 'tr', 'ar', 'hi']

let mockFetch: ReturnType<typeof vi.fn>

/** Enfileira uma resposta mock por locale, na ordem de EXPECTED_LOCALES. */
function mockTranslations(contents: Record<string, string>) {
  for (const locale of EXPECTED_LOCALES) {
    mockFetch.mockResolvedValueOnce({
      choices: [{ message: { content: contents[locale] ?? `T:${locale}` } }],
    })
  }
}

describe('translateChangelog', () => {
  let translateChangelog: (text: string, fromLocale: string) => Promise<Record<string, string>>

  beforeEach(async () => {
    vi.resetModules()
    mockFetch = vi.fn()
    vi.stubGlobal('$fetch', mockFetch)
    vi.stubGlobal('useRuntimeConfig', () => ({
      llmApiKey: 'test-key',
      llmModel: 'test-model',
    }))

    const mod = await import('~~/server/utils/llm-translate')
    translateChangelog = mod.translateChangelog
  })

  it('TRANSLATE_LOCALES expõe os 11 locales-alvo (sem pt-BR)', () => {
    expect([...TRANSLATE_LOCALES].sort()).toEqual([...EXPECTED_LOCALES].sort())
  })

  it('retorna tradução para todos os 11 locales', async () => {
    mockTranslations({ en: 'English release notes', es: 'Notas en español' })

    const result = await translateChangelog('# Nova versão\n\n- Bug fix', 'pt-BR')

    expect(result.en).toBe('English release notes')
    expect(result.es).toBe('Notas en español')
    for (const locale of EXPECTED_LOCALES) {
      expect(result[locale], `${locale} deveria ter tradução`).toBeTypeOf('string')
      expect(result[locale]!.length).toBeGreaterThan(0)
    }
  })

  it('faz uma chamada por locale (11 chamadas)', async () => {
    mockTranslations({})
    await translateChangelog('Texto', 'pt-BR')
    expect(mockFetch).toHaveBeenCalledTimes(11)
  })

  it('preserves markdown structure in translation', async () => {
    mockTranslations({ en: '# New version\n\n- Bug fix' })

    const result = await translateChangelog('# Nova versão\n\n- Bug fix', 'pt-BR')

    expect(result.en).toContain('# New version')
    expect(result.en).toContain('- Bug fix')
  })

  it('prompt de ar inclui glossário فصحى cristão (تسبيح / الأدفنتست السبتيين)', async () => {
    mockTranslations({})
    await translateChangelog('Texto', 'pt-BR')

    const arCall = mockFetch.mock.calls.find((call) => {
      const body = (call[1] as { body: { messages: { content: string }[] } }).body
      return body.messages[0]!.content.includes('Modern Standard Arabic')
    })
    expect(arCall).toBeDefined()
    const prompt = (
      arCall![1] as { body: { messages: { content: string }[] } }
    ).body.messages[0]!.content.toString()
    expect(prompt).toContain('تسبيح')
    expect(prompt).toContain('الأدفنتست السبتيين')
    expect(prompt).toContain('Piano LouvorJA')
  })

  it('prompt de hi inclui registro formal adventista (उपासना / एडवेंटिस्ट)', async () => {
    mockTranslations({})
    await translateChangelog('Texto', 'pt-BR')

    const hiCall = mockFetch.mock.calls.find((call) => {
      const body = (call[1] as { body: { messages: { content: string }[] } }).body
      return body.messages[0]!.content.includes('formal Hindi')
    })
    expect(hiCall).toBeDefined()
    const prompt = (
      hiCall![1] as { body: { messages: { content: string }[] } }
    ).body.messages[0]!.content.toString()
    expect(prompt).toContain('उपासना')
    expect(prompt).toContain('सेवेन्थ-डे एडवेंटिस्ट')
  })

  it('todos os prompts pedem markdown/URLs/placeholders intactos', async () => {
    mockTranslations({})
    await translateChangelog('Texto', 'pt-BR')

    expect(mockFetch.mock.calls.length).toBe(11)
    for (const call of mockFetch.mock.calls) {
      const prompt = (
        call[1] as { body: { messages: { content: string }[] } }
      ).body.messages[0]!.content.toString()
      expect(prompt).toContain('Preserve markdown formatting exactly')
      expect(prompt).toContain('Keep URLs and placeholders untouched')
    }
  })

  it('falls back to original text on API error (catch branch)', async () => {
    for (let i = 0; i < 11; i++) mockFetch.mockRejectedValueOnce(new Error('API down'))

    const original = '# Nova versão\n- Feature'
    const result = await translateChangelog(original, 'pt-BR')

    for (const locale of EXPECTED_LOCALES) {
      expect(result[locale], `${locale} fallback`).toBe(original)
    }
  })

  it('falls back to original text on non-Error rejection (catch branch)', async () => {
    for (let i = 0; i < 11; i++) mockFetch.mockRejectedValueOnce('string error')

    const original = '# Outra versão'
    const result = await translateChangelog(original, 'pt-BR')

    expect(result.en).toBe(original)
    expect(result.ar).toBe(original)
  })

  it('falls back to original when response has no choices', async () => {
    for (let i = 0; i < 11; i++) mockFetch.mockResolvedValueOnce({})

    const result = await translateChangelog('Texto', 'pt-BR')

    expect(result.en).toBe('Texto')
    expect(result.hi).toBe('Texto')
  })

  it('returns original for one lang when that specific translation fails', async () => {
    const arIndex = EXPECTED_LOCALES.indexOf('ar')
    for (let i = 0; i < 11; i++) {
      if (i === arIndex) {
        mockFetch.mockRejectedValueOnce(new Error('ar down'))
      } else {
        mockFetch.mockResolvedValueOnce({
          choices: [{ message: { content: `T:${EXPECTED_LOCALES[i]}` } }],
        })
      }
    }

    const original = '# Nova versão\n- Feature'
    const result = await translateChangelog(original, 'pt-BR')

    expect(result.en).toBe('T:en')
    expect(result.ar).toBe(original)
  })

  it('falls back to original text when apiKey is not configured (empty string)', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      llmApiKey: '',
      llmModel: 'test-model',
    }))

    vi.resetModules()
    const mod = await import('~~/server/utils/llm-translate')

    const original = '# Nova versão\n- Feature'
    const result = await mod.translateChangelog(original, 'pt-BR')

    for (const locale of EXPECTED_LOCALES) {
      expect(result[locale], `${locale} sem apiKey`).toBe(original)
    }
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('falls back to original when apiKey is undefined', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      llmModel: 'test-model',
    }))

    vi.resetModules()
    const mod = await import('~~/server/utils/llm-translate')

    const original = '# Outra versão'
    const result = await mod.translateChangelog(original, 'pt-BR')

    expect(result.en).toBe(original)
    expect(result.es).toBe(original)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('uses default model glm-4-flash when llmModel is not configured', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      llmApiKey: 'test-key',
    }))

    vi.resetModules()
    const mod = await import('~~/server/utils/llm-translate')

    mockTranslations({})

    await mod.translateChangelog('texto', 'pt-BR')

    const callBody = mockFetch.mock.calls[0]![1] as { body: { model: string } }
    expect(callBody.body.model).toBe('glm-4-flash')
  })
})
