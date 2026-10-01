import { Octokit } from '@octokit/rest'
import { LATEST_APP_SNAPSHOT } from '../../utils/github-snapshots'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export default defineEventHandler(async (event) => {
  // During test prerender only, return stub data
  if (process.env.VITEST) {
    return {
      tag_name: 'v1.0.0',
      assets: [],
    }
  }

  try {
    const response = await octokit.rest.repos.getLatestRelease({
      owner: 'Piano-Louvor-JA',
      repo: 'app',
    })

    setHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')

    return {
      tag_name: response.data.tag_name,
      assets: response.data.assets.map((a) => ({
        name: a.name,
        browser_download_url: a.browser_download_url,
        size: a.size,
      })),
    }
  } catch (error) {
    // FALLBACK: GitHub indisponivel — serve snapshot hardcoded (ultimo release real conhecido).
    // Nunca 502: o botao de download desktop tem que funcionar sempre.
    console.error(
      '[latest-app-release] GitHub falhou, servindo snapshot:',
      error instanceof Error ? error.message : error,
    )
    return {
      tag_name: LATEST_APP_SNAPSHOT.tag_name,
      snapshot: true,
      snapshotDate: LATEST_APP_SNAPSHOT.snapshotDate,
      assets: LATEST_APP_SNAPSHOT.assets.map((a) => ({ ...a })),
    }
  }
})
