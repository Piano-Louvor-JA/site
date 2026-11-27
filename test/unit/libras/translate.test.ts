import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { getLibrasGloss } from '~/src/modules/libras/services/libras-translate'
import { getTranslation, saveTranslation } from '~/src/modules/libras/services/libras-cache'

vi.mock('~/src/modules/libras/services/libras-cache', () => ({
  getTranslation: vi.fn(),
  saveTranslation: vi.fn(),
}))

const fetchMock = vi.fn()
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getTranslation).mockResolvedValue(undefined)
  vi.mocked(saveTranslation).mockResolvedValue(undefined)
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Libras cache → API → fallback', () => {
  it('uses cached gloss without sending lyrics to the API', async () => {
    vi.mocked(getTranslation).mockResolvedValue({
      cacheKey: 'Olá mundo',
      gloss: 'OLÁ MUNDO',
      source: 'Olá mundo',
      createdAt: 0,
    })
    expect(await getLibrasGloss(' Olá\r\n mundo ')).toEqual({
      gloss: 'OLÁ MUNDO',
      sourceUsed: 'cache',
    })
    expect(getTranslation).toHaveBeenCalledWith('Olá mundo')
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('keeps an API translation when IndexedDB cannot store it', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ gloss: 'OLÁ' }) })
    vi.mocked(saveTranslation).mockRejectedValue(new Error('storage denied'))
    expect(await getLibrasGloss(' Olá ')).toEqual({ gloss: 'OLÁ', sourceUsed: 'api' })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://traducao2.vlibras.gov.br/translate',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ texto: 'Olá' }) }),
    )
  })
  it.each(['network', 'http', 'invalid'])('falls back after %s failure', async (failure) => {
    if (failure === 'network') fetchMock.mockRejectedValue(new Error('offline'))
    else fetchMock.mockResolvedValue({ ok: failure !== 'http', json: async () => ({ gloss: 123 }) })
    expect(await getLibrasGloss('Oi paz')).toEqual({ gloss: 'O I _ P A Z', sourceUsed: 'fallback' })
  })

  it('falls back with underscore for words without letters/digits', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ gloss: '   ' }) })
    expect(await getLibrasGloss('!!! ???')).toEqual({
      gloss: '_ _ _',
      sourceUsed: 'fallback',
    })
  })

  it('aborts a slow VLibras request and falls back', async () => {
    vi.useFakeTimers()
    try {
      fetchMock.mockImplementation(
        (_url: string, init?: { signal?: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () =>
              reject(new DOMException('Aborted', 'AbortError')),
            )
          }),
      )
      const pending = getLibrasGloss('Lento')
      await vi.advanceTimersByTimeAsync(15_000)
      await expect(pending).resolves.toEqual({
        gloss: 'L E N T O',
        sourceUsed: 'fallback',
      })
    } finally {
      vi.useRealTimers()
    }
  })
})
