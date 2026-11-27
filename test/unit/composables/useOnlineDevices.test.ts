import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Painel de Telemetria (Fase 4 — app/.planning/telemetria-dispositivos).
 * SSG: fetch direto na API (NUXT_PUBLIC_PIANO_API_BASE) com token Firebase;
 * fail-closed sem token. Filtro, ordenação e totais no cliente.
 */

let tokenValue: string | null = 'tok'
vi.stubGlobal('useNuxtApp', () => ({
  $firebaseAuth: {
    get currentUser() {
      return tokenValue === null ? null : { getIdToken: async () => tokenValue }
    },
  },
}))
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { pianoApiBase: 'https://api.test.local/' },
}))

/** localStorage em memória (o setup global troca por vi.fn vazios). */
function memoryStorage() {
  const map = new Map<string, string>()
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
  }
}
let storage = memoryStorage()

const NOW = Date.parse('2026-11-26T12:00:00.000Z')

function device(over: Record<string, unknown> = {}) {
  return {
    install_id_short: 'aaaaaa',
    platform: 'desktop-windows',
    app_version: '1.37.2',
    os: 'Windows 11 Pro 10.0.26100 x64',
    district: 'Bertioga',
    church: 'Rio da Praia',
    city: 'Bertioga',
    region: 'SP',
    country: 'BR',
    identified: true,
    first_seen: '2026-11-26T10:00:00.000Z',
    last_seen: '2026-11-26T11:58:00.000Z',
    ...over,
  }
}

const payload = {
  generated_at: '2026-11-26T12:00:00.000Z',
  online_window_min: 11,
  totals: {
    online: 4,
    identified: 3,
    unidentified: 1,
    by_platform: { 'desktop-windows': 1, 'desktop-linux': 1, 'apk-android': 1, web: 1 },
  },
  devices: [
    device(),
    device({
      install_id_short: 'bbbbbb',
      platform: 'apk-android',
      os: null,
      district: 'São Paulo Central',
      church: 'IASD Liberdade',
      city: 'São Paulo',
      region: 'SP',
      last_seen: '2026-11-26T11:59:30.000Z',
    }),
    device({
      install_id_short: 'cccccc',
      platform: 'web',
      district: null,
      church: null,
      city: 'Recife',
      region: 'PE',
      identified: false,
      source: 'passive',
      last_seen: '2026-11-26T11:50:00.000Z',
    }),
    device({
      install_id_short: 'dddddd',
      platform: 'desktop-linux',
      church: 'Ágape',
      city: null,
      region: null,
      last_seen: '2026-11-26T11:55:00.000Z',
    }),
  ],
}

async function load() {
  const mod = await import('@/composables/useOnlineDevices')
  return mod
}

