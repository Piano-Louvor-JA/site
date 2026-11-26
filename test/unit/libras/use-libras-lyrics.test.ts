import { flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getLibrasGloss } from '~/src/modules/libras/services/libras-translate'
import { useLibrasLyrics } from '~/composables/useLibrasLyrics_web'

vi.stubGlobal('useCookie', () => cookie)
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
