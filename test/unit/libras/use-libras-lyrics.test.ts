import { flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getLibrasGloss } from '~/src/modules/libras/services/libras-translate'
import { useLibrasLyrics } from '~/composables/useLibrasLyrics_web'

vi.stubGlobal('useCookie', (_name: string, opts?: { default?: () => boolean | null }) => {
  // Exercita a factory default do composable (coverage da arrow em useCookie).
  opts?.default?.()
  return cookie
})
vi.mock('~/src/modules/libras/services/libras-translate', () => ({
  getLibrasGloss: vi.fn(),
}))

const cookie = ref<boolean | null>(null)

beforeEach(() => {
  cookie.value = null
  vi.mocked(getLibrasGloss).mockReset()
})

afterEach(() => {
  cookie.value = null
  vi.clearAllMocks()
})

describe('useLibrasLyrics', () => {
  it('marks unavailable when the gloss is empty', async () => {
    cookie.value = true
    vi.mocked(getLibrasGloss).mockResolvedValue({ gloss: null, sourceUsed: 'fallback' })
    const lyrics = ref<string | null>('Olá')
    const { state, gloss } = useLibrasLyrics(lyrics)
    await flushPromises()
    expect(state.value).toBe('unavailable')
    expect(gloss.value).toBeNull()
  })

  it('marks unavailable when translation throws', async () => {
    cookie.value = true
    vi.mocked(getLibrasGloss).mockRejectedValue(new Error('boom'))
    const lyrics = ref<string | null>('Olá')
    const { state } = useLibrasLyrics(lyrics)
    await flushPromises()
    expect(state.value).toBe('unavailable')
  })

  it('ignores a rejected translation that became stale', async () => {
    cookie.value = true
    let rejectOld!: (error: Error) => void
    vi.mocked(getLibrasGloss).mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectOld = reject
        }),
    )
    const lyrics = ref<string | null>('Olá')
    const { state } = useLibrasLyrics(lyrics)
    cookie.value = false
    await flushPromises()
    expect(state.value).toBe('disabled')
    rejectOld(new Error('late failure'))
    await flushPromises()
    // catch stale: myToken !== token → não sobrescreve com unavailable
    expect(state.value).toBe('disabled')
  })

  it('discards a successful translation that became stale', async () => {
    cookie.value = true
    let resolveOld!: (value: { gloss: string; sourceUsed: 'api' }) => void
    vi.mocked(getLibrasGloss).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve
        }),
    )
    const lyrics = ref<string | null>('Olá')
    const { state, gloss } = useLibrasLyrics(lyrics)
    cookie.value = false
    await flushPromises()
    expect(state.value).toBe('disabled')
    resolveOld({ gloss: 'TARDE', sourceUsed: 'api' })
    await flushPromises()
    // myToken !== token → return sem aplicar gloss
    expect(state.value).toBe('disabled')
    expect(gloss.value).toBeNull()
  })

  it('handleLibrasReady sets ready gloss or clears it', async () => {
    const lyrics = ref<string | null>(null)
    const { state, gloss, handleLibrasReady } = useLibrasLyrics(lyrics)
    await flushPromises()
    handleLibrasReady('MANUAL')
    expect(state.value).toBe('ready')
    expect(gloss.value).toBe('MANUAL')
    handleLibrasReady(null)
    expect(gloss.value).toBeNull()
    expect(state.value).toBe('ready')
  })
})
