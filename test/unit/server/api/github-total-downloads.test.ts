import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// --- Mocks ---

vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)

const setHeaderMock = vi.fn()
vi.mock('h3', () => ({
  setHeader: (...args: unknown[]) => setHeaderMock(...args),
}))

const mockFetchGitHubStats = vi.fn()
vi.mock('~~/server/utils/dashboard-stats', () => ({
  fetchGitHubStats: (...args: unknown[]) => mockFetchGitHubStats(...args),
}))

import {
  clearTotalDownloadsCache,
  handleTotalDownloads,
} from '~~/server/api/github/total-downloads.get'

function makeEvent() {
  return { node: { res: { setHeader: vi.fn() } } }
}

describe('GET /api/github/total-downloads', () => {
  beforeEach(() => {
    clearTotalDownloadsCache()
    mockFetchGitHubStats.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('retorna o total de downloads (instalacoes) do fetchGitHubStats', async () => {
    mockFetchGitHubStats.mockResolvedValueOnce({
      downloads: { total: 1234, apps: [] },
      stars: 10,
      forks: 2,
    })

    const event = makeEvent()
    const result = await handleTotalDownloads(event as never)

    expect(result).toEqual({ total: 1234 })
    expect(mockFetchGitHubStats).toHaveBeenCalledTimes(1)
    expect(setHeaderMock).toHaveBeenCalledWith(
      expect.anything(),
      'cache-control',
      expect.stringContaining('s-maxage=300'),
    )
  })

  it('retorna { total: null } silenciosamente quando o GitHub falha (fallback)', async () => {
    mockFetchGitHubStats.mockResolvedValueOnce({
      downloads: null,
      stars: null,
      forks: null,
    })

    const result = await handleTotalDownloads(makeEvent() as never)

    expect(result).toEqual({ total: null })
  })

  it('usa cache de 5 minutos: segunda chamada nao refaz fetch', async () => {
    mockFetchGitHubStats.mockResolvedValue({
      downloads: { total: 42, apps: [] },
      stars: 0,
      forks: 0,
    })

    await handleTotalDownloads(makeEvent() as never)
    await handleTotalDownloads(makeEvent() as never)

    expect(mockFetchGitHubStats).toHaveBeenCalledTimes(1)
  })

  it('cache expirado (>5min) refaz o fetch', async () => {
    vi.useFakeTimers()
    mockFetchGitHubStats.mockResolvedValue({
      downloads: { total: 42, apps: [] },
      stars: 0,
      forks: 0,
    })

    await handleTotalDownloads(makeEvent() as never)
    vi.advanceTimersByTime(5 * 60 * 1000 + 1)
    await handleTotalDownloads(makeEvent() as never)

    expect(mockFetchGitHubStats).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('cacheia tambem o fallback null (nao martela a API em caso de erro)', async () => {
    mockFetchGitHubStats.mockResolvedValue({
      downloads: null,
      stars: null,
      forks: null,
    })

    await handleTotalDownloads(makeEvent() as never)
    await handleTotalDownloads(makeEvent() as never)

    expect(mockFetchGitHubStats).toHaveBeenCalledTimes(1)
  })
})
