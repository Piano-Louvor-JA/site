/**
 * Painel de Telemetria — dispositivos online (app/.planning/telemetria-dispositivos, Fase 4).
 *
 * SSG: fetch direto na API pública via NUXT_PUBLIC_PIANO_API_BASE (nunca rota
 * Nitro relativa). Token Firebase no Authorization; fail-closed sem token.
 * Contrato: GET /v1/telemetry/online (api/src/v1/telemetry/telemetry.routes.ts).
 *
 * Busca tudo de uma vez e filtra/ordena no cliente: os cards do topo mostram o
 * total geral e as opções de filtro saem dos próprios dados.
 */
import { computed, reactive, ref } from 'vue'

export type PresenceSource = 'heartbeat' | 'passive'

export interface OnlineDevice {
  install_id_short: string
  platform: string
  app_version: string | null
  os: string | null
  district: string | null
  church: string | null
  city: string | null
  region: string | null
  country: string | null
  identified: boolean
  /** heartbeat = app atual; passive = tráfego sem token (app antigo). */
  source?: PresenceSource
  first_seen: string
  last_seen: string
}

export interface OnlineResponse {
  generated_at: string
  online_window_min: number
  totals: {
    online: number
    identified: number
    unidentified?: number
    by_platform: Record<string, number>
  }
  devices: OnlineDevice[]
}

export type PlatformGroup = 'desktop' | 'web' | 'apk' | 'palco' | 'outros'
export type ViewMode = 'grid' | 'list'
export type SortKey = 'last_seen' | 'church' | 'district' | 'city' | 'platform' | 'app_version'

export const POLL_MS = 30_000
const VIEW_KEY = 'piano-admin-telemetria-view'

const PLATFORMS: Record<string, { label: string; icon: string; group: PlatformGroup }> = {
  'desktop-windows': { label: 'Windows', icon: 'ti-brand-windows', group: 'desktop' },
  'desktop-mac': { label: 'macOS', icon: 'ti-brand-apple', group: 'desktop' },
  'desktop-linux': { label: 'Linux', icon: 'ti-brand-ubuntu', group: 'desktop' },
  web: { label: 'Web', icon: 'ti-world', group: 'web' },
  'apk-android': { label: 'Android', icon: 'ti-brand-android', group: 'apk' },
  'apk-ios': { label: 'iOS', icon: 'ti-brand-apple', group: 'apk' },
  'palco-webos': { label: 'TV LG (webOS)', icon: 'ti-device-tv', group: 'palco' },
  'palco-tizen': { label: 'TV Samsung (Tizen)', icon: 'ti-device-tv', group: 'palco' },
  'palco-androidtv': { label: 'Android TV', icon: 'ti-device-tv', group: 'palco' },
}

export function platformInfo(platform: string): {
  label: string
  icon: string
  group: PlatformGroup
} {
  return PLATFORMS[platform] ?? { label: 'Desconhecido', icon: 'ti-help', group: 'outros' }
}

export function relativeTime(iso: string, now = Date.now()): string {
  const ts = Date.parse(iso)
  if (Number.isNaN(ts)) return '—'
  const min = Math.floor((now - ts) / 60_000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  return `há ${Math.floor(min / 60)} h`
}

export function locationLabel(d: Pick<OnlineDevice, 'city' | 'region'>): string {
  return [d.city, d.region].filter(Boolean).join('/') || '—'
}

function fold(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

function readView(): ViewMode {
  try {
    return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

function errorStatus(e: unknown): number | undefined {
  const err = e as { statusCode?: number; response?: { status?: number } }
  return err?.statusCode ?? err?.response?.status
}

function uniqueSorted(values: (string | null)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v)))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )
}

