import { beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.fn()
vi.stubGlobal('$fetch', fetchMock)
vi.stubGlobal('useNuxtApp', () => ({
  $firebaseAuth: {
    currentUser: { getIdToken: async () => 'token-admin' },
  },
}))
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { pianoApiBase: 'https://api.example' },
}))

describe('useTelemetryHistory', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('carrega history, rankings e map em paralelo', async () => {
    fetchMock
      .mockResolvedValueOnce({
        period_days: 90,
        generated_at: '2026-11-27T12:00:00.000Z',
        online_window_min: 11,
        totals: {
          seen: 3,
          online: 1,
          offline_seen: 2,
          with_church: 2,
          with_geo: 3,
          by_platform: { 'desktop-windows': 3 },
        },
      })
      .mockResolvedValueOnce({
        items: [{ key: 'a', label: 'IASD A', devices: 2, online: 1 }],
      })
      .mockResolvedValueOnce({
        points: [
          {
            city: 'Santos',
            region: 'SP',
            country: 'BR',
            devices: 2,
            online: 1,
            is_online: true,
          },
        ],
      })

    const { useTelemetryHistory } = await import('../../../app/composables/useTelemetryHistory')
    const hist = useTelemetryHistory()
    await hist.refresh()

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(hist.history.value?.totals.seen).toBe(3)
    expect(hist.rankings.value[0].label).toBe('IASD A')
    expect(hist.mapPoints.value[0].is_online).toBe(true)
    expect(hist.error.value).toBeNull()
  })
})
