import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_URL } from './seo-constants'

export interface LlmsDoc {
  title: string
  /** stem sem prefixo docs/pt-BR, ex: install/windows */
  slug: string
  reviewed_at?: string
  body?: string
}

const REPO_RAW = 'https://raw.githubusercontent.com/Piano-Louvor-JA/site/main'

/**
 * llms-full.txt (llmstxt.org): conteúdo integral da documentação em texto puro.
 * Recebe as páginas já consultadas (coleção nuxt/content em runtime; arquivos .md no build).
 */
export function buildLlmsFull(pages: LlmsDoc[], manualMd?: string): string {
  const parts: string[] = []
  parts.push(`# PIANO LouvorJA — Documentação completa\n`)
  parts.push(`<${SITE_URL}/docs>\n`)

  for (const page of pages) {
    parts.push(`\n---\n\n# ${page.title}\n`)
    parts.push(`Source: ${SITE_URL}/docs/${page.slug}\n`)
    parts.push(`Reviewed: ${page.reviewed_at ?? '—'}\n`)
    parts.push(`\n${page.body?.trim() ?? ''}\n`)
  }

  if (manualMd) {
    parts.push(`\n---\n\n# Manual do usuário (integral)\n`)
    parts.push(`Source: ${REPO_RAW}/content/user-manual/manual-usuario.md\n`)
    parts.push(`\n${manualMd}\n`)
  }
  return parts.join('\n')
}

/** Lê o manual do usuário do repo (ausente → undefined). */
export function readUserManual(): string | undefined {
  try {
    return readFileSync(resolve('./content/user-manual/manual-usuario.md'), 'utf8')
  } catch {
    return undefined
  }
}
