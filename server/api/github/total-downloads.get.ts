import { setHeader, type H3Event } from 'h3'
import { fetchGitHubStats } from '../../utils/dashboard-stats'
import { TOTAL_INSTALLS_SNAPSHOT } from '../../utils/github-snapshots'

/**
 * GET /api/github/total-downloads — adaptador publico e fino sobre fetchGitHubStats().
 *
 * Nota tecnica (nao exibida na UI, decisao Rafael 29/09): o numero vem da soma de
 * download_count dos assets de release do GitHub, mas o rotulo publico e
 * "Instalacoes" — downloads de asset sao tratados como instalacoes.
 *
 * Cache de 5 min no modulo (protege o rate limit de 60 req/h sem GITHUB_TOKEN em prod).
 * Fallback silencioso: em caso de erro devolve { total: null } — nunca um numero congelado.
 */

const CACHE_TTL_MS = 5 * 60 * 1000

let cached: { total: number | null; timestamp: number } | null = null

/** Override para testes — limpa o cache do modulo. */
export function clearTotalDownloadsCache(): void {
  cached = null
}

export async function handleTotalDownloads(event: H3Event): Promise<{ total: number | null }> {
  setHeader(event, 'cache-control', 'public, max-age=60, s-maxage=300')

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { total: cached.total }
  }

  // fetchGitHubStats nunca lanca — devolve { downloads: null, ... } em caso de erro
  const stats = await fetchGitHubStats()
  const fresh = stats.downloads?.total ?? null

  if (fresh !== null) {
    cached = { total: fresh, timestamp: Date.now() }
    return { total: fresh }
  }

  // FALLBACK 1: cache STALE (expirado) — melhor que snapshot, é o último valor REAL
  if (cached && cached.total !== null) {
    return { total: cached.total }
  }

  // FALLBACK 2: snapshot hardcoded (ultimo valor real conhecido, com snapshotDate)
  return { total: TOTAL_INSTALLS_SNAPSHOT.total }
}

export default defineEventHandler(handleTotalDownloads)
