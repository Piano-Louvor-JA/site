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
import { TOTAL_INSTALLS_SNAPSHOT } from '~~/server/utils/github-snapshots'

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

  it('serve o snapshot hardcoded quando o GitHub falha e nao ha cache (fallback)', async () => {
    mockFetchGitHubStats.mockResolvedValueOnce({
      downloads: null,
      stars: null,
      forks: null,
    })

    const result = await handleTotalDownloads(makeEvent() as never)

    expect(result).toEqual({ total: TOTAL_INSTALLS_SNAPSHOT.total })
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

  it('cacheia tambem o fallback: erro apos sucesso nao martela a API (cache stale vence snapshot)', async () => {
    mockFetchGitHubStats
      .mockResolvedValueOnce({
        downloads: { total: 42, apps: [] },
        stars: 0,
        forks: 0,
      })
      .mockResolvedValue({
        downloads: null,
        stars: null,
        forks: null,
      })

    await handleTotalDownloads(makeEvent() as never) // popula cache com 42
    vi.useFakeTimers()
    vi.advanceTimersByTime(5 * 60 * 1000 + 1) // cache expira, mas stale e reaproveitado
    const result = await handleTotalDownloads(makeEvent() as never)

    expect(mockFetchGitHubStats).toHaveBeenCalledTimes(2)
    expect(result).toEqual({ total: 42 }) // cache stale, nao snapshot
    vi.useRealTimers()
  })

  it('apos erro sem cache, serve snapshot e refaz fetch no proximo TTL (nao congela o null)', async () => {
    mockFetchGitHubStats.mockResolvedValue({
      downloads: null,
      stars: null,
      forks: null,
    })

    await handleTotalDownloads(makeEvent() as never) // snapshot
    await handleTotalDownloads(makeEvent() as never) // tenta de novo

    expect(mockFetchGitHubStats).toHaveBeenCalledTimes(2)
  })
})