describe('useOnlineDevices', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useRealTimers()
    tokenValue = 'tok'
    storage = memoryStorage()
    vi.stubGlobal('localStorage', storage)
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue(payload))
  })

  it('busca /v1/telemetry/online direto na API com Bearer e sem cache', async () => {
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    await api.refresh()
    expect($fetch).toHaveBeenCalledWith(
      'https://api.test.local/v1/telemetry/online',
      expect.objectContaining({ headers: { Authorization: 'Bearer tok' } }),
    )
    expect(api.devices.value).toHaveLength(4)
    expect(api.loading.value).toBe(false)
    expect(api.error.value).toBe('')
    expect(api.generatedAt.value).toBe(payload.generated_at)
  })

  it('fail-closed: sem usuário logado nenhuma chamada sai e vira erro de login', async () => {
    tokenValue = null
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    await api.refresh()
    expect($fetch).not.toHaveBeenCalled()
    expect(api.error.value).toContain('login')
  })

  it('401/403 viram mensagem de permissão; outros erros, mensagem genérica', async () => {
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue({ statusCode: 403 }))
    await api.refresh()
    expect(api.error.value).toContain('permissão')
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue({ response: { status: 401 } }))
    await api.refresh()
    expect(api.error.value).toContain('permissão')
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue(new Error('rede')))
    await api.refresh()
    expect(api.error.value).toContain('Não foi possível')
    // Dados anteriores não somem num erro de atualização.
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue(payload))
    await api.refresh()
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue(new Error('rede')))
    await api.refresh()
    expect(api.devices.value).toHaveLength(4)
  })

  it('resumo por grupo de plataforma, sem token e % de identificados', async () => {
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    expect(api.summary.value).toEqual({
      online: 0,
      identified: 0,
      unidentified: 0,
      identifiedPct: 0,
      groups: { desktop: 0, web: 0, apk: 0, palco: 0, outros: 0 },
    })
    await api.refresh()
    expect(api.summary.value).toEqual({
      online: 4,
      identified: 3,
      unidentified: 1,
      identifiedPct: 75,
      groups: { desktop: 2, web: 1, apk: 1, palco: 0, outros: 0 },
    })
  })

  it('filtra por token e atalho showUnidentified alterna o filtro', async () => {
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    await api.refresh()
    api.filters.identified = 'yes'
    expect(api.filtered.value.map((d) => d.install_id_short).sort()).toEqual([
      'aaaaaa',
      'bbbbbb',
      'dddddd',
    ])
    expect(api.hasFilters.value).toBe(true)
    api.filters.identified = 'no'
    expect(api.filtered.value.map((d) => d.install_id_short)).toEqual(['cccccc'])
    api.showUnidentified()
    expect(api.filters.identified).toBe('')
    expect(api.filtered.value).toHaveLength(4)
    api.showUnidentified()
    expect(api.filters.identified).toBe('no')
    api.clearFilters()
    expect(api.filters.identified).toBe('')
  })

  it('opções de filtro vêm dos dados (sem vazios, ordenadas)', async () => {
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    await api.refresh()
    expect(api.regionOptions.value).toEqual(['PE', 'SP'])
    expect(api.districtOptions.value).toEqual(['Bertioga', 'São Paulo Central'])
    expect(api.platformOptions.value).toEqual([
      'apk-android',
      'desktop-linux',
      'desktop-windows',
      'web',
    ])
  })

  it('filtra por plataforma, UF, distrito e busca livre (sem acento/caixa)', async () => {
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    await api.refresh()
    api.filters.platform = 'web'
    expect(api.filtered.value.map((d) => d.install_id_short)).toEqual(['cccccc'])
    api.filters.platform = ''
    api.filters.region = 'PE'
    expect(api.filtered.value).toHaveLength(1)
    api.filters.region = ''
    api.filters.district = 'São Paulo Central'
    expect(api.filtered.value.map((d) => d.install_id_short)).toEqual(['bbbbbb'])
    api.filters.district = ''
    api.filters.q = 'agape'
    expect(api.filtered.value.map((d) => d.install_id_short)).toEqual(['dddddd'])
    api.filters.q = 'RECIFE'
    expect(api.filtered.value.map((d) => d.install_id_short)).toEqual(['cccccc'])
    api.clearFilters()
    expect(api.filtered.value).toHaveLength(4)
    expect(api.hasFilters.value).toBe(false)
    api.filters.q = 'x'
    expect(api.hasFilters.value).toBe(true)
  })

  it('ordena: padrão pelo último sinal; clicar na coluna alterna asc/desc; nulos no fim', async () => {
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    await api.refresh()
    expect(api.filtered.value.map((d) => d.install_id_short)).toEqual([
      'bbbbbb',
      'aaaaaa',
      'dddddd',
      'cccccc',
    ])
    api.toggleSort('church')
    expect(api.sort.value).toEqual({ key: 'church', dir: 'asc' })
    expect(api.filtered.value.map((d) => d.church)).toEqual([
      'Ágape',
      'IASD Liberdade',
      'Rio da Praia',
      null,
    ])
    api.toggleSort('church')
    expect(api.sort.value.dir).toBe('desc')
    expect(api.filtered.value.map((d) => d.church)).toEqual([
      'Rio da Praia',
      'IASD Liberdade',
      'Ágape',
      null,
    ])
    api.toggleSort('church')
    expect(api.sort.value.dir).toBe('asc')
    api.toggleSort('last_seen')
    expect(api.sort.value).toEqual({ key: 'last_seen', dir: 'desc' })
    api.toggleSort('city')
    expect(api.filtered.value.map((d) => d.city)).toEqual(['Bertioga', 'Recife', 'São Paulo', null])
  })

  it('dois valores vazios na coluna ordenada ficam juntos no fim', async () => {
    vi.stubGlobal(
      '$fetch',
      vi.fn().mockResolvedValue({
        ...payload,
        devices: [
          device({ install_id_short: 'x1', app_version: null }),
          device({ install_id_short: 'x2', app_version: '1.0.0' }),
          device({ install_id_short: 'x3', app_version: null }),
        ],
      }),
    )
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    await api.refresh()
    api.toggleSort('app_version')
    expect(api.filtered.value.map((d) => d.app_version)).toEqual(['1.0.0', null, null])
  })

  it('sem pianoApiBase configurado usa caminho relativo (não quebra)', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({ public: {} }))
    const { useOnlineDevices } = await load()
    await useOnlineDevices().refresh()
    expect($fetch).toHaveBeenCalledWith('/v1/telemetry/online', expect.anything())
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: { pianoApiBase: 'https://api.test.local/' },
    }))
  })

  it('visão grade/lista: padrão grade e lembra a escolha', async () => {
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    expect(api.viewMode.value).toBe('grid')
    api.setViewMode('list')
    expect(localStorage.getItem('piano-admin-telemetria-view')).toBe('list')
    vi.resetModules()
    const again = (await load()).useOnlineDevices()
    expect(again.viewMode.value).toBe('list')
    localStorage.setItem('piano-admin-telemetria-view', 'lixo')
    vi.resetModules()
    expect((await load()).useOnlineDevices().viewMode.value).toBe('grid')
  })

  it('localStorage indisponível não quebra a visão', async () => {
    const blocked = () => {
      throw new Error('bloqueado')
    }
    vi.stubGlobal('localStorage', { getItem: blocked, setItem: blocked })
    const { useOnlineDevices } = await load()
    const api = useOnlineDevices()
    expect(api.viewMode.value).toBe('grid')
    expect(() => api.setViewMode('list')).not.toThrow()
    expect(api.viewMode.value).toBe('list')
  })

  it('polling a cada 30 s; pausa com a aba oculta e atualiza ao voltar; stop limpa', async () => {
    vi.useFakeTimers()
    const { useOnlineDevices, POLL_MS } = await load()
    const api = useOnlineDevices()
    api.start()
    await vi.advanceTimersByTimeAsync(0)
    expect($fetch).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(POLL_MS)
    expect($fetch).toHaveBeenCalledTimes(2)

    // Visível de novo com o timer rodando: não duplica.
    document.dispatchEvent(new Event('visibilitychange'))
    await vi.advanceTimersByTimeAsync(0)
    expect($fetch).toHaveBeenCalledTimes(2)

    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' })
    document.dispatchEvent(new Event('visibilitychange'))
    document.dispatchEvent(new Event('visibilitychange')) // oculta de novo, sem timer
    await vi.advanceTimersByTimeAsync(POLL_MS * 3)
    expect($fetch).toHaveBeenCalledTimes(2)

    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' })
    document.dispatchEvent(new Event('visibilitychange'))
    await vi.advanceTimersByTimeAsync(0)
    expect($fetch).toHaveBeenCalledTimes(3)
    // O intervalo religado continua atualizando.
    await vi.advanceTimersByTimeAsync(POLL_MS)
    expect($fetch).toHaveBeenCalledTimes(4)

    api.start() // idempotente
    api.stop()
    await vi.advanceTimersByTimeAsync(POLL_MS * 2)
    document.dispatchEvent(new Event('visibilitychange'))
    expect($fetch).toHaveBeenCalledTimes(4)
    api.stop()
  })

  describe('helpers de exibição', () => {
    it('platformInfo: rótulo, ícone e grupo', async () => {
      const { platformInfo } = await load()
      expect(platformInfo('desktop-windows')).toEqual({
        label: 'Windows',
        icon: 'ti-brand-windows',
        group: 'desktop',
      })
      expect(platformInfo('desktop-mac').group).toBe('desktop')
      expect(platformInfo('desktop-linux').label).toBe('Linux')
      expect(platformInfo('web')).toEqual({ label: 'Web', icon: 'ti-world', group: 'web' })
      expect(platformInfo('apk-android')).toEqual({
        label: 'Android',
        icon: 'ti-brand-android',
        group: 'apk',
      })
      expect(platformInfo('apk-ios').label).toBe('iOS')
      expect(platformInfo('palco-webos')).toEqual({
        label: 'TV LG (webOS)',
        icon: 'ti-device-tv',
        group: 'palco',
      })
      expect(platformInfo('palco-tizen').label).toBe('TV Samsung (Tizen)')
      expect(platformInfo('palco-androidtv').label).toBe('Android TV')
      expect(platformInfo('unknown')).toEqual({
        label: 'Desconhecido',
        icon: 'ti-help',
        group: 'outros',
      })
    })

    it('relativeTime: agora, minutos e horas', async () => {
      const { relativeTime } = await load()
      expect(relativeTime('2026-11-26T11:59:40.000Z', NOW)).toBe('agora')
      expect(relativeTime('2026-11-26T11:55:00.000Z', NOW)).toBe('há 5 min')
      expect(relativeTime('2026-11-26T09:30:00.000Z', NOW)).toBe('há 2 h')
      expect(relativeTime('data ruim', NOW)).toBe('—')
      // Sem "now": usa o relógio atual.
      expect(relativeTime(new Date().toISOString())).toBe('agora')
    })

    it('locationLabel: cidade/UF com o que existir', async () => {
      const { locationLabel } = await load()
      expect(locationLabel(device())).toBe('Bertioga/SP')
      expect(locationLabel(device({ city: null }))).toBe('SP')
      expect(locationLabel(device({ region: null }))).toBe('Bertioga')
      expect(locationLabel(device({ city: null, region: null }))).toBe('—')
    })
  })
})
