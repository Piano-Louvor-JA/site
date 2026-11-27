import { beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.fn()
vi.stubGlobal('$fetch', fetchMock)
let currentUser: { getIdToken: () => Promise<string> } | null = {
  getIdToken: async () => 'token-admin',
}
let pianoApiBase: string | undefined = 'https://api.example'
vi.stubGlobal('useNuxtApp', () => ({
  $firebaseAuth: { currentUser },
}))
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { pianoApiBase },
}))

const loadComposable = async () => {
  const { useTelemetryHistory } = await import('../../../app/composables/useTelemetryHistory')
  return useTelemetryHistory()
}

describe('useTelemetryHistory', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    currentUser = { getIdToken: async () => 'token-admin' }
    pianoApiBase = 'https://api.example'
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

  it('estado inicial e opções de ranking', async () => {
    const mod = await import('../../../app/composables/useTelemetryHistory')
    expect(mod.RANKING_OPTIONS.map((o) => o.value)).toEqual([
      'church',
      'district',
      'city',
      'region',
      'country',
      'os',
    ])
    expect(mod.RANKING_OPTIONS.map((o) => o.label)).toEqual([
      'Igrejas',
      'Distritos',
      'Cidades',
      'Estados (UF)',
      'Países',
      'Sistema operacional',
    ])
    const hist = mod.useTelemetryHistory()
    expect(hist.days.value).toBe(90)
    expect(hist.rankingBy.value).toBe('church')
    expect(hist.history.value).toBeNull()
    expect(hist.rankings.value).toEqual([])
    expect(hist.mapPoints.value).toEqual([])
    expect(hist.loading.value).toBe(false)
    expect(hist.error.value).toBeNull()
    expect(hist.maxRankDevices.value).toBe(0)
  })

  it('refresh monta URLs e headers corretos (remove "/" final da base)', async () => {
    pianoApiBase = 'https://api.example/'
    fetchMock.mockResolvedValueOnce({}).mockResolvedValueOnce({ items: [] }).mockResolvedValueOnce({
      points: [],
    })
    const hist = await loadComposable()
    hist.days.value = 30
    hist.rankingBy.value = 'city'
    await hist.refresh()
    const headers = { Authorization: 'Bearer token-admin' }
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://api.example/v1/telemetry/history?days=30',
      {
        headers,
      },
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://api.example/v1/telemetry/rankings?days=30&by=city&limit=40',
      { headers },
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'https://api.example/v1/telemetry/map?days=30&country=BR',
      { headers },
    )
  })

  it('refresh liga e desliga loading e limpa erro anterior', async () => {
    let resolveAll: (() => void) | undefined
    const gate = new Promise<void>((r) => {
      resolveAll = r
    })
    fetchMock
      .mockImplementationOnce(async () => {
        await gate
        return { period_days: 90 }
      })
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({ points: [] })
    const hist = await loadComposable()
    hist.error.value = 'erro antigo'
    const p = hist.refresh()
    expect(hist.loading.value).toBe(true)
    expect(hist.error.value).toBeNull()
    resolveAll!()
    await p
    expect(hist.loading.value).toBe(false)
  })

  it('maxRankDevices devolve o maior número de dispositivos', async () => {
    fetchMock
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        items: [
          { key: 'a', label: 'A', devices: 2, online: 1 },
          { key: 'b', label: 'B', devices: 9, online: 0 },
          { key: 'c', label: 'C', devices: 4, online: 4 },
        ],
      })
      .mockResolvedValueOnce({ points: [] })
    const hist = await loadComposable()
    await hist.refresh()
    expect(hist.maxRankDevices.value).toBe(9)
  })

  it('sem usuário logado: erro 401 e nenhuma requisição', async () => {
    currentUser = null
    const hist = await loadComposable()
    await hist.refresh()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(hist.error.value).toBe('Sessão expirada. Entre novamente.')
    expect(hist.loading.value).toBe(false)
  })

  it('token vazio também é tratado como não autenticado', async () => {
    currentUser = { getIdToken: async () => '' }
    const hist = await loadComposable()
    await hist.refresh()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(hist.error.value).toBe('Sessão expirada. Entre novamente.')
  })

  it('base da API ausente usa string vazia', async () => {
    pianoApiBase = undefined
    fetchMock.mockResolvedValueOnce({}).mockResolvedValueOnce({ items: [] }).mockResolvedValueOnce({
      points: [],
    })
    const hist = await loadComposable()
    await hist.refresh()
    expect(fetchMock.mock.calls[0]![0]).toBe('/v1/telemetry/history?days=90')
  })

  it('refresh: 401 via statusCode', async () => {
    fetchMock.mockRejectedValue({ statusCode: 401 })
    const hist = await loadComposable()
    await hist.refresh()
    expect(hist.error.value).toBe('Sessão expirada. Entre novamente.')
    expect(hist.loading.value).toBe(false)
  })

  it('refresh: 403 via response.status', async () => {
    fetchMock.mockRejectedValue({ response: { status: 403 } })
    const hist = await loadComposable()
    await hist.refresh()
    expect(hist.error.value).toBe('Sem permissão de administrador.')
  })

  it('refresh: statusCode tem precedência sobre response.status', async () => {
    fetchMock.mockRejectedValue({ statusCode: 403, response: { status: 401 } })
    const hist = await loadComposable()
    await hist.refresh()
    expect(hist.error.value).toBe('Sem permissão de administrador.')
  })

  it('refresh: outro erro usa a message', async () => {
    fetchMock.mockRejectedValue(new Error('falhou geral'))
    const hist = await loadComposable()
    await hist.refresh()
    expect(hist.error.value).toBe('falhou geral')
  })

  it('refresh: erro sem message usa o fallback', async () => {
    fetchMock.mockRejectedValue({ statusCode: 500 })
    const hist = await loadComposable()
    await hist.refresh()
    expect(hist.error.value).toBe('Não foi possível carregar o histórico.')
  })

  it('refresh: rejeição nula/undefined usa o fallback', async () => {
    fetchMock.mockRejectedValue(undefined)
    const hist = await loadComposable()
    await hist.refresh()
    expect(hist.error.value).toBe('Não foi possível carregar o histórico.')
  })

  it('setRankingBy troca a dimensão e recarrega só o ranking', async () => {
    fetchMock.mockResolvedValueOnce({
      items: [{ key: 'SP', label: 'SP', devices: 7, online: 2 }],
    })
    const hist = await loadComposable()
    hist.days.value = 15
    const p = hist.setRankingBy('region')
    expect(hist.rankingBy.value).toBe('region')
    expect(hist.loading.value).toBe(true)
    await p
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example/v1/telemetry/rankings?days=15&by=region&limit=40',
      { headers: { Authorization: 'Bearer token-admin' } },
    )
    expect(hist.rankings.value).toEqual([{ key: 'SP', label: 'SP', devices: 7, online: 2 }])
    expect(hist.maxRankDevices.value).toBe(7)
    expect(hist.loading.value).toBe(false)
    expect(hist.error.value).toBeNull()
  })

  it('setRankingBy limpa erro anterior', async () => {
    fetchMock.mockResolvedValueOnce({ items: [] })
    const hist = await loadComposable()
    hist.error.value = 'antigo'
    await hist.setRankingBy('os')
    expect(hist.error.value).toBeNull()
  })

  it('setRankingBy: erro 401 / 403 / message / fallback', async () => {
    const hist = await loadComposable()

    fetchMock.mockRejectedValueOnce({ statusCode: 401 })
    await hist.setRankingBy('city')
    expect(hist.error.value).toBe('Sessão expirada. Entre novamente.')

    fetchMock.mockRejectedValueOnce({ response: { status: 403 } })
    await hist.setRankingBy('city')
    expect(hist.error.value).toBe('Sem permissão de administrador.')

    fetchMock.mockRejectedValueOnce(new Error('boom'))
    await hist.setRankingBy('city')
    expect(hist.error.value).toBe('boom')

    fetchMock.mockRejectedValueOnce({})
    await hist.setRankingBy('city')
    expect(hist.error.value).toBe('Não foi possível carregar o ranking.')
    expect(hist.loading.value).toBe(false)
  })

  it('setRankingBy sem login: erro 401 sem requisição', async () => {
    currentUser = null
    const hist = await loadComposable()
    await hist.setRankingBy('church')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(hist.error.value).toBe('Sessão expirada. Entre novamente.')
  })
})
