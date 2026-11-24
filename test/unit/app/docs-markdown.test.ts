import { describe, expect, it } from 'vitest'
import { extractSections, reassemble, renderMarkdown } from '~/utils/docs-markdown'

const guide = `# Título

Intro antes.

## Primeira

Conteúdo A.

## Segunda

Conteúdo B.

### Sub

Sub-conteúdo.
`

describe('extractSections', () => {
  it('lista introdução + headings ##', () => {
    const sections = extractSections(guide)
    expect(sections.map((s) => s.title)).toEqual(['Introdução', 'Primeira', 'Segunda'])
  })

  it('guia sem headings vira uma seção', () => {
    expect(extractSections('só texto')).toHaveLength(1)
  })
})

describe('reassemble', () => {
  it('edita só a seção escolhida, resto byte-a-byte', () => {
    const sections = extractSections(guide)
    const edited = sections[1]!
    const next = reassemble(guide, edited, `## Primeira\n\nNovo conteúdo.`)
    expect(next).toContain('Novo conteúdo.')
    expect(next).toContain('Intro antes.')
    expect(next).toContain('Conteúdo B.')
    expect(next).toContain('### Sub')
    expect(next).not.toContain('Conteúdo A.')
  })
})

describe('renderMarkdown', () => {
  it('renderiza headings, bold, italic, lista, link, parágrafo', () => {
    const html = renderMarkdown('## T\n\ntexto **b** *i*\n\n- a\n- b\n\n[link](https://x.com)')
    expect(html).toContain('<h2>T</h2>')
    expect(html).toContain('<strong>b</strong>')
    expect(html).toContain('<em>i</em>')
    expect(html).toContain('<ul><li>a</li><li>b</li></ul>')
    expect(html).toContain('<a href="https://x.com" rel="noopener">link</a>')
    expect(html).toContain('<p>')
  })

  it('escapa HTML', () => {
    expect(renderMarkdown('<script>alert(1)</script>')).not.toContain('<script>')
    expect(renderMarkdown('<script>alert(1)</script>')).toContain('&lt;script&gt;')
  })

  it('link só http(s)', () => {
    expect(renderMarkdown('[x](javascript:alert(1))')).not.toContain('href="javascript')
  })
})

it('keeps a document without frontmatter editable', async () => {
  const { splitFrontmatter, reassemble } = await import('~/utils/docs-markdown')
  expect(splitFrontmatter('hello')).toEqual({ frontmatter: '', body: 'hello' })
  expect(reassemble('hello', { title: 'Introdução', start: 0, end: 1 }, 'world')).toBe('world')
})

it('preserves frontmatter while replacing a section starting at the first body line', async () => {
  const { splitFrontmatter } = await import('~/utils/docs-markdown')
  const original = '---\ntitle: Guia\nnav_order: 2\n---\n## Um\nAntes\n## Dois\nDepois'
  const sections = extractSections(original)
  expect(sections.map((s) => s.title)).toEqual(['Um', 'Dois'])
  const updated = reassemble(original, sections[0]!, '## Um\nNovo')
  expect(splitFrontmatter(updated).frontmatter).toBe('---\ntitle: Guia\nnav_order: 2\n---\n')
  expect(splitFrontmatter(updated).body).toBe('## Um\nNovo\n## Dois\nDepois')
  expect(renderMarkdown(original)).not.toContain('nav_order')
})
