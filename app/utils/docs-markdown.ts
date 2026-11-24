/**
 * Parser/render de markdown MÍNIMO para o editor de docs (SPEC v1.3).
 * Client-side, zero dependências. Ceiling: preview de revisor — não usar em produção.
 */

export interface DocsSection {
  /** Heading sem '## ' (ou 'Introdução' para o bloco antes do primeiro ##) */
  title: string
  /** start/end são índices de LINHA no corpo (sem frontmatter) */
  start: number
  end: number
}

const H2 = /^## /

/** Divide o corpo (sem frontmatter) em seções pelos headings '## '. */
export function extractSections(markdown: string): DocsSection[] {
  const body = stripFrontmatter(markdown)
  const lines = body.split('\n')
  const headings: number[] = []
  lines.forEach((line, index) => {
    if (H2.test(line)) headings.push(index)
  })
  if (headings.length === 0) return [{ title: 'Introdução', start: 0, end: lines.length }]
  const sections: DocsSection[] = []
  if (headings[0]! > 0) sections.push({ title: 'Introdução', start: 0, end: headings[0]! })
  headings.forEach((start, index) => {
    const end = index + 1 < headings.length ? headings[index + 1]! : lines.length
    sections.push({ title: (lines[start] ?? '').replace(H2, '').trim(), start, end })
  })
  return sections
}

function stripFrontmatter(markdown: string): string {
  const match = markdown.match(/^---\n[\s\S]*?\n---\n?/)
  return match ? markdown.slice(match[0].length) : markdown
}

/** Frontmatter cru (para o endpoint preservar) + corpo. */
export function splitFrontmatter(markdown: string): { frontmatter: string; body: string } {
  const match = markdown.match(/^---\n[\s\S]*?\n---\n?/)
  if (!match) return { frontmatter: '', body: markdown }
  return { frontmatter: match[0], body: markdown.slice(match[0].length) }
}

/**
 * Substitui a seção `section` (extraída do `original`) pelo `editedBlock`
 * (bloco completo, heading incluso). Frontmatter intocado.
 */
export function reassemble(original: string, section: DocsSection, editedBlock: string): string {
  const { frontmatter, body } = splitFrontmatter(original)
  const lines = body.split('\n')
  const next = [
    ...lines.slice(0, section.start),
    ...editedBlock.split('\n'),
    ...lines.slice(section.end),
  ]
  return frontmatter + next.join('\n')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function safeHref(href: string): string {
  return /^https?:\/\//.test(href) ? escapeHtml(href) : '#'
}

function inline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
      return `<a href="${safeHref(href)}" rel="noopener">${label}</a>`
    })
}

/** Render minimalista e seguro (escape primeiro, markdown depois). */
export function renderMarkdown(markdown: string): string {
  const body = stripFrontmatter(markdown)
  const out: string[] = []
  let list: string[] | null = null

  const flushList = () => {
    if (list) {
      out.push(`<ul>${list.map((item) => `<li>${item}</li>`).join('')}</ul>`)
      list = null
    }
  }

  for (const rawLine of body.split('\n')) {
    const line = escapeHtml(rawLine.trimEnd())
    const heading = line.match(/^(#{1,3}) (.+)$/)
    const item = line.match(/^- (.+)$/)
    if (item) {
      list = list ?? []
      list.push(inline(item[1]!))
      continue
    }
    flushList()
    if (heading) {
      const level = heading[1]!.length
      out.push(`<h${level}>${inline(heading[2]!)}</h${level}>`)
    } else if (line === '') {
      // parágrafo separa sozinho
    } else {
      out.push(`<p>${inline(line)}</p>`)
    }
  }
  flushList()
  return out.join('\n')
}