export function useOnlineDevices() {
  const devices = ref<OnlineDevice[]>([])
  const generatedAt = ref<string | null>(null)
  const loading = ref(false)
  const error = ref('')
  const filters = reactive({
    platform: '',
    region: '',
    district: '',
    q: '',
    /** '' = todos; 'yes' = com token; 'no' = sem token */
    identified: '' as '' | 'yes' | 'no',
  })
  const sort = ref<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'last_seen', dir: 'desc' })
  const viewMode = ref<ViewMode>(readView())

  async function refresh(): Promise<void> {
    const { $firebaseAuth } = useNuxtApp() as unknown as {
      $firebaseAuth: { currentUser: { getIdToken(): Promise<string> } | null }
    }
    const token = await $firebaseAuth.currentUser?.getIdToken()
    if (!token) {
      error.value = 'Sessão expirada. Faça login de novo no admin.'
      return
    }
    const base = String(useRuntimeConfig().public.pianoApiBase ?? '').replace(/\/$/, '')
    loading.value = true
    try {
      const data = await $fetch<OnlineResponse>(`${base}/v1/telemetry/online`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      devices.value = data.devices
      generatedAt.value = data.generated_at
      error.value = ''
    } catch (e) {
      const status = errorStatus(e)
      error.value =
        status === 401 || status === 403
          ? 'Sua conta não tem permissão para ver a telemetria.'
          : 'Não foi possível carregar os dispositivos online.'
    } finally {
      loading.value = false
    }
  }

  const summary = computed(() => {
    const groups: Record<PlatformGroup, number> = {
      desktop: 0,
      web: 0,
      apk: 0,
      palco: 0,
      outros: 0,
    }
    let identified = 0
    for (const d of devices.value) {
      groups[platformInfo(d.platform).group]++
      if (d.identified) identified++
    }
    const online = devices.value.length
    const unidentified = online - identified
    return {
      online,
      identified,
      unidentified,
      identifiedPct: online ? Math.round((identified / online) * 100) : 0,
      groups,
    }
  })

  const platformOptions = computed(() => uniqueSorted(devices.value.map((d) => d.platform)))
  const regionOptions = computed(() => uniqueSorted(devices.value.map((d) => d.region)))
  const districtOptions = computed(() => uniqueSorted(devices.value.map((d) => d.district)))

  const hasFilters = computed(() =>
    Boolean(
      filters.platform || filters.region || filters.district || filters.q || filters.identified,
    ),
  )

  const filtered = computed(() => {
    const q = fold(filters.q)
    const rows = devices.value.filter((d) => {
      if (filters.platform && d.platform !== filters.platform) return false
      if (filters.region && d.region !== filters.region) return false
      if (filters.district && d.district !== filters.district) return false
      if (filters.identified === 'yes' && !d.identified) return false
      if (filters.identified === 'no' && d.identified) return false
      if (q && !fold([d.church, d.district, d.city].join(' ')).includes(q)) return false
      return true
    })
    const { key, dir } = sort.value
    const factor = dir === 'asc' ? 1 : -1
    return rows.sort((a, b) => {
      const va = a[key]
      const vb = b[key]
      if (!va && !vb) return 0
      if (!va) return 1
      if (!vb) return -1
      return fold(va).localeCompare(fold(vb), 'pt-BR') * factor
    })
  })

  function toggleSort(key: SortKey): void {
    if (sort.value.key === key) {
      sort.value = { key, dir: sort.value.dir === 'asc' ? 'desc' : 'asc' }
    } else {
      sort.value = { key, dir: key === 'last_seen' ? 'desc' : 'asc' }
    }
  }

  function clearFilters(): void {
    filters.platform = ''
    filters.region = ''
    filters.district = ''
    filters.q = ''
    filters.identified = ''
  }

  /** Atalho dos cards do topo: filtrar só quem está sem token. */
  function showUnidentified(): void {
    filters.identified = filters.identified === 'no' ? '' : 'no'
  }

  function setViewMode(mode: ViewMode): void {
    viewMode.value = mode
    try {
      localStorage.setItem(VIEW_KEY, mode)
    } catch {
      // armazenamento bloqueado: a escolha vale só nesta visita
    }
  }

  let timer: ReturnType<typeof setInterval> | null = null

  function onVisibility(): void {
    if (document.visibilityState === 'hidden') {
      if (timer) clearInterval(timer)
      timer = null
    } else if (!timer) {
      void refresh()
      timer = setInterval(() => void refresh(), POLL_MS)
    }
  }

  let started = false
  function start(): void {
    if (started) return
    started = true
    void refresh()
    timer = setInterval(() => void refresh(), POLL_MS)
    document.addEventListener('visibilitychange', onVisibility)
  }

  function stop(): void {
    started = false
    if (timer) clearInterval(timer)
    timer = null
    document.removeEventListener('visibilitychange', onVisibility)
  }

  return {
    devices,
    generatedAt,
    loading,
    error,
    filters,
    sort,
    viewMode,
    summary,
    platformOptions,
    regionOptions,
    districtOptions,
    hasFilters,
    filtered,
    refresh,
    toggleSort,
    clearFilters,
    showUnidentified,
    setViewMode,
    start,
    stop,
  }
}
