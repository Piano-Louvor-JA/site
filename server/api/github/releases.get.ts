import { Octokit } from '@octokit/rest'

// Token opcional — sem token, usa unauthenticated (60 req/h, suficiente com cache)
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined,
})

// Tipos para releases
interface GitHubRelease {
  tag_name: string
  name: string
  published_at: string
  draft?: boolean
  html_url: string
  body: string
  _repo: string
  created_at?: string
  assets?: Array<{
    name: string
    browser_download_url: string
    content_type: string
    size: number
  }>
}

export default defineEventHandler(async (event) => {
  // During test prerender only, return stub data (CI needs real releases for SSG)
  if (process.env.VITEST) {
    return [
      {
        tag_name: 'v0.1.53',
        name: 'Mobile v0.1.53',
        published_at: '2025-01-25T10:00:00Z',
        _repo: 'apk',
        html_url: 'https://github.com/Piano-Louvor-JA/apk/releases/tag/v0.1.53',
        body: 'Test release',
        assets: [],
      },
      {
        tag_name: 'v0.1.13',
        name: 'Palco Receiver v0.1.13',
        published_at: '2025-01-20T10:00:00Z',
        _repo: 'palco-receiver',
        html_url: 'https://github.com/Piano-Louvor-JA/palco-receiver/releases/tag/v0.1.13',
        body: 'Test release',
        assets: [],
      },
      {
        tag_name: 'v1.17.5',
        name: 'Release v1.17.5',
        published_at: '2025-01-15T10:00:00Z',
        _repo: 'web',
        html_url: 'https://github.com/Piano-Louvor-JA/web/releases/tag/v1.17.5',
        body: 'Test release',
        assets: [],
      },
      {
        tag_name: 'v1.17.5',
        name: 'Release v1.17.5',
        published_at: '2025-01-15T10:00:00Z',
        _repo: 'app',
        html_url: 'https://github.com/Piano-Louvor-JA/app/releases/tag/v1.17.5',
        body: 'Test release',
        assets: [],
      },
      {
        tag_name: 'v1.0.0',
        name: 'API v1.0.0',
        published_at: '2025-01-10T10:00:00Z',
        _repo: 'api',
        html_url: 'https://github.com/Piano-Louvor-JA/api/releases/tag/v1.0.0',
        body: 'Test release',
        assets: [],
      },
      {
        tag_name: 'v1.0.0',
        name: 'Site v1.0.0',
        published_at: '2025-01-05T10:00:00Z',
        _repo: 'site',
        html_url: 'https://github.com/Piano-Louvor-JA/site/releases/tag/v1.0.0',
        body: 'Test release',
        assets: [],
      },
    ] as GitHubRelease[]
  }

  const repos = ['web', 'app', 'api', 'site', 'palco-receiver', 'apk'] as const
  const allReleases: GitHubRelease[] = []

  // Fetch em paralelo — se um falhar, os outros ainda funcionam
  const results = await Promise.allSettled(
    repos.map(async (repo) => {
      const response = await octokit.rest.repos.listReleases({
        owner: 'Piano-Louvor-JA',
        repo,
        per_page: 10,
      })

      return response.data.map((r: any) => ({
        ...r,
        _repo: repo,
      })) as GitHubRelease[]
    }),
  )

  for (let i = 0; i < results.length; i++) {
    const result = results[i]!
    const repo = repos[i]

    if (result.status === 'fulfilled') {
      // Drafts não têm published_at (e o site não deve listá-las): filtra antes
      const published = result.value.filter((r) => !r.draft && r.published_at)
      allReleases.push(...published)
    } else {
      // Loga mas nao derruba a resposta inteira
      console.error(`Error fetching releases from ${repo}:`, result.reason)
    }
  }

  // Ordena por data de publicacao (mais recentes primeiro)
  const ts = (r: GitHubRelease) => {
    const raw = r.published_at ?? r.created_at
    const ms = raw ? new Date(raw).getTime() : Number.NaN
    return Number.isNaN(ms) ? Number.NEGATIVE_INFINITY : ms
  }
  allReleases.sort((a, b) => {
    const dateA = ts(a)
    const dateB = ts(b)
    return dateB - dateA
  })

  setHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')

  return allReleases
})
