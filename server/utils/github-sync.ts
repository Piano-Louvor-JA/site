import { Octokit } from '@octokit/rest'
import { writeSnapshot, getEtag } from './snapshot-store'

/**
 * Sincronizador GitHub → snapshot local.
 *
 * Roda em background (interval). NUNCA no caminho do visitante.
 * Usa requisição condicional (If-None-Match): 304 = nada mudou, custo mínimo.
 * Qualquer falha (429/5xx/network) é silenciosa — o snapshot atual permanece servindo.
 *
 * Fontes sincronizadas (todas owner Piano-Louvor-JA):
 *   all-downloads      ← listReleases de app/apk/palco-receiver + repo meta
 *   latest-app-release ← getLatestRelease de app
 *   releases           ← listReleases de app
 *   contributors       ← listContributors de app
 *   recent-activity    ← listRepoEvents de web
 */

const ORG = 'Piano-Louvor-JA'
const SYNC_INTERVAL_MS = 30 * 60 * 1000 // 30min — bem dentro do rate limit

let _octokit: Octokit | null = null

function octokit(): Octokit {
  if (!_octokit) {
    _octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || undefined })
  }
  return _octokit
}

function etagOf(response: { headers: Record<string, unknown> }): string | null {
  const h = response.headers as Record<string, string>
  return h.etag ?? null
}

/** Executa uma chamada GitHub com If-None-Match; retorna {changed, data, etag} */
async function conditional<T>(
  key: Parameters<typeof getEtag>[0],
  call: () => Promise<{ data: T; headers: Record<string, unknown> }>,
): Promise<{ changed: boolean; data: T | null; etag: string | null }> {
  const known = getEtag(key)
  try {
    const res = await call()
    const etag = etagOf(res)
    const changed = !known || !etag || etag !== known
    return { changed, data: changed ? res.data : null, etag }
  } catch (e) {
    const status = (e as { status?: number }).status
    if (status === 304) return { changed: false, data: null, etag: known }
    throw e // 429/5xx/network → caller trata
  }
}

async function syncAllDownloads(): Promise<void> {
  const ok = await conditional('all-downloads', async () => {
    const o = octokit()
    const [app, apk, palco, repoMeta] = await Promise.all([
      o.rest.repos.listReleases({ owner: ORG, repo: 'app', per_page: 100 }),
      o.rest.repos.listReleases({ owner: ORG, repo: 'apk', per_page: 100 }),
      o.rest.repos.listReleases({ owner: ORG, repo: 'palco-receiver', per_page: 100 }),
      o.rest.repos.get({ owner: ORG, repo: 'app' }),
    ])
    return {
      data: {
        app: app.data,
        apk: apk.data,
        palco: palco.data,
        stars: repoMeta.data.stargazers_count,
        forks: repoMeta.data.forks_count,
      },
      headers: app.headers,
    }
  })
  if (ok.changed && ok.data) writeSnapshot('all-downloads', ok.data, ok.etag)
}

async function syncLatestAppRelease(): Promise<void> {
  const ok = await conditional('latest-app-release', async () => {
    const res = await octokit().rest.repos.getLatestRelease({ owner: ORG, repo: 'app' })
    return { data: res.data, headers: res.headers }
  })
  if (ok.changed && ok.data) writeSnapshot('latest-app-release', ok.data, ok.etag)
}

async function syncReleases(): Promise<void> {
  const ok = await conditional('releases', async () => {
    const res = await octokit().rest.repos.listReleases({ owner: ORG, repo: 'app', per_page: 100 })
    return { data: res.data, headers: res.headers }
  })
  if (ok.changed && ok.data) writeSnapshot('releases', ok.data, ok.etag)
}

async function syncContributors(): Promise<void> {
  const ok = await conditional('contributors', async () => {
    const res = await octokit().rest.repos.listContributors({
      owner: ORG,
      repo: 'app',
      per_page: 100,
    })
    return { data: res.data, headers: res.headers }
  })
  if (ok.changed && ok.data) writeSnapshot('contributors', ok.data, ok.etag)
}

async function syncRecentActivity(): Promise<void> {
  const ok = await conditional('recent-activity', async () => {
    const res = await octokit().rest.activity.listRepoEvents({
      owner: ORG,
      repo: 'web',
      per_page: 30,
    })
    return { data: res.data, headers: res.headers }
  })
  if (ok.changed && ok.data) writeSnapshot('recent-activity', ok.data, ok.etag)
}

let running = false

/** Uma passada de sincronização. Falhas são logadas e não derrubam as demais fontes. */
export async function syncGithubSnapshots(): Promise<void> {
  if (running) return
  running = true
  const jobs: Array<[string, () => Promise<void>]> = [
    ['all-downloads', syncAllDownloads],
    ['latest-app-release', syncLatestAppRelease],
    ['releases', syncReleases],
    ['contributors', syncContributors],
    ['recent-activity', syncRecentActivity],
  ]
  for (const [name, job] of jobs) {
    try {
      await job()
    } catch (e) {
      console.warn(
        `[sync] ${name} falhou (snapshot local mantém o site servindo):`,
        e instanceof Error ? e.message : e,
      )
    }
  }
  running = false
}

/** Inicia o loop de background. Chamado uma vez no boot do server (plugin nitro). */
export function startGithubSync(): void {
  // primeira passada adiantada (1min após boot — não atrasa o start)
  setTimeout(() => void syncGithubSnapshots(), 60_000)
  setInterval(() => void syncGithubSnapshots(), SYNC_INTERVAL_MS)
}
