import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useInstallsCount } from '~/composables/useInstallsCount'

async function flush(times = 4) {
  for (let i = 0; i < times; i++) await Promise.resolve()
}

describe('useInstallsCount', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ total: null }))
  })

  it('inicia com fallback "0" e loaded false', () => {
    const { installsNum, installsRaw, loaded } = useInstallsCount()
    expect(installsNum.value).toBe('0')
    expect(installsRaw.value).toBe(0)
    expect(loaded.value).toBe(false)
  })

  it('atualiza e formata o total em pt-BR apos load()', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ total: 1234 }))
    const { installsNum, installsRaw, loaded, load } = useInstallsCount()

    await load()
    await flush()

    expect(installsNum.value).toBe('1.234')
    expect(installsRaw.value).toBe(1234)
    expect(loaded.value).toBe(true)
    expect($fetch).toHaveBeenCalledWith('/api/github/total-downloads')
  })

  it('mantem "0" quando total e null (fallback silencioso)', async () => {
    const { installsNum, installsRaw, loaded, load } = useInstallsCount()

    await load()
    await flush()

    expect(installsNum.value).toBe('0')
    expect(installsRaw.value).toBe(0)
    expect(loaded.value).toBe(true)
  })

  it('mantem "0" quando total e 0', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ total: 0 }))
    const { installsNum, load } = useInstallsCount()

    await load()
    await flush()

    expect(installsNum.value).toBe('0')
  })

  it('mantem "0" quando o fetch rejeita', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue(new Error('network')))
    const { installsNum, loaded, load } = useInstallsCount()

    await load()
    await flush()

    expect(installsNum.value).toBe('0')
    expect(loaded.value).toBe(true)
  })
})
