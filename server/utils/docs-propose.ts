import { Octokit } from '@octokit/rest'
import { extensionForMime, type DocsImageInput } from './docs-propose-validation'

const OWNER = 'Piano-Louvor-JA'
const REPO = 'site'
const BASE = 'staging'

export interface DocsPullRequestInput {
  slug: string
  title: string
  markdown: string
  author: string
  images: DocsImageInput[]
  now?: Date
}

export interface DocsPullRequestResult {
  prNumber: number
  prUrl: string
  branch: string
}

export class DocsGithubUnavailable extends Error {
  statusCode = 503
  constructor() {
    super('Serviço de revisão indisponível. Contate a administração.')
  }
}

function timestamp(now: Date): string {
  return now
    .toISOString()
    .replace(/[-:TZ.]/g, '')
    .slice(0, 14)
}

function token(): string {
  const value = process.env.GITHUB_DOCS_TOKEN || process.env.GITHUB_TOKEN
  if (!value) throw new DocsGithubUnavailable()
  return value
}

/** Preserva frontmatter do guia atual (nav_order/toc...); só atualiza title/reviewed_at. */
function withFrontmatter(current: string, title: string, body: string): string {
  const match = current.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return `---\ntitle: ${title}\n---\n\n${body}`
  const frontmatter = (match[1] ?? '')
    .replace(/^title:.*$/m, `title: ${title}`)
    .replace(/^reviewed_at:.*$/m, 'reviewed_at: pendente')
  return `---\n${frontmatter}\n---\n\n${body}`
}

function withImageLinks(markdown: string, images: DocsImageInput[], stamp: string): string {
  if (images.length === 0) return markdown
  const links = images.map((image, index) => {
    const ext = extensionForMime(image.type)
    return `![${image.name}](/uploads/docs/${stamp}-${index + 1}.${ext})`
  })
  return `${markdown.trim()}\n\n${links.join('\n')}\n`
}

/** Markdown atual do guia (staging). Leitura para o editor carregar seções. */
export async function getGuideMarkdown(slug: string): Promise<string> {
  const octokit = new Octokit({ auth: token() })
  const file = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    ref: BASE,
    path: `content/docs/pt-BR/${slug}.md`,
  })
  if (!('content' in file.data)) throw new DocsGithubUnavailable()
  return atob(String(file.data.content))
}

export async function createDocsPullRequest(
  input: DocsPullRequestInput,
): Promise<DocsPullRequestResult> {
  const now = input.now ?? new Date()
  const stamp = timestamp(now)
  const branch = `docs/edit-${input.slug}-${stamp}`
  const octokit = new Octokit({ auth: token() })
  const baseRef = await octokit.rest.git.getRef({ owner: OWNER, repo: REPO, ref: `heads/${BASE}` })

  // Frontmatter do guia atual precisa sobreviver à edição do voluntário.
  const currentFile = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    ref: BASE,
    path: `content/docs/pt-BR/${input.slug}.md`,
  })
  const current = 'content' in currentFile.data ? atob(String(currentFile.data.content)) : ''

  await octokit.rest.git.createRef({
    owner: OWNER,
    repo: REPO,
    ref: `refs/heads/${branch}`,
    sha: baseRef.data.object.sha,
  })

  for (const [index, image] of input.images.entries()) {
    const ext = extensionForMime(image.type)
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      branch,
      path: `public/uploads/docs/${stamp}-${index + 1}.${ext}`,
      message: `docs: adiciona print ${index + 1} para ${input.slug}`,
      content: image.data,
    })
  }

  const body = withImageLinks(input.markdown, input.images, stamp)
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    branch,
    path: `content/docs/pt-BR/${input.slug}.md`,
    message: `docs: atualiza ${input.slug}`,
    content: Buffer.from(withFrontmatter(current, input.title, body)).toString('base64'),
  })

  const pr = await octokit.rest.pulls.create({
    owner: OWNER,
    repo: REPO,
    base: BASE,
    head: branch,
    title: `docs: ${input.title}`,
    body: `## Proposta de documentação\n\nEditado por: ${input.author || 'voluntário'}\n\nRevisar texto e prints antes do merge.`,
  })

  return { prNumber: pr.data.number, prUrl: pr.data.html_url, branch }
}
