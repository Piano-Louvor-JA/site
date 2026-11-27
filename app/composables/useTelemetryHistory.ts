/**
 * Histórico 90d / rankings / mapa — GET /v1/telemetry/{history,rankings,map}.
 */
import { computed, ref } from 'vue'

export type RankingDim = 'church' | 'district' | 'city' | 'region' | 'country' | 'os'

export interface HistorySummary {
  period_days: number
  generated_at: string
  online_window_min: number
  totals: {
    seen: number
    online: number
    offline_seen: number
    with_church: number
    with_geo: number
    by_platform: Record<string, number>
  }
}

export interface RankingItem {
  key: string
  label: string
  devices: number
  online: number
}

export interface MapPoint {
  city: string | null
  region: string
  country: string
  devices: number
  online: number
  is_online: boolean
}

export const RANKING_OPTIONS: { value: RankingDim; label: string }[] = [
  { value: 'church', label: 'Igrejas' },
  { value: 'district', label: 'Distritos' },
  { value: 'city', label: 'Cidades' },
  { value: 'region', label: 'Estados (UF)' },
  { value: 'country', label: 'Países' },
  { value: 'os', label: 'Sistema operacional' },
]

async function adminToken(): Promise<string> {
  const { $firebaseAuth } = useNuxtApp() as unknown as {
    $firebaseAuth: { currentUser: { getIdToken(): Promise<string> } | null }
  }
  const token = await $firebaseAuth.currentUser?.getIdToken()
  if (!token)
    throw Object.assign(new Error('Faça login para ver a telemetria.'), { statusCode: 401 })
  return token
}

function apiBase(): string {
  return String(useRuntimeConfig().public.pianoApiBase ?? '').replace(/\/$/, '')
}

function errorMessage(e: unknown, fallback: string): string {
  const err = e as { statusCode?: number; response?: { status?: number }; message?: string }
  const status = err?.statusCode ?? err?.response?.status
  if (status === 401) return 'Sessão expirada. Entre novamente.'
  if (status === 403) return 'Sem permissão de administrador.'
  return err?.message || fallback
}

export function useTelemetryHistory() {
  const days = ref(90)
  const rankingBy = ref<RankingDim>('church')
  const history = ref<HistorySummary | null>(null)
  const rankings = ref<RankingItem[]>([])
  const mapPoints = ref<MapPoint[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const maxRankDevices = computed(() => rankings.value.reduce((m, i) => Math.max(m, i.devices), 0))

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      const token = await adminToken()
      const base = apiBase()
      const headers = { Authorization: `Bearer ${token}` }
      const q = `days=${days.value}`
      const [h, r, m] = await Promise.all([
        $fetch<HistorySummary>(`${base}/v1/telemetry/history?${q}`, { headers }),
        $fetch<{ items: RankingItem[] }>(
          `${base}/v1/telemetry/rankings?${q}&by=${rankingBy.value}&limit=40`,
          { headers },
        ),
        $fetch<{ points: MapPoint[] }>(`${base}/v1/telemetry/map?${q}&country=BR`, {
          headers,
        }),
      ])
      history.value = h
      rankings.value = r.items
      mapPoints.value = m.points
    } catch (e) {
      error.value = errorMessage(e, 'Não foi possível carregar o histórico.')
    } finally {
      loading.value = false
    }
  }

  async function setRankingBy(by: RankingDim) {
    rankingBy.value = by
    loading.value = true
    error.value = null
    try {
      const token = await adminToken()
      const base = apiBase()
      const data = await $fetch<{ items: RankingItem[] }>(
        `${base}/v1/telemetry/rankings?days=${days.value}&by=${by}&limit=40`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      rankings.value = data.items
    } catch (e) {
      error.value = errorMessage(e, 'Não foi possível carregar o ranking.')
    } finally {
      loading.value = false
    }
  }

  return {
    days,
    rankingBy,
    history,
    rankings,
    mapPoints,
    loading,
    error,
    maxRankDevices,
    refresh,
    setRankingBy,
  }
}
